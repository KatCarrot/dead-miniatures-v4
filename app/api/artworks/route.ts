import { NextResponse } from "next/server";
import { auth, isAdminSub } from "@/auth";
import { supabaseAdmin, ARTWORK_BUCKET } from "@/lib/supabaseAdmin";
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
 * Accepts multipart/form-data:
 *   name, category, status, sculptor, scale, game_system,
 *   time_hours, description  — text fields
 *   cover                    — main image file (required)
 *   extras                   — zero or more additional image files
 */
export async function POST(req: Request) {
  const session = await auth();
  if (!isAdminSub(session?.sub)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json(
      { error: "Expected multipart/form-data" },
      { status: 400 }
    );
  }

  const name = String(form.get("name") ?? "").trim();
  const category = String(form.get("category") ?? "").trim();
  const status = String(form.get("status") ?? "available").trim();

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  if (!(CATEGORIES as readonly string[]).includes(category)) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }
  if (status !== "available" && status !== "sold") {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const timeRaw = String(form.get("time_hours") ?? "").trim();
  const time_hours = timeRaw ? Number(timeRaw) : null;
  if (time_hours != null && Number.isNaN(time_hours)) {
    return NextResponse.json(
      { error: "Time (hours) must be a number" },
      { status: 400 }
    );
  }

  // --- upload images to Supabase Storage ---
  const cover = form.get("cover");
  if (!(cover instanceof File) || cover.size === 0) {
    return NextResponse.json(
      { error: "A cover image is required" },
      { status: 400 }
    );
  }

  const extras = form
    .getAll("extras")
    .filter((f): f is File => f instanceof File && f.size > 0);

  async function upload(file: File): Promise<string> {
    const ext = (file.name.split(".").pop() || "png").toLowerCase();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabaseAdmin.storage
      .from(ARTWORK_BUCKET)
      .upload(path, file, {
        contentType: file.type || "image/png",
        upsert: false,
      });
    if (error) throw new Error(`Upload failed: ${error.message}`);
    const { data } = supabaseAdmin.storage
      .from(ARTWORK_BUCKET)
      .getPublicUrl(path);
    return data.publicUrl;
  }

  let image_url: string;
  let extra_images: string[];
  try {
    image_url = await upload(cover);
    extra_images = await Promise.all(extras.map(upload));
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Image upload failed" },
      { status: 500 }
    );
  }

  const row = {
    name,
    category,
    status,
    sculptor: emptyToNull(form.get("sculptor")),
    scale: emptyToNull(form.get("scale")),
    game_system: emptyToNull(form.get("game_system")),
    time_hours,
    description: emptyToNull(form.get("description")),
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

function emptyToNull(v: FormDataEntryValue | null): string | null {
  const s = String(v ?? "").trim();
  return s.length ? s : null;
}
