import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";

/**
 * Themed 404 — shown by the App Router when a route or `notFound()` resolves
 * to nothing (e.g. an unknown /artwork/[id]).
 */
export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col bg-bg font-mono text-cream">
      <SiteHeader variant="inner" />

      <div className="mx-auto flex w-full max-w-[1432px] flex-1 flex-col items-start justify-center px-5 py-24 sm:px-12 lg:px-[92px]">
        <p className="m-0 font-mono text-base font-medium uppercase tracking-wide text-accent">
          404 — Not found
        </p>
        <h1 className="mb-6 mt-4 font-display text-[clamp(64px,11vw,160px)] leading-[0.85] text-cream">
          Nothing here
        </h1>
        <p className="m-0 mb-10 max-w-[460px] text-[clamp(15px,1.5vw,20px)] leading-relaxed text-cream">
          This piece isn&rsquo;t in the cabinet — it may have been sold, moved,
          or never existed.
        </p>
        <Link
          href="/showcase"
          className="inline-flex items-center justify-center border border-accent px-6 py-[11px] font-mono text-base font-medium text-accent transition hover:bg-accent hover:text-deep"
        >
          Back to all painted pieces
        </Link>
      </div>
    </main>
  );
}
