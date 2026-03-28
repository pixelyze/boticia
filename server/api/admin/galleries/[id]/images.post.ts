/**
 * POST /api/admin/galleries/:id/images
 * Admin — Upload image to gallery
 * Compresses and converts to WebP via Sharp
 */

import { requireAdmin } from "~/server/utils/serverAuth";
import {
  getGalleryById,
  createGalleryImage,
} from "~/server/utils/galleries";
import { getSupabase } from "~/server/utils/supabase";
import { compressImage } from "~/server/utils/image-compress";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      message: "Gallery ID is required",
    });
  }

  try {
    const gallery = await getGalleryById(id);
    if (!gallery) {
      throw createError({
        statusCode: 404,
        message: "Gallery not found",
      });
    }

    const formData = await readMultipartFormData(event);
    if (!formData || formData.length === 0) {
      throw createError({
        statusCode: 400,
        message: "No file provided",
      });
    }

    const file = formData.find((f) => f.name === "file");
    const captionField = formData.find(
      (f) => f.name === "caption"
    );

    if (!file || !file.data || !file.filename) {
      throw createError({
        statusCode: 400,
        message: "Invalid file",
      });
    }

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type || "")) {
      throw createError({
        statusCode: 400,
        message: "File type not allowed",
      });
    }

    const compressed = await compressImage(
      Buffer.from(file.data),
      { maxWidth: 1920, quality: 80 }
    );

    const filename = `${gallery.slug}/${Date.now()}.${compressed.ext}`;

    const { error: uploadError } = await getSupabase()
      .storage.from("galleries")
      .upload(filename, compressed.data, {
        contentType: compressed.mimeType,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError.message);
      throw createError({
        statusCode: 500,
        message: "Failed to upload file",
      });
    }

    const {
      data: { publicUrl },
    } = getSupabase()
      .storage.from("galleries")
      .getPublicUrl(filename);

    const image = await createGalleryImage({
      gallery_id: id,
      filename,
      original_filename: file.filename,
      mime_type: compressed.mimeType,
      file_size: compressed.data.length,
      storage_path: filename,
      public_url: toProxyUrl(publicUrl),
      caption: captionField?.data?.toString() || undefined,
    });

    if (!image) {
      throw createError({
        statusCode: 500,
        message: "Failed to save image",
      });
    }

    return { success: true, data: image };
  } catch (err: any) {
    if (err.statusCode) throw err;
    console.error("Error uploading gallery image:", err);
    throw createError({
      statusCode: 500,
      message: "Failed to upload gallery image",
    });
  }
});
