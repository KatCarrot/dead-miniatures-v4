import * as tus from "tus-js-client";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

/**
 * Supabase's resumable (TUS) upload endpoint lives on the dedicated storage
 * subdomain for better throughput on large files:
 *   https://<project-ref>.supabase.co  ->  https://<project-ref>.storage.supabase.co
 *
 * NOTE the `/sign` suffix. This is the PRESIGNED resumable endpoint: it
 * authorizes each request by validating the `x-signature` token (scoped to
 * one bucket + object path) and performs the write itself — it does NOT run
 * the insert as the caller's anon role, so no storage.objects INSERT policy
 * is needed. The plain `/upload/resumable` endpoint (no `/sign`) would
 * authenticate as anon and be blocked by RLS — that was the 403 we hit.
 */
function resumableEndpoint(): string {
  const { hostname } = new URL(SUPABASE_URL);
  const projectRef = hostname.split(".")[0];
  return `https://${projectRef}.storage.supabase.co/storage/v1/upload/resumable/sign`;
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
        // The PRESIGNED resumable endpoint (`/upload/resumable/sign`) takes
        // exactly two things:
        //   - `apikey`: the PUBLIC anon key, so the API gateway accepts the
        //     request. It is NOT the write authorization — there is
        //     deliberately no anon INSERT policy on this bucket. Do NOT add
        //     an `authorization: Bearer` header here: that makes Storage
        //     authenticate as the anon role and run the insert under RLS
        //     (→ 403 "new row violates row-level security policy").
        //   - `x-signature`: the actual write authorization. A short-lived,
        //     single-use token minted server-side by the admin-gated
        //     /api/artworks/video-upload-url route via createSignedUploadUrl
        //     (service-role key), scoped to this one bucket + object path.
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
