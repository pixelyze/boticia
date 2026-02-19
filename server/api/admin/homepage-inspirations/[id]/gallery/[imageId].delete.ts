/**
 * DELETE /api/admin/homepage-inspirations/:id/gallery/:imageId
 * Admin — Delete a gallery image
 */

import { requireAdmin } from "~/server/utils/serverAuth";
import {
  getImageById,
  deleteImage,
} from "~/server/utils/homepage-inspirations";
import { getSupabase } from "~/server/utils/supabase";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);
  const imageId = getRouterParam(event, "imageId");

  if (!imageId) {
    throw createError({
      statusCode: 400,
      message: "Image ID is required",
    });
  }

  try {
    const image = await getImageById(imageId);

    if (!image) {
      throw createError({
        statusCode: 404,
        message: "Image not found",
      });
    }

    if (image.storage_path) {
      await getSupabase()
        .storage.from("homepage-inspirations")
        .remove([image.storage_path]);
    }

    const deleted = await deleteImage(imageId);

    if (!deleted) {
      throw createError({
        statusCode: 500,
        message: "Failed to delete image",
      });
    }

    return { success: true };
  } catch (err: any) {
    if (err.statusCode) throw err;
    console.error("Error deleting gallery image:", err);
    throw createError({
      statusCode: 500,
      message: "Failed to delete gallery image",
    });
  }
});
