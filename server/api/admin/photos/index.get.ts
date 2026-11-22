/**
 * GET /api/admin/photos
 * Admin — Photothèque complète et tous les emplacements
 */

import { requireAdmin } from "~/server/utils/serverAuth";
import { getLibrary } from "~/server/utils/photo-placements";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  try {
    return { success: true, data: await getLibrary() };
  } catch (err) {
    console.error("Error getting photo library:", err);
    throw createError({ statusCode: 500, message: "Failed to load photos" });
  }
});
