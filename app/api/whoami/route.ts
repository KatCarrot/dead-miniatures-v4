import { NextResponse } from "next/server";
import { auth } from "@/auth";

export const runtime = "nodejs";

/**
 * TEMPORARY: GET /api/whoami
 *
 * Requires a valid Auth.js session (any signed-in Google account — this
 * does NOT require or check admin status). Returns only the caller's own
 * Google OIDC `sub`, read from the verified session/JWT that Auth.js
 * already validated. No access tokens, ID tokens, secrets, or environment
 * variables are ever read or returned here.
 *
 * Remove once no longer needed for debugging/onboarding admins.
 */
export async function GET() {
  const session = await auth();

  if (!session?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ sub: session.sub });
}
