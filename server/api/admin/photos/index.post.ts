/**
 * POST /api/admin/photos
 * Admin — Dépose une photo dans la photothèque (compressée en WebP),
 * avec son type (mariage, entreprise ou atelier)
 */

import { requireAdmin } from "~/server/utils/serverAuth";
import { createGalleryImage } from "~/server/utils/galleries";
import { getSupabase, toProxyUrl } from "~/server/utils/supabase";
import { compressImage } from "~/server/utils/image-compress";
import { isPhotoType } from "~/server/utils/photo-placements";

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];

export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  const formData = await readMultipartFormData(event);
  const file = formData?.find((f) => f.name === "file");
  const typeField = formData?.find((f) => f.name === "photo_type");
  const photoType = typeField?.data?.toString() || null;

  if (!file || !file.data || !file.filename) {
    throw createError({ statusCode: 400, message: "Invalid file" });
  }
  if (!ALLOWED_TYPES.includes(file.type || "")) {
    throw createError({ statusCode: 400, message: "File type not allowed" });
  }
  if (photoType !== null && !isPhotoType(photoType)) {
    throw createError({ statusCode: 400, message: "Invalid photo type" });
  }

  try {
    const compressed = await compressImage(Buffer.from(file.data), {
      maxWidth: 1920,
      quality: 80,
    });
    const filename = `library/${Date.now()}-${Math.round(Math.random() * 1e6)}.${compressed.ext}`;

    const { error: uploadError } = await getSupabase()
      .storage.from("galleries")
      .upload(filename, compressed.data, { contentType: compressed.mimeType });
    if (uploadError) {
      console.error("Upload error:", uploadError.message);
      throw createError({ statusCode: 500, message: "Failed to upload file" });
    }

    const {
      data: { publicUrl },
    } = getSupabase().storage.from("galleries").getPublicUrl(filename);

    const image = await createGalleryImage({
      gallery_id: null,
      photo_type: photoType,
      filename,
      original_filename: file.filename,
      mime_type: compressed.mimeType,
      file_size: compressed.data.length,
      storage_path: filename,
      public_url: toProxyUrl(publicUrl),
    });
    if (!image) {
      throw createError({ statusCode: 500, message: "Failed to save image" });
    }

    return { success: true, data: image };
  } catch (err: any) {
    if (err.statusCode) throw err;
    console.error("Error uploading photo:", err);
    throw createError({ statusCode: 500, message: "Failed to upload photo" });
  }
});
