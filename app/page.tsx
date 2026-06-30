import TopNav from "@/components/TopNav";
import Hero from "@/components/Hero";
import PaintedPiecesPreview from "@/components/PaintedPiecesPreview";
import AboutArtist from "@/components/AboutArtist";
import { getLatestArtworks } from "@/lib/queries";

/**
 * Landing page — route "/".
 * Server-fetches the latest pieces; the preview tabs filter them client-side.
 */
export default async function HomePage() {
  const latest = await getLatestArtworks(6);

  return (
    <main className="relative min-h-screen overflow-hidden bg-bg font-mono text-cream">
      <TopNav />
      <Hero />
      <PaintedPiecesPreview items={latest} />
      <AboutArtist />
    </main>
  );
}
