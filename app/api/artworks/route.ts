import { NextResponse } from "next/server";
import { auth, isAdminSub } from "@/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { CATEGORIES } from "@/types/artwork";

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
  };

  const { data, error } = await supabaseAdmin
    .from("artworks")
    .insert(row)
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: data.id }, { status: 201 });
}

function emptyToNull(v: unknown): string | null {
  const s = String(v ?? "").trim();
  return s.length ? s : null;
}
