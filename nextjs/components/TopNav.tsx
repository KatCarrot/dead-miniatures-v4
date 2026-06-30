"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { HEADER_CATEGORIES } from "@/config/categories";

const NAV_LINKS = [
  { label: "ABOUT STUDIO", href: "#" },
  { label: "HOW TO ORDER", href: "#" },
  { label: "CONTACTS", href: "#" },
];

/**
 * Top navigation.
 * Logo -> "/" (landing). MINIATURES -> "/showcase" (gallery).
 * Responsive: inline links on desktop (md+), burger panel on mobile.
 */
export default function TopNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  return (
    <>
      <nav className="relative z-50 flex h-[74px] items-center justify-between px-5 py-3.5 sm:px-12 lg:px-[92px]">
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src="/logo.png"
            alt="Dead miniatures"
            width={120}
            height={50}
            priority
            className="h-[50px] w-auto"
          />
        </Link>

        {/* desktop */}
        <div className="hidden items-center gap-10 md:flex">
          <div
            className="relative"
            onMouseEnter={() => setNavOpen(true)}
            onMouseLeave={() => setNavOpen(false)}
          >
            <Link
              href="/showcase"
              className="flex items-center gap-1.5 text-base text-accent"
            >
              MINIATURES
              <span className="inline-block h-2 w-2 -translate-y-0.5 rotate-45 border-b-[1.5px] border-r-[1.5px] border-accent" />
            </Link>

            {navOpen && (
              <div className="absolute left-[-20px] top-[38px] flex min-w-[200px] flex-col gap-3.5 bg-menu p-5">
                {HEADER_CATEGORIES.map((c) => (
                  <Link
                    key={c.key}
                    href={`/showcase?category=${encodeURIComponent(c.key)}`}
                    className="text-base text-white transition hover:text-accent"
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {NAV_LINKS.map((n) => (
            <Link
              key={n.label}
              href={n.href}
              className="text-base text-cream transition hover:text-accent"
            >
              {n.label}
            </Link>
          ))}
        </div>

        {/* burger */}
        <button
          type="button"
          aria-label="Menu"
          onClick={() => setMenuOpen((o) => !o)}
          className="flex h-11 w-11 flex-col justify-center gap-[5px] p-2.5 md:hidden"
        >
          {!menuOpen ? (
            <>
              <i className="block h-0.5 w-full bg-cream" />
              <i className="block h-0.5 w-full bg-cream" />
              <i className="block h-0.5 w-full bg-cream" />
            </>
          ) : (
            <>
              <i className="block h-0.5 w-full translate-y-[5px] rotate-45 bg-accent" />
              <i className="block h-0.5 w-full bg-accent opacity-0" />
              <i className="block h-0.5 w-full -translate-y-[5px] -rotate-45 bg-accent" />
            </>
          )}
        </button>
      </nav>

      {/* mobile dropdown */}
      {menuOpen && (
        <div className="relative z-50 flex flex-col border-y border-cream/10 bg-deep px-5 sm:px-12 md:hidden">
          <Link
            href="/showcase"
            className="border-b border-cream/10 py-3.5 text-base text-accent"
          >
            MINIATURES
          </Link>
          {NAV_LINKS.map((n) => (
            <Link
              key={n.label}
              href={n.href}
              className="border-b border-cream/10 py-3.5 text-base text-cream last:border-b-0"
            >
              {n.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
