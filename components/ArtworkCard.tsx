import Link from "next/link";
import Image from "next/image";
import { StatusBadge } from "./StatusBadge";
import { collectImages } from "@/lib/images";
import type { ArtworkCardData } from "@/types/artwork";

/** Portrait gallery card → links to the product page. */
export function ArtworkCard({ art }: { art: ArtworkCardData }) {
  const images = collectImages(art.image_url, art.extra_images);
  const cover = images[0];
  const dotCount = Math.max(1, Math.min(images.length, 5));

  return (
    <Link
      href={`/artwork/${art.id}`}
      className="group relative block aspect-[298/400] overflow-hidden bg-deep outline-cream/10 transition hover:outline hover:outline-1"
    >
      {cover && (
        <Image
          src={cover}
          alt={art.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}

      {/* legibility gradient */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/85 to-transparent" />

      {/* extra_images indicator */}
      <div className="absolute bottom-[18px] left-4 flex gap-[5px]">
        {Array.from({ length: dotCount }).map((_, i) => (
          <span
            key={i}
            className={`h-[5px] w-[5px] rounded-full ${
              i === 0 ? "bg-accent" : "bg-cream/40"
            }`}
          />
        ))}
      </div>

      {/* status */}
      <div className="absolute bottom-4 right-3.5">
        <StatusBadge status={art.status} />
      </div>
    </Link>
  );
}
