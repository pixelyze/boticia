/**
 * DELETE /api/admin/photos/:id
 * Admin — Supprime une photo de la photothèque, de toutes les pages
 * (emplacements supprimés en cascade) et du stockage
 */

import { requireAdmin } from "~/server/utils/serverAuth";
import {
  getGalleryImageById,
  deleteGalleryImage,
} from "~/server/utils/galleries";
import { getSupabase } from "~/server/utils/supabase";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, message: "Photo ID is required" });
  }

  const image = await getGalleryImageById(id);
  if (!image) {
    throw createError({ statusCode: 404, message: "Photo not found" });
  }

  if (!(await deleteGalleryImage(id))) {
    throw createError({ statusCode: 500, message: "Failed to delete photo" });
  }

  if (image.storage_path) {
    await getSupabase().storage.from("galleries").remove([image.storage_path]);
  }

  return { success: true };
});
