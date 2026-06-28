import { createClient } from "@supabase/supabase-js";

/**
 * Public, read-only Supabase client (anon key).
 * Works in both Server and Client Components because it carries no cookies —
 * the gallery is public data guarded by an RLS "select to anon" policy.
 *
 * Requires (in .env.local / Vercel env):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error(
    "Missing Supabase env vars: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY"
  );
}

export const supabase = createClient(url, anonKey);
