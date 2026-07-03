import { NextResponse } from "next/server";
import { auth, isAdminSub } from "@/auth";
import { supabaseAdmin, ARTWORK_BUCKET } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

/**
 * POST /api/artworks/upload-url — mint a signed Supabase Storage upload URL.
 *
 * The admin form calls this ONCE per image before publishing, then PUTs the
 * file bytes straight to Supabase Storage from the browser (bypassing this
 * server entirely). That keeps every request to our own serverless function
 * tiny — just JSON — so large photos never hit the platform's request body
 * size limit (the cause of the old "413 Payload Too Large" error, which came
 * from proxying full image files through the /api/artworks function).
 *
 * Body: { filename: string }
 * Response: { path, token, publicUrl }
 */
export async function POST(req: Request) {
  const session = await auth();
  if (!isAdminSub(session?.sub)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { filename?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Expected JSON" }, { status: 400 });
  }

  const filename = String(body.filename ?? "");
  const ext = (filename.split(".").pop() || "png").toLowerCase().slice(0, 8);
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { data, error } = await supabaseAdmin.storage
    .from(ARTWORK_BUCKET)
    .createSignedUploadUrl(path);

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message || "Could not create upload URL" },
      { status: 500 }
    );
  }

  const { data: pub } = supabaseAdmin.storage
    .from(ARTWORK_BUCKET)
    .getPublicUrl(path);

  return NextResponse.json({
    path: data.path,
    token: data.token,
    publicUrl: pub.publicUrl,
  });
}
