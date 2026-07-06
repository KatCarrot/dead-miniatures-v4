import { NextResponse } from "next/server";
import { auth, isAdminSession } from "@/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { CATEGORIES } from "@/types/artwork";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

/**
 * PATCH /api/artworks/:id — quick-edit name/category/status from the admin
 * "Manage pieces" list. DELETE /api/artworks/:id — remove the row entirely.
 *
 * Both admin-gated the same way as POST /api/artworks: middleware keeps
 * non-admins out of /admin, and this handler re-checks the Auth.js session
 * server-side (the API path itself isn't in the middleware matcher). All
 * writes use the service-role client, which never leaves the server.
 */
export async function PATCH(req: Request, { params }: Params) {
  const session = await auth();
  if (!isAdminSession(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: idParam } = await params;
  const id = Number(idParam);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
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

  const update: Record<string, string> = {};

  if (typeof body.name === "string") {
    const name = body.name.trim();
    if (!name) {
      return NextResponse.json({ error: "Name can't be empty" }, { status: 400 });
    }
    update.name = name;
  }
  if (typeof body.category === "string") {
    if (!(CATEGORIES as readonly string[]).includes(body.category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }
    update.category = body.category;
  }
  if (typeof body.status === "string") {
    if (body.status !== "available" && body.status !== "sold") {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    update.status = body.status;
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("artworks")
    .update(update)
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await auth();
  if (!isAdminSession(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: idParam } = await params;
  const id = Number(idParam);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from("artworks").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
