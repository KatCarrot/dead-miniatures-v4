/**
 * Build the ordered, de-duplicated list of images for a piece.
 * Logic per spec: [image_url, ...extra_images] -> drop empties -> drop duplicates.
 */
export function collectImages(
  imageUrl: string | null,
  extraImages: string[] | null
): string[] {
  const all = [imageUrl, ...(extraImages ?? [])].filter(
    (v): v is string => Boolean(v)
  );
  return all.filter((v, i) => all.indexOf(v) === i);
}
