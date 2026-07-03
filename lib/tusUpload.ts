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
        // The anon key establishes the base (anon) role for the request;
        // x-signature is what actually authorizes this specific upload,
        // overriding storage.objects RLS for this path only. Without the
        // authorization header present, Storage falls back to plain anon
        // auth and the (intentionally locked-down, no anon-insert) RLS
        // policy on the bucket rejects the write with a 403.
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
      onError: (error) => reject(error instanceof Error ? error : new Error(String(error))),
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
