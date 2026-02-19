/**
 * Image compression utility using Sharp
 * Converts to WebP and resizes for optimal web delivery
 */

import sharp from "sharp";

interface CompressResult {
  data: Buffer;
  mimeType: string;
  ext: string;
}

/**
 * Compress and convert an image to WebP
 * - Gallery images: max 1920px wide
 * - Cover images: max 1200px wide
 */
export async function compressImage(
  input: Buffer,
  options?: { maxWidth?: number; quality?: number }
): Promise<CompressResult> {
  const maxWidth = options?.maxWidth ?? 1920;
  const quality = options?.quality ?? 80;

  const data = await sharp(input)
    .rotate() // auto-rotate based on EXIF
    .resize({
      width: maxWidth,
      withoutEnlargement: true,
    })
    .webp({ quality })
    .toBuffer();

  return {
    data,
    mimeType: "image/webp",
    ext: "webp",
  };
}
