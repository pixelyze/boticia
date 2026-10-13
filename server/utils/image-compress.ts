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
 * Turn a logo (PNG, JPG, WebP or SVG) into a transparent PNG.
 *
 * PNG rather than WebP : the logo also goes into emails, and Outlook
 * desktop shows no WebP. An SVG is rasterized : the stored file is a plain
 * image, so no script embedded in the SVG can ever run on the site.
 */
export async function rasterizeLogo(
  input: Buffer,
  isSvg: boolean,
  maxWidth = 512
): Promise<CompressResult> {
  let density: number | undefined;
  if (isSvg) {
    // Render the vector at the target width instead of upscaling pixels.
    const { width } = await sharp(input).metadata();
    density = Math.min(2400, Math.max(72, (72 * maxWidth) / (width || 72)));
  }

  const data = await sharp(input, density ? { density } : undefined)
    .rotate()
    .resize({ width: maxWidth, withoutEnlargement: true })
    .png({ compressionLevel: 9 })
    .toBuffer();

  return { data, mimeType: "image/png", ext: "png" };
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
