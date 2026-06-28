import Link from "next/link";
import { TABS_WITH_ALL, ALL_KEY, type TabKey } from "@/config/categories";

/**
 * Showcase category filter.
 * URL-driven (server-rendered): each tab is a <Link> to /showcase?category=KEY.
 * The active tab is passed in from the page (read from searchParams).
 */
export function CategoryFilter({ active }: { active: TabKey }) {
  return (
    <div className="flex flex-wrap gap-1">
      {TABS_WITH_ALL.map((tab) => {
        const on = tab.key === active;
        const href =
          tab.key === ALL_KEY
            ? "/showcase"
            : `/showcase?category=${encodeURIComponent(tab.key)}`;

        return (
          <Link
            key={tab.key}
            href={href}
            className={`rounded-lg border px-3 py-[11px] font-mono text-base font-medium transition ${
              on
                ? "border-accent text-accent"
                : "border-transparent text-cream hover:text-accent"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
