"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArtworkCard } from "./ArtworkCard";
import { TABS_WITH_ALL, ALL_KEY, type TabKey } from "@/config/categories";
import type { ArtworkCardData } from "@/types/artwork";

/**
 * Landing "Painted Pieces" section.
 * Receives the latest artworks (server-fetched, newest-first, small limit) and
 * filters them CLIENT-SIDE by tab — no navigation. Only "View All Work" leaves
 * for /showcase.
 */
export default function PaintedPiecesPreview({
  items,
}: {
  items: ArtworkCardData[];
}) {
  const [active, setActive] = useState<TabKey>(ALL_KEY);

  const filtered = useMemo(
    () =>
      active === ALL_KEY
        ? items
        : items.filter(
            // DB categories are UPPERCASE — normalize both sides defensively.
            (item) => item.category?.toUpperCase() === active.toUpperCase()
          ),
    [active, items]
  );

  return (
    <section className="relative z-10 mx-auto max-w-[1432px] px-5 pb-10 pt-20 sm:px-12 lg:px-[92px]">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end md:gap-10">
        <h2 className="m-0 font-display text-[clamp(56px,8vw,120px)] leading-[0.9] text-cream">
          Painted Pieces
        </h2>
        <p className="m-0 max-w-[340px] font-mono text-[clamp(16px,1.6vw,22px)] leading-tight text-cream">
          Every detail is intentional. Nothing is left to chance.
        </p>
      </div>

      {/* tabs — client-side filter */}
      <div className="my-[30px] flex flex-wrap gap-1">
        {TABS_WITH_ALL.map((tab) => {
          const on = tab.key === active;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActive(tab.key)}
              className={`rounded-lg border px-3 py-[11px] font-mono text-base font-medium uppercase transition ${
                on
                  ? "border-accent text-accent"
                  : "border-transparent text-cream hover:text-accent"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(258px,1fr))]">
          {filtered.map((art) => (
            <ArtworkCard key={art.id} art={art} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center text-dim">
          No recent pieces in this category.
        </div>
      )}

      <div className="mt-12 flex justify-center">
        <Link
          href="/showcase"
          className="inline-flex items-center justify-center border border-accent px-6 py-[11px] font-mono text-base font-medium text-accent transition hover:bg-accent hover:text-deep"
        >
          View All Work
        </Link>
      </div>
    </section>
  );
}
