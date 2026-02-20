/**
 * POST /api/admin/homepage-inspirations/:id/cover
 * Admin — Upload cover image for a category
 * Compresses and converts to WebP via Sharp
 */

import { requireAdmin } from "~/server/utils/serverAuth";
import {
  getCategoryById,
  updateCategory,
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

    // Delete old cover if exists
    if (category.cover_storage_path) {
      await getSupabase()
        .storage.from("homepage-inspirations")
        .remove([category.cover_storage_path]);
    }

    // Compress and convert to WebP
    const compressed = await compressImage(
      Buffer.from(file.data),
      { maxWidth: 1200, quality: 80 }
    );

    const filename = `covers/${category.slug}_${Date.now()}.${compressed.ext}`;

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

    const updated = await updateCategory(id, {
      cover_filename: filename,
      cover_original_filename: file.filename,
      cover_mime_type: compressed.mimeType,
      cover_file_size: compressed.data.length,
      cover_storage_path: filename,
      cover_public_url: toProxyUrl(publicUrl),
    });

    if (!updated) {
      throw createError({
        statusCode: 500,
        message: "Failed to save cover",
      });
    }

    return { success: true, data: updated };
  } catch (err: any) {
    if (err.statusCode) throw err;
    console.error("Error uploading cover:", err);
    throw createError({
      statusCode: 500,
      message: "Failed to upload cover",
    });
  }
});
