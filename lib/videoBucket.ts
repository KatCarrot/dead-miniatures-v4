/** Storage bucket for uploaded artwork videos (public read, restricted write). */
export const ARTWORK_VIDEO_BUCKET = "artwork-videos";

/**
 * Hard cap for artwork videos. Enforced in THREE places, defense-in-depth:
 *  1. client-side, before upload even starts (fast feedback)
 *  2. server-side, in /api/artworks/video-upload-url (never trusts the client)
 *  3. the Supabase Storage bucket's own `file_size_limit` (sql/video-migration.sql)
 *     — the one a modified/bypassed client genuinely cannot get around.
 */
export const MAX_VIDEO_BYTES = 50 * 1024 * 1024; // 50 MB

/** Only these two containers are accepted — matches the bucket's allowed_mime_types. */
export const ALLOWED_VIDEO_MIME_TYPES = ["video/mp4", "video/webm"] as const;
