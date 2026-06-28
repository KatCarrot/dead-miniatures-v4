import { supabase } from "./supabaseClient";
import type { Artwork, ArtworkCardData, Category } from "@/types/artwork";
import { ALL_KEY, type TabKey } from "@/config/categories";

/** Columns needed for cards/grids only (keeps payloads small). */
const CARD_COLUMNS = "id,name,category,status,image_url,extra_images";

/**
 * Latest pieces for the landing "Painted Pieces" preview.
 * Newest first; small limit. Tab filtering happens client-side over this set.
 */
export async function getLatestArtworks(limit = 6): Promise<ArtworkCardData[]> {
  const { data, error } = await supabase
    .from("artworks")
    .select(CARD_COLUMNS)
    .order("id", { ascending: false })
    .limit(limit);

  if (error) throw error;
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
  if (error) throw error;
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

  if (error) return null;
  return data as Artwork;
}
