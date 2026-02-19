/**
 * POST /api/admin/homepage-inspirations/:id/gallery
 * Admin — Upload image to category gallery
 * Compresses and converts to WebP via Sharp
 */

import { requireAdmin } from "~/server/utils/serverAuth";
import {
  getCategoryById,
  createImage,
} from "~/server/utils/homepage-inspirations";
import { getSupabase } from "~/server/utils/supabase";
import { compressImage } from "~/server/utils/image-compress";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      message: "Category ID is required",
    });
  }

  try {
    const category = await getCategoryById(id);
    if (!category) {
      throw createError({
        statusCode: 404,
        message: "Category not found",
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

    // Compress and convert to WebP
    const compressed = await compressImage(
      Buffer.from(file.data),
      { maxWidth: 1920, quality: 80 }
    );

    const filename = `gallery/${category.slug}/${Date.now()}.${compressed.ext}`;

    const { error: uploadError } = await getSupabase()
      .storage.from("homepage-inspirations")
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
      .storage.from("homepage-inspirations")
      .getPublicUrl(filename);

    const image = await createImage({
      category_id: id,
      filename,
      original_filename: file.filename,
      mime_type: compressed.mimeType,
      file_size: compressed.data.length,
      storage_path: filename,
      public_url: publicUrl,
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
