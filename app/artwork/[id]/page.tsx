import Link from "next/link";
import { notFound } from "next/navigation";
import TopNav from "@/components/TopNav";
import ProductGallery from "@/components/ProductGallery";
import { StatusBadge } from "@/components/StatusBadge";
import { getArtwork } from "@/lib/queries";
import { collectImages } from "@/lib/images";

/** Two-row label/value meta block. */
function MetaGroup({ pairs }: { pairs: [string, string | null][] }) {
  return (
    <div className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-3">
      {pairs.map(([label, value]) => (
        <div key={label} className="contents">
          <span className="font-mono text-base font-medium uppercase text-white/60">
            {label}
          </span>
          <span className="font-mono text-base font-medium uppercase text-white">
            {value ?? "—"}
          </span>
        </div>
      ))}
    </div>
  );
}

/**
 * Product page — route "/artwork/[id]".
 */
export default async function ArtworkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const art = await getArtwork(Number(id));
  if (!art) notFound();

  const images = collectImages(art.image_url, art.extra_images);

  return (
    <main className="relative min-h-screen overflow-hidden bg-bg font-mono text-cream">
      <TopNav />

      <div className="mx-auto max-w-[1432px] px-5 pb-32 pt-10 sm:px-12 lg:px-[92px]">
        <Link
          href="/showcase"
          className="mb-9 inline-flex items-center gap-2.5 text-base text-cream transition hover:text-accent"
        >
          <span className="text-lg leading-none">&#8592;</span>
          Back to all painted pieces
        </Link>

        {/* title + meta */}
        <div className="mb-10 flex flex-col gap-7 md:flex-row md:justify-between">
          <div className="flex flex-wrap items-center gap-4">
            <h1 className="m-0 font-display text-[clamp(44px,6vw,60px)] leading-none text-cream">
              {art.name}
            </h1>
            <StatusBadge status={art.status} />
          </div>

          <div className="flex flex-col gap-5 md:flex-row md:gap-24">
            <MetaGroup
              pairs={[
                ["Sculptor", art.sculptor],
                ["Scale", art.scale],
              ]}
            />
            <MetaGroup
              pairs={[
                ["Game system", art.game_system],
                ["Time", art.time_hours != null ? `~${art.time_hours} hours` : null],
              ]}
            />
          </div>
        </div>

        <ProductGallery images={images} alt={art.name} />

        {art.description && (
          <section className="mt-12 border-t border-cream/10 pt-8">
            <div className="mb-4 font-mono text-sm font-medium uppercase tracking-wide text-white/60">
              Description
            </div>
            <p className="m-0 max-w-[760px] text-base leading-relaxed text-cream">
              {art.description}
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
