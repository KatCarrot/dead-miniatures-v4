/**
 * Landing hero. The bleed image is a brand/studio shot, not a DB record —
 * drop your file at /public/hero.jpg (or change the path below).
 */
export default function Hero() {
  return (
    <section className="relative min-h-[560px]">
      {/* bleed image: faded backdrop on mobile, right-side bleed on desktop */}
      <div className="pointer-events-none absolute inset-0 bg-[url('/hero.jpg')] bg-cover bg-[center_top] opacity-20 md:inset-y-0 md:left-auto md:right-0 md:w-[52%] md:bg-[center_18%] md:opacity-100 md:[mask-image:linear-gradient(to_right,transparent,#000_38%)]" />

      <div className="relative z-[2] max-w-3xl px-5 py-12 sm:px-12 md:py-20 lg:px-[92px]">
        <h1 className="leading-[0.82] text-cream">
          <span className="block font-display2 text-[clamp(56px,11vw,160px)] font-extrabold tracking-tight">
            I PAINT
          </span>
          <span className="block font-display text-[clamp(56px,11vw,160px)]">
            MINIATURES
          </span>
        </h1>

        <div className="mt-9 font-body text-[clamp(16px,1.5vw,20px)] leading-relaxed text-cream">
          <p>
            You&rsquo;re in <strong className="font-semibold">Dead miniatures</strong> studio.
          </p>
          <p>Everything is painted by hand.</p>
          <p>Nothing here is mass-made.</p>
        </div>
      </div>
    </section>
  );
}
