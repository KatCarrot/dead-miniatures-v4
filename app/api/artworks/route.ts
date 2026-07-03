import { NextResponse } from "next/server";
import { auth, isAdminSub } from "@/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { CATEGORIES } from "@/types/artwork";
import { ARTWORK_VIDEO_BUCKET, ALLOWED_VIDEO_MIME_TYPES } from "@/lib/videoBucket";

export const runtime = "nodejs";

/**
 * POST /api/artworks — create a new artwork row.
 *
 * Guarded twice: the middleware keeps non-admins out of /admin, and this
 * handler re-checks the Auth.js session server-side (belt and braces, since
 * the API path itself isn't in the middleware matcher). Admin status is
 * derived from the verified Google OIDC `sub` (ADMIN_GOOGLE_SUBS), not
 * email. All Supabase writes use the service-role client, which never
 * leaves the server.
 *
 * Accepts a small JSON body — text fields plus the storage paths/URLs the
 * images were ALREADY uploaded to (see POST /api/artworks/upload-url, which
 * the client calls first to get a signed URL and PUTs the file straight to
 * Supabase Storage). Image bytes never pass through this function, so there
 * is no serverless request-body size limit to hit on large photos:
 *   name, category, status, sculptor, scale, game_system,
 *   time_hours, description   — text fields
 *   image_url                 — public URL of the already-uploaded cover (required)
 *   extra_images               — array of public URLs of already-uploaded extras
 *   video_url, video_path,
 *   video_mime_type            — optional; set together when a video was
 *                                already uploaded (see POST
 *                                /api/artworks/video-upload-url). If the DB
 *                                insert below fails, the just-uploaded video
 *                                is deleted so it doesn't become an orphaned
 *                                object with no artwork row pointing at it.
 */
export async function POST(req: Request) {
  const session = await auth();
  if (!isAdminSub(session?.sub)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Expected application/json" },
      { status: 400 }
    );
  }

  const name = String(body.name ?? "").trim();
  const category = String(body.category ?? "").trim();
  const status = String(body.status ?? "available").trim();

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  if (!(CATEGORIES as readonly string[]).includes(category)) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }
  if (status !== "available" && status !== "sold") {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const timeRaw = String(body.time_hours ?? "").trim();
  const time_hours = timeRaw ? Number(timeRaw) : null;
  if (time_hours != null && Number.isNaN(time_hours)) {
    return NextResponse.json(
      { error: "Time (hours) must be a number" },
      { status: 400 }
    );
  }

  const image_url = String(body.image_url ?? "").trim();
  if (!image_url) {
    return NextResponse.json(
      { error: "A cover image is required" },
      { status: 400 }
    );
  }
  const extra_images = Array.isArray(body.extra_images)
    ? body.extra_images.filter((u): u is string => typeof u === "string" && u.length > 0)
    : [];

  const video_url = typeof body.video_url === "string" ? body.video_url.trim() : "";
  const video_path = typeof body.video_path === "string" ? body.video_path.trim() : "";
  const video_mime_type =
    typeof body.video_mime_type === "string" ? body.video_mime_type.trim() : "";

  if (video_url) {
    if (!video_path) {
      return NextResponse.json(
        { error: "Missing video_path for uploaded video" },
        { status: 400 }
      );
    }
    if (!(ALLOWED_VIDEO_MIME_TYPES as readonly string[]).includes(video_mime_type)) {
      return NextResponse.json({ error: "Invalid video MIME type" }, { status: 400 });
    }
  }

  const row = {
    name,
    category,
    status,
    sculptor: emptyToNull(body.sculptor),
    scale: emptyToNull(body.scale),
    game_system: emptyToNull(body.game_system),
    time_hours,
    description: emptyToNull(body.description),
    image_url,
    extra_images: extra_images.length ? extra_images : null,
    video_url: video_url || null,
    video_path: video_path || null,
    video_mime_type: video_mime_type || null,
  };

  const { data, error } = await supabaseAdmin
    .from("artworks")
    .insert(row)
    .select("id")
    .single();

  if (error) {
    // The video upload already succeeded (it happens before this insert) —
    // don't leave it orphaned in Storage with no artwork row pointing at it.
    if (video_path) {
      try {
        await supabaseAdmin.storage.from(ARTWORK_VIDEO_BUCKET).remove([video_path]);
      } catch {
        // best-effort cleanup; the DB error below is what the client sees
      }
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: data.id }, { status: 201 });
}

function emptyToNull(v: unknown): string | null {
  const s = String(v ?? "").trim();
  return s.length ? s : null;
}
