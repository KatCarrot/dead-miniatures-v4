/**
 * Normalises a stored artwork image path to a public URL.
 * DB may hold the old DC-relative path ("public/x") — rewrite to "/x".
 * Falls back to a sample placeholder when no image is set.
 */
export function imgSrc(url: string | null | undefined): string {
  if (!url) return "/samples/mini-1.webp";
  return url.replace(/^public\//, "/");
}
