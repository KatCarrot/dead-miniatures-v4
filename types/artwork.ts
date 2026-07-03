// Single source of truth for the `artworks` table shape.

/** Allowed categories — must match the CHECK constraint in Supabase exactly (UPPERCASE). */
export const CATEGORIES = [
  "BUSTS",
  "SINGLE",
  "SQUAD",
  "DIORAMA",
  "VEHICLE",
  "SMALL SCALE",
] as const;

export type Category = (typeof CATEGORIES)[number];

export type Status = "available" | "sold";

/** Full row from `public.artworks`. */
export interface Artwork {
  id: number;
  name: string;
  category: Category;
  status: Status;
  sculptor: string | null;
  scale: string | null;
  game_system: string | null;
  time_hours: number | null;
  description: string | null;
  image_url: string | null;
  extra_images: string[] | null;
  /** Optional artwork video — all three are set together, or all null. */
  video_url: string | null;
  video_path: string | null;
  video_mime_type: string | null;
}

/** Trimmed shape used for cards/grids (no heavy columns). */
export type ArtworkCardData = Pick<
  Artwork,
  "id" | "name" | "category" | "status" | "image_url" | "extra_images"
>;
