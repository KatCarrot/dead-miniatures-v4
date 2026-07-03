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
 * (minted server-side — see /api/artworks/video-upload-url). The token goes
 * in the `x-signature` header, Supabase Storage's documented mechanism for
 * presigned resumable uploads, so no long-lived credential ever reaches
 * the browser.
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
        // Per Supabase's documented presigned-resumable-upload flow: the
        // signed token goes ONLY in x-signature. It is NOT a bearer/session
        // token, so it must not be sent as `authorization`. `apikey` is the
        // public anon key, required by the API gateway for routing — it
        // grants no write access on its own; the write is authorized solely
        // by possessing a valid, single-use x-signature token that only the
        // admin-gated /api/artworks/video-upload-url route ever mints.
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
