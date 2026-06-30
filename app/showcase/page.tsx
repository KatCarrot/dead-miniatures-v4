import TopNav from "@/components/TopNav";
import { CategoryFilter } from "@/components/CategoryFilter";
import { ArtworkCard } from "@/components/ArtworkCard";
import { getArtworks } from "@/lib/queries";
import { ALL_KEY, type TabKey } from "@/config/categories";

/**
 * Showcase gallery — route "/showcase".
 * Category is read from the URL (?category=KEY) and filtered on the server.
 */
export default async function ShowcasePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  // Normalize URL input to UPPERCASE so it matches DB values + active-tab styling.
  const active = (category?.toUpperCase() ?? ALL_KEY) as TabKey;
  const items = await getArtworks(active);

  return (
    <main className="relative min-h-screen overflow-hidden bg-bg font-mono text-cream">
      <TopNav />

      <div className="mx-auto max-w-[1432px] px-5 pb-32 pt-14 sm:px-12 lg:px-[92px]">
        <h1 className="mb-10 font-display text-[clamp(64px,9vw,120px)] leading-[0.92] text-cream">
          Showcase
        </h1>

        <CategoryFilter active={active} />

        {items.length > 0 ? (
          <div className="mt-10 grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(258px,1fr))]">
            {items.map((art) => (
              <ArtworkCard key={art.id} art={art} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-base text-dim">
            No pieces in this category yet.
          </div>
        )}
      </div>
    </main>
  );
}
