import type { Category } from "@/types/artwork";

/**
 * Category tabs (order + display labels). Edit labels/order here only —
 * never hard-code category strings inside components.
 * `key` must match the DB value (UPPERCASE); `label` is what the user sees.
 */
export const CATEGORY_TABS: { key: Category; label: string }[] = [
  { key: "SINGLE", label: "Single" },
  { key: "SQUAD", label: "Squad" },
  { key: "VEHICLE", label: "Vehicle" },
  { key: "DIORAMA", label: "Diorama" },
  { key: "BUSTS", label: "Busts" },
  { key: "SMALL SCALE", label: "Small Scale" },
];

/** Pseudo-category meaning "no filter". */
export const ALL_KEY = "ALL" as const;
export type TabKey = Category | typeof ALL_KEY;

/** Tabs including the leading "All" tab, used by the showcase + landing filters. */
export const TABS_WITH_ALL: { key: TabKey; label: string }[] = [
  { key: ALL_KEY, label: "All" },
  ...CATEGORY_TABS,
];

/** Categories shown in the header dropdown (links into /showcase). */
export const HEADER_CATEGORIES = CATEGORY_TABS;
