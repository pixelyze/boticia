/**
 * useImageCompression
 *
 * Compresses images client-side before upload to stay under Vercel's 4.5 MB
 * serverless function body limit. Passes through non-image files unchanged.
 *
 * Uses browser-image-compression (WebWorker, handles EXIF orientation).
 */
import imageCompression from "browser-image-compression";

interface CompressOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
}

const DEFAULTS: Required<CompressOptions> = {
  maxSizeMB: 3, // Safe margin under Vercel's 4.5 MB body limit
  maxWidthOrHeight: 2560, // Retina-friendly, server will still resize to 1920
};

export function useImageCompression() {
  const compress = async (
    file: File,
    options: CompressOptions = {}
  ): Promise<File> => {
    if (!file.type.startsWith("image/")) {
      return file;
    }

    // Skip if already small enough
    const maxSizeMB = options.maxSizeMB ?? DEFAULTS.maxSizeMB;
    if (file.size <= maxSizeMB * 1024 * 1024) {
      return file;
    }

    try {
      const compressed = await imageCompression(file, {
        maxSizeMB,
        maxWidthOrHeight:
          options.maxWidthOrHeight ?? DEFAULTS.maxWidthOrHeight,
        useWebWorker: true,
        initialQuality: 0.85,
      });

      // browser-image-compression returns a Blob on some paths;
      // wrap it as a File to preserve filename/type for FormData.
      return new File([compressed], file.name, {
        type: compressed.type || file.type,
        lastModified: Date.now(),
      });
    } catch (err) {
      console.error("Image compression failed:", err);
      return file;
    }
  };

  return { compress };
}
