import * as tus from "tus-js-client";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

/**
 * Supabase's resumable (TUS) upload endpoint lives on the dedicated storage
 * subdomain for better throughput on large files:
 *   https://<project-ref>.supabase.co  ->  https://<project-ref>.storage.supabase.co
 */
function resumableEndpoint(): string {
  const { hostname } = new URL(SUPABASE_URL);
  const projectRef = hostname.split(".")[0];
  return `https://${projectRef}.storage.supabase.co/storage/v1/upload/resumable`;
}

/**
 * Uploads a file straight from the browser to Supabase Storage over TUS,
 * authorized by a short-lived signed token from createSignedUploadUrl
 * (minted server-side — see /api/artworks/video-upload-url). No long-lived
 * credential reaches the browser: the write is authorized solely by the
 * one-time `x-signature` token, scoped to this exact bucket + object path.
 */
export function uploadResumable(opts: {
  file: File;
  bucket: string;
  path: string;
  token: string;
  onProgress?: (percent: number) => void;
}): Promise<void> {
  const { file, bucket, path, token, onProgress } = opts;

  return new Promise((resolve, reject) => {
    const upload = new tus.Upload(file, {
      endpoint: resumableEndpoint(),
      retryDelays: [0, 3000, 5000, 10000, 20000],
      headers: {
        // Three distinct things here, none of them a stand-in for one
        // another:
        //   - `authorization` / `apikey`: the PUBLIC anon key. Required by
        //     the API gateway to accept the request at all. This is not a
        //     user session and grants no storage.objects write on its own
        //     — there is deliberately no anon INSERT/UPDATE policy on this
        //     bucket, so possessing the anon key alone cannot write here.
        //   - `x-signature`: the actual write authorization — a
        //     short-lived, single-use signed token minted server-side by
        //     the admin-gated /api/artworks/video-upload-url route via
        //     createSignedUploadUrl (service-role key). THIS is what
        //     permits the write, scoped to exactly this one object path —
        //     never the anon key, and the signed token itself must never
        //     be sent as the `authorization` bearer (that's a different,
        //     unrelated credential slot and Storage will reject the
        //     request — "Invalid Compact JWS" — if authorization is
        //     missing or not a well-formed key).
        authorization: `Bearer ${ANON_KEY}`,
        apikey: ANON_KEY,
        "x-signature": token,
      },
      uploadDataDuringCreation: true,
      removeFingerprintOnSuccess: true,
      metadata: {
        bucketName: bucket,
        objectName: path,
        contentType: file.type,
        cacheControl: "3600",
      },
      chunkSize: 6 * 1024 * 1024, // required to be 6MB by Supabase Storage
      onError: (error) => {
        // Surface the Storage server's response body (safe — it's just a
        // JSON error like {statusCode, error, message}, never a token or
        // key) so the admin form can show something actionable instead of
        // a bare "tus: unexpected response" string.
        let message = error instanceof Error ? error.message : String(error);
        const body = (error as { originalResponse?: { getBody?: () => string } })
          ?.originalResponse?.getBody?.();
        if (body) message += ` — response body: ${body}`;
        reject(new Error(message));
      },
      onProgress: (bytesUploaded, bytesTotal) => {
        onProgress?.(Math.round((bytesUploaded / bytesTotal) * 100));
      },
      onSuccess: () => resolve(),
    });

    upload
      .findPreviousUploads()
      .then((previous) => {
        if (previous.length) upload.resumeFromPreviousUpload(previous[0]);
        upload.start();
      })
      .catch(reject);
  });
}
