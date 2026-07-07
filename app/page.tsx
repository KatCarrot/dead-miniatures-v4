import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import HomeView from "@/components/HomeView";
import { getArtworks } from "@/lib/queries";
import { CATEGORY_TABS } from "@/config/categories";
import type { Category } from "@/types/artwork";

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
    <>
      {/* Hero renders 3 stacked layers via CSS background-image (see HomeView).
          Preload them so all three arrive together instead of trickling in
          one-by-one after CSS/JS discovery. */}
      <link
        rel="preload"
        as="image"
        href="/brand/hero-bg-opt.webp"
        fetchPriority="high"
      />
      <link rel="preload" as="image" href="/brand/hero-logo-bg-opt.webp" />
      <link rel="preload" as="image" href="/samples/hero-fig-opt.webp" />
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
    </>
  );
}
