import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_MESSAGE_LENGTH = 4000;

/**
 * POST /api/contact — public endpoint behind the "/" contact form.
 *
 * No auth required (any visitor can submit), so this route does its own
 * validation before writing. Consent is a hard requirement, not just a UI
 * nicety: `consent` must be `true` in the body or the row is rejected — this
 * is the GDPR legal basis (Art. 6(1)(a)) recorded alongside the message, see
 * sql/contact-messages.sql and /privacy.
 *
 * Writes go through the service-role client because contact_messages has no
 * RLS policies at all (deny-by-default) — this is the one path allowed to
 * write to it.
 */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Expected application/json" }, { status: 400 });
  }

  const email = String(body.email ?? "").trim();
  const message = String(body.message ?? "").trim();
  const consent = body.consent === true;

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
  }
  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      { error: `Message must be under ${MAX_MESSAGE_LENGTH} characters` },
      { status: 400 }
    );
  }
  if (!consent) {
    return NextResponse.json(
      { error: "Please agree to the Privacy Policy to send a message" },
      { status: 400 }
    );
  }

  const { error } = await supabaseAdmin.from("contact_messages").insert({
    email,
    message,
    consent_at: new Date().toISOString(),
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
