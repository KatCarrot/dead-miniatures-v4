import { createClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client — SERVER ONLY.
 *
 * This key bypasses Row Level Security, so it must never reach the browser.
 * It is imported only from server-side code (API route handlers) that already
 * sits behind the Auth.js admin check. Do NOT prefix it with NEXT_PUBLIC and
 * do NOT import this file from a Client Component.
 *
 * Required env vars:
 *   NEXT_PUBLIC_SUPABASE_URL       (same project URL)
 *   SUPABASE_SERVICE_ROLE_KEY      Supabase → Settings → API → service_role
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  throw new Error(
    "Missing Supabase admin env vars: set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY"
  );
}

export const supabaseAdmin = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

/** Storage bucket that holds uploaded artwork photos (create it as public). */
export const ARTWORK_BUCKET = "artwork-images";
