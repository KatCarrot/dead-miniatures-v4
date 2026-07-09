import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ProductView from "@/components/ProductView";
import { getArtwork, getArtworks } from "@/lib/queries";

// Without this, Next treats the route as static (no dynamic APIs used) and
// caches each piece's HTML at build time, so status changes (e.g. sold) and
// newly added pieces never show up until a rebuild.
export const dynamic = "force-dynamic";

/**
 * Single artwork detail — route "/artwork/[id]".
 * Server-fetches the piece + the ordered list (for prev/next), then hands off
 * to the interactive client viewer.
 */
export default async function ArtworkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numId = Number(id);

  const [artwork, all] = await Promise.all([
    getArtwork(numId),
    getArtworks(),
  ]);

  if (!artwork) notFound();

  // prev/next around the current id, wrapping (same order as the gallery: id desc)
  const order = all.map((a) => ({ id: a.id, name: a.name }));
  const pos = order.findIndex((x) => x.id === numId);
  const prev = pos >= 0 ? order[(pos - 1 + order.length) % order.length] : null;
  const next = pos >= 0 ? order[(pos + 1) % order.length] : null;

  return (
    <main style={{ position: "relative", background: "var(--bg)" }}>
      <SiteHeader variant="inner" />
      <ProductView
        artwork={artwork}
        prev={prev && prev.id !== numId ? prev : null}
        next={next && next.id !== numId ? next : null}
      />
      <SiteFooter />
    </main>
  );
}
