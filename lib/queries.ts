import { supabase } from "./supabaseClient";
import type { Artwork, ArtworkCardData, Category } from "@/types/artwork";
import { ALL_KEY, type TabKey } from "@/config/categories";

/** Columns needed for cards/grids only (keeps payloads small). */
const CARD_COLUMNS = "id,name,category,status,image_url,extra_images";

/**
 * Log a Supabase/PostgREST error with an actionable hint instead of letting the
 * raw `{message, details, hint, code}` object crash the whole page.
 * The most common cause in a fresh setup is "table not created yet".
 */
function reportDbError(where: string, error: unknown): void {
  const e = error as { message?: string; code?: string } | null;
  console.error(
    `[artworks] Supabase query failed in ${where}:`,
    e?.message ?? error
  );
  // 42P01 = undefined_table, PGRST205 = table not found in schema cache
  if (e?.code === "42P01" || e?.code === "PGRST205") {
    console.error(
      "[artworks] The `artworks` table was not found. Run sql/setup.sql in the " +
        "Supabase SQL editor to create + seed the tables and enable read access."
    );
  }
}

/**
 * Latest pieces for the landing "Painted Pieces" preview.
 * Newest first; small limit. Tab filtering happens client-side over this set.
 * On any DB error, returns [] so the page renders its empty state (never crashes).
 */
export async function getLatestArtworks(limit = 6): Promise<ArtworkCardData[]> {
  const { data, error } = await supabase
    .from("artworks")
    .select(CARD_COLUMNS)
    .order("id", { ascending: false })
    .limit(limit);

  if (error) {
    reportDbError("getLatestArtworks", error);
    return [];
  }
  return (data ?? []) as ArtworkCardData[];
}

/**
 * Full showcase grid, optionally filtered by category.
 * `ALL` (or undefined) returns everything; otherwise exact-match on the
 * UPPERCASE category value.
 */
export async function getArtworks(
  category?: TabKey
): Promise<ArtworkCardData[]> {
  let query = supabase
    .from("artworks")
    .select(CARD_COLUMNS)
    .order("id", { ascending: false });

  // DB stores categories strictly UPPERCASE — normalize before matching.
  const normalized = category?.toUpperCase();
  if (normalized && normalized !== ALL_KEY) {
    query = query.eq("category", normalized as Category);
  }

  const { data, error } = await query;
  if (error) {
    reportDbError("getArtworks", error);
    return [];
  }
  return (data ?? []) as ArtworkCardData[];
}

/** Single piece for the product page. Returns null when not found. */
export async function getArtwork(id: number): Promise<Artwork | null> {
  if (!Number.isFinite(id)) return null;

  const { data, error } = await supabase
    .from("artworks")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    reportDbError("getArtwork", error);
    return null;
  }
  return data as Artwork;
}
