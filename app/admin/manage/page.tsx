import { redirect } from "next/navigation";
import Link from "next/link";
import { auth, isAdminSession, signOut } from "@/auth";
import { getArtworks } from "@/lib/queries";
import ManageList from "./ManageList";

/**
 * /admin/manage — list every piece with inline quick-edit (name/category/
 * status) and delete. Server-guarded like /admin: middleware blocks
 * non-admins, and we re-check here so the page never renders for a stray
 * session. The list itself is a public-read query (same as /showcase); only
 * the PATCH/DELETE calls it makes are admin-gated (see
 * app/api/artworks/[id]/route.ts).
 */
export default async function ManagePage() {
  const session = await auth();
  if (!isAdminSession(session)) redirect("/login");

  const artworks = await getArtworks();

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
                "url('/brand/dead-logo.webp') left center/contain no-repeat",
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
          maxWidth: 960,
          margin: "0 auto",
          padding: "48px clamp(20px,5vw,64px) 120px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
            marginBottom: 8,
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: "clamp(40px,6vw,60px)",
              lineHeight: 0.95,
              margin: 0,
              textTransform: "uppercase",
            }}
          >
            Manage pieces
          </h1>
          <Link
            href="/admin"
            style={{
              fontSize: 14,
              color: "var(--accent)",
              textDecoration: "none",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            + Add a piece
          </Link>
        </div>
        <p style={{ margin: "0 0 32px", fontSize: 16, color: "var(--text-dim)" }}>
          Edit name, category, and status inline, or remove a piece entirely.
        </p>

        <ManageList initial={artworks} />
      </div>
    </main>
  );
}
