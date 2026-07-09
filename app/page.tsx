import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import HomeView from "@/components/HomeView";
import { getArtworks } from "@/lib/queries";
import { CATEGORY_TABS } from "@/config/categories";
import type { Category } from "@/types/artwork";

// Server-fetches artwork counts/data on every request — without this, Next
// treats the route as static (no dynamic APIs used) and caches the HTML at
// build time, so newly added/edited pieces never show up until a rebuild.
export const dynamic = "force-dynamic";

/**
 * Landing page — route "/".
 */
export default async function HomePage() {
  const artworks = await getArtworks();
  const counts = CATEGORY_TABS.reduce((acc, { key }) => {
    acc[key] = artworks.filter((a) => a.category === key).length;
    return acc;
  }, {} as Record<Category, number>);

  return (
    <main
      style={{
        position: "relative",
        background: "var(--bg)",
        color: "var(--text)",
        fontFamily: "var(--font-sf)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('/brand/scratch-tex.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.18,
          mixBlendMode: "color-dodge",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <SiteHeader variant="home" />
      <HomeView counts={counts} />
      <SiteFooter />
    </main>
  );
}
