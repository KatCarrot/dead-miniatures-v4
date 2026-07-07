import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import GalleryView from "@/components/GalleryView";
import { getArtworks } from "@/lib/queries";

/**
 * Showcase / gallery — route "/showcase".
 * Server-fetches the full `artworks` table; the client view filters by
 * category tab (from the URL hash) without another round-trip.
 */
export default async function ShowcasePage() {
  const artworks = await getArtworks();

  return (
    <main style={{ position: "relative", background: "var(--bg)" }}>
      <SiteHeader variant="inner" />
      <GalleryView artworks={artworks} />
      <SiteFooter />
    </main>
  );
}
