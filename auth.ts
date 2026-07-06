import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

/**
 * Auth.js (NextAuth v5) configuration.
 *
 * Admin access is an ALLOWLIST of Google OIDC "sub" identifiers — the
 * stable, unique id from the verified Google ID token — kept in an
 * environment variable, never in source control. Emails can change or be
 * reused across Google accounts; sub cannot, so it's the correct value to
 * gate admin privileges on.
 *
 * Set ADMIN_GOOGLE_SUBS in .env.local (and in Vercel) to a comma-separated
 * list of allowed Google account "sub" values, e.g.
 *
 *   ADMIN_GOOGLE_SUBS=104852001234567890123
 *
 * Sign in once with GET /api/whoami to read your own sub, then add it here.
 *
 * ADMIN_GOOGLE_SUBS is OPTIONAL and never gates sign-in: if it's unset,
 * any verified Google account can still sign in — isAdmin is just false for
 * everyone until the allowlist is configured.
 *
 * Required env vars (all secret — none prefixed NEXT_PUBLIC):
 *   AUTH_SECRET          openssl rand -base64 33
 *   AUTH_GOOGLE_ID       Google OAuth client id
 *   AUTH_GOOGLE_SECRET   Google OAuth client secret
 *   ADMIN_GOOGLE_SUBS    comma-separated allowlist of Google "sub" ids (optional)
 */
const adminGoogleSubs = (process.env.ADMIN_GOOGLE_SUBS ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

// Optional second allowlist, by Google account email. Only ever matched
// against a Google-VERIFIED email (email_verified === true), so an
// unverified or spoofed address can never gain admin. `sub` remains the
// more robust key (emails can change or be reassigned), but email is far
// easier to hand out — an account matching EITHER list is an admin.
const adminGoogleEmails = (process.env.ADMIN_GOOGLE_EMAILS ?? "")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

export function isAdminSub(sub?: string | null): boolean {
  if (!sub) return false;
  return adminGoogleSubs.includes(sub);
}

export function isAdminEmail(
  email?: string | null,
  emailVerified?: boolean
): boolean {
  if (!email || emailVerified !== true) return false;
  return adminGoogleEmails.includes(email.toLowerCase());
}

/** True when a session is admin by EITHER its Google sub or its verified email. */
export function isAdminSession(session?: {
  sub?: string | null;
  emailVerified?: boolean;
  user?: { email?: string | null } | null;
} | null): boolean {
  return (
    isAdminSub(session?.sub) ||
    isAdminEmail(session?.user?.email, session?.emailVerified)
  );
}

declare module "next-auth" {
  interface Session {
    /** Verified Google OIDC `sub` for the signed-in user. */
    sub?: string;
    /** Whether Google reported this account's email as verified. */
    emailVerified?: boolean;
    isAdmin?: boolean;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    // Any verified Google account may sign in. Admin privileges are NOT a
    // sign-in gate — they're checked separately (isAdminSub) by /admin and
    // by write API routes, so a missing/empty ADMIN_GOOGLE_SUBS never blocks
    // authentication itself.
    async signIn() {
      return true;
    },
    // Persist the Google OIDC `sub` (stable account id) and the verified
    // email flag from the verified profile onto the JWT at sign-in time.
    async jwt({ token, profile }) {
      if (profile?.sub) token.sub = profile.sub;
      if (profile) {
        if (typeof profile.email === "string") token.email = profile.email;
        if (typeof profile.email_verified === "boolean") {
          token.email_verified = profile.email_verified;
        }
      }
      return token;
    },
    // Expose only the verified sub + verified-email flag + a derived isAdmin
    // flag on the session. Never attach access tokens, id tokens, or other
    // secrets here.
    async session({ session, token }) {
      const sub = typeof token.sub === "string" ? token.sub : undefined;
      const emailVerified = token.email_verified === true;
      session.sub = sub;
      session.emailVerified = emailVerified;
      session.isAdmin =
        isAdminSub(sub) || isAdminEmail(session.user?.email, emailVerified);
      return session;
    },
  },
});
