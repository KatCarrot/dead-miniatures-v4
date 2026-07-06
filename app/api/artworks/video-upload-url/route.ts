import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { auth, isAdminSession } from "@/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import {
  ARTWORK_VIDEO_BUCKET,
  MAX_VIDEO_BYTES,
  ALLOWED_VIDEO_MIME_TYPES,
} from "@/lib/videoBucket";

export const runtime = "nodejs";

const EXT_BY_MIME: Record<string, string> = {
  "video/mp4": "mp4",
  "video/webm": "webm",
};

/**
 * POST /api/artworks/video-upload-url — mint a signed, resumable (TUS)
 * upload slot for one artwork video.
 *
 * Videos never pass through this (or any) Next.js function — the browser
 * uploads them straight to Supabase Storage over TUS using the signed token
 * this route returns. That sidesteps Vercel's request body size limit
 * entirely (the same reason cover/extra images use a signed-URL PUT).
 *
 * Nothing from the client is trusted:
 *  - the Auth.js session is re-verified server-side (isAdminSub), same as
 *    every other write path — sign-in alone is never enough, and the
 *    Google `sub` this checks against comes from the verified session, not
 *    anything the browser sent in this request.
 *  - contentType must be exactly video/mp4 or video/webm.
 *  - size must be a positive number under the 50MB cap.
 *  - the storage path is generated here (timestamp + random UUID) — the
 *    client only supplies a filename to pick an extension from, never the
 *    bucket or the path itself.
 * The 50MB + MIME check is ALSO enforced at the Supabase Storage layer
 * (bucket file_size_limit / allowed_mime_types — see sql/video-migration.sql),
 * so even a modified client that lies about size/type is rejected by
 * Storage when the actual bytes land.
 *
 * Body: { filename: string, contentType: string, size: number }
 * Response: { bucket, path, token, publicUrl, contentType }
 */
export async function POST(req: Request) {
  const session = await auth();
  if (!isAdminSession(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { filename?: string; contentType?: string; size?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Expected JSON" }, { status: 400 });
  }

  const contentType = String(body.contentType ?? "").toLowerCase().trim();
  if (!(ALLOWED_VIDEO_MIME_TYPES as readonly string[]).includes(contentType)) {
    return NextResponse.json(
      { error: "Only MP4 or WebM video files are allowed" },
      { status: 400 }
    );
  }

  const size = Number(body.size);
  if (!Number.isFinite(size) || size <= 0) {
    return NextResponse.json({ error: "Invalid file size" }, { status: 400 });
  }
  if (size > MAX_VIDEO_BYTES) {
    return NextResponse.json(
      {
        error: `Video exceeds the ${(MAX_VIDEO_BYTES / (1024 * 1024)).toFixed(
          0
        )}MB limit`,
      },
      { status: 400 }
    );
  }

  const filename = String(body.filename ?? "").trim();
  if (!filename || filename.length > 200) {
    return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
  }

  // Server-generated, unpredictable path — never client-chosen.
  const ext = EXT_BY_MIME[contentType];
  const path = `${Date.now()}-${randomUUID()}.${ext}`;

  const { data, error } = await supabaseAdmin.storage
    .from(ARTWORK_VIDEO_BUCKET)
    .createSignedUploadUrl(path);

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message || "Could not create upload URL" },
      { status: 500 }
    );
  }

  const { data: pub } = supabaseAdmin.storage
    .from(ARTWORK_VIDEO_BUCKET)
    .getPublicUrl(path);

  return NextResponse.json({
    bucket: ARTWORK_VIDEO_BUCKET,
    path: data.path,
    token: data.token,
    publicUrl: pub.publicUrl,
    contentType,
  });
}
