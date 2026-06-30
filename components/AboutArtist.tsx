import Image from "next/image";

/**
 * About-the-artist block. Portrait is a brand image, not a DB record —
 * drop your file at /public/artist.jpg (or change the path below).
 */
export default function AboutArtist() {
  return (
    <section className="relative z-10 mx-auto max-w-[1432px] px-5 pb-32 pt-16 sm:px-12 lg:px-[92px]">
      <div className="flex flex-col items-center gap-7 md:flex-row md:gap-16">
        <div className="relative aspect-[313/516] w-full max-w-[360px] shrink-0 bg-deep md:w-[313px]">
          <Image
            src="/artist.jpg"
            alt="Kisa, miniature artist"
            fill
            sizes="360px"
            className="object-cover"
          />
        </div>

        <div className="max-w-[460px]">
          <h2 className="mb-4 font-display text-[clamp(40px,5vw,60px)] leading-none text-cream">
            Kisa. Miniature artist
          </h2>
          <p className="font-mono text-[clamp(15px,1.5vw,22px)] leading-relaxed text-cream">
            I take on custom projects and collaborations.
            <br />
            <br />
            From single pieces to full compositions. Everything is discussed
            upfront.
            <br />
            <br />
            No shortcuts. Just paint.
          </p>
        </div>
      </div>
    </section>
  );
}
