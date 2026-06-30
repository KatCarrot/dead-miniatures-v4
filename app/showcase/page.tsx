import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import GalleryView from "@/components/GalleryView";

/**
 * Showcase / gallery — route "/showcase".
 * Client-fetches the live `artworks` table and filters by category tab.
 */
export default function ShowcasePage() {
  return (
    <main style={{ position: "relative", background: "var(--bg)" }}>
      <SiteHeader variant="inner" />
      <GalleryView />
      <SiteFooter />
    </main>
  );
}
