import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import GalleryView from "@/components/GalleryView";
import { getArtworks } from "@/lib/queries";

// Without this, Next treats the route as static (no dynamic APIs used) and
// caches the HTML at build time, so newly added/edited pieces and their tab
// counts never show up until a rebuild.
export const dynamic = "force-dynamic";

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
