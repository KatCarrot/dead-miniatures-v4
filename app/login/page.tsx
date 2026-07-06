import { redirect } from "next/navigation";
import { signIn, auth, isAdminSession } from "@/auth";

/**
 * Sign-in screen. One button → Google OAuth. Any Google account can sign
 * in; accounts not on the ADMIN_GOOGLE_SUBS allowlist just aren't admins
 * and get bounced back here by /admin.
 */
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; callbackUrl?: string }>;
}) {
  const session = await auth();
  if (isAdminSession(session)) redirect("/admin");

  const { error, callbackUrl } = await searchParams;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--text)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        fontFamily: "var(--font-sf)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "var(--card)",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)",
          padding: 40,
          display: "flex",
          flexDirection: "column",
          gap: 28,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div
            style={{
              width: 180,
              height: 64,
              background: "url('/brand/dead-logo.png') left center/contain no-repeat",
            }}
          />
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: 40,
              lineHeight: 1,
              margin: 0,
              textTransform: "uppercase",
            }}
          >
            Admin
          </h1>
          <p style={{ margin: 0, fontSize: 15, color: "var(--text-dim)" }}>
            Sign in with the studio Google account to add new pieces.
          </p>
        </div>

        {error && (
          <div
            style={{
              fontSize: 14,
              color: "#ff6b6b",
              background: "rgba(255,107,107,0.08)",
              padding: "12px 14px",
              lineHeight: 1.5,
            }}
          >
            {error === "AccessDenied"
              ? "That Google account isn't authorised for admin access."
              : "Sign-in failed. Please try again."}
          </div>
        )}

        <form
          action={async () => {
            "use server";
            await signIn("google", {
              redirectTo: callbackUrl || "/admin",
            });
          }}
        >
          <button
            type="submit"
            style={{
              width: "100%",
              height: 48,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              background: "var(--text)",
              color: "#111",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-sf)",
              fontSize: 16,
              fontWeight: 600,
            }}
          >
            <GoogleGlyph />
            Continue with Google
          </button>
        </form>
      </div>
    </main>
  );
}

function GoogleGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.71-1.57 2.68-3.89 2.68-6.62z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.02-3.7H.96v2.34A9 9 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.98 10.72a5.4 5.4 0 0 1 0-3.44V4.94H.96a9 9 0 0 0 0 8.12l3.02-2.34z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.9 11.43 0 9 0A9 9 0 0 0 .96 4.94l3.02 2.34C4.68 5.16 6.66 3.58 9 3.58z"
      />
    </svg>
  );
}
