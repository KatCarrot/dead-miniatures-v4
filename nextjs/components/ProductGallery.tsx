"use client";

import { useState } from "react";
import Image from "next/image";

/**
 * Product media: large main image + 2×2 thumbnail grid.
 * Clicking a thumbnail swaps the main image. Equal-height columns on desktop.
 */
export default function ProductGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [idx, setIdx] = useState(0);

  if (images.length === 0) {
    return <div className="aspect-[4/3] w-full bg-deep md:aspect-[704/746]" />;
  }

  const active = Math.min(idx, images.length - 1);

  return (
    <div className="grid gap-4 md:grid-cols-[1.43fr_1fr] md:items-stretch">
      {/* main */}
      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-deep md:aspect-[704/746]">
        <Image
          src={images[active]}
          alt={alt}
          fill
          priority
          sizes="(max-width: 820px) 100vw, 60vw"
          className="object-cover"
        />
        <button
          type="button"
          aria-label="Play video"
          className="relative z-10 flex h-[60px] w-[60px] items-center justify-center rounded-full bg-black/35 backdrop-blur-sm transition hover:bg-black/55"
        >
          <span className="ml-[3px] block h-0 w-0 border-y-[9px] border-l-[15px] border-y-transparent border-l-[color:var(--color-video)]" />
        </button>
      </div>

      {/* thumbnails */}
      <div className="grid grid-cols-2 gap-3 md:h-full md:grid-rows-2 md:gap-4">
        {images.map((src, i) => {
          const on = i === active;
          return (
            <button
              key={`${src}-${i}`}
              type="button"
              aria-label="View image"
              onClick={() => setIdx(i)}
              className={`relative aspect-[238/300] overflow-hidden border bg-deep transition md:aspect-auto md:h-full ${
                on
                  ? "border-accent opacity-100"
                  : "border-transparent opacity-80 hover:opacity-100"
              }`}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="(max-width: 820px) 50vw, 20vw"
                className="object-cover"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
