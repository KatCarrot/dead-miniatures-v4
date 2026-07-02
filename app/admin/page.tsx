import { redirect } from "next/navigation";
import Link from "next/link";
import { auth, isAdminSub, signOut } from "@/auth";
import AdminForm from "./AdminForm";

/**
 * /admin — new-artwork form. Server-guarded: middleware blocks non-admins,
 * and we re-check here so the page never renders for a stray session.
 */
export default async function AdminPage() {
  const session = await auth();
  if (!isAdminSub(session?.sub)) redirect("/login");

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--text)",
        fontFamily: "var(--font-sf)",
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px clamp(20px,5vw,64px)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: 160,
              height: 56,
              background:
                "url('/brand/dead-logo.png') left center/contain no-repeat",
            }}
          />
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <span style={{ fontSize: 14, color: "var(--text-dim)" }}>
            {session?.user?.email}
          </span>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button
              type="submit"
              style={{
                background: "transparent",
                border: "1px solid var(--line)",
                color: "var(--text)",
                padding: "8px 16px",
                cursor: "pointer",
                fontFamily: "var(--font-sf)",
                fontSize: 14,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      <div
        style={{
          maxWidth: 760,
          margin: "0 auto",
          padding: "48px clamp(20px,5vw,64px) 120px",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            fontSize: "clamp(48px,7vw,72px)",
            lineHeight: 0.95,
            margin: "0 0 8px",
            textTransform: "uppercase",
          }}
        >
          Add a piece
        </h1>
        <p
          style={{
            margin: "0 0 40px",
            fontSize: 16,
            color: "var(--text-dim)",
          }}
        >
          Fill the form and publish — it goes straight into the live showcase.
        </p>
        <AdminForm />
      </div>
    </main>
  );
}
