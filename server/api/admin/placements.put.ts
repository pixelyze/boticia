/**
 * PUT /api/admin/placements
 * Admin — Remplace le contenu d'une zone d'une page
 * Body : { page, zone, image_ids: (string | null)[] }
 */

import { requireAdmin } from "~/server/utils/serverAuth";
import {
  isPlacementPage,
  setZone,
  zoneSize,
} from "~/server/utils/photo-placements";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  const { page, zone, image_ids: imageIds } = await readBody(event);

  if (!isPlacementPage(page)) {
    throw createError({ statusCode: 400, message: "Unknown page" });
  }
  const size = zoneSize(page, zone);
  if (size === undefined) {
    throw createError({ statusCode: 400, message: "Unknown zone" });
  }
  if (
    !Array.isArray(imageIds) ||
    imageIds.some((id) => id !== null && typeof id !== "string") ||
    (size !== null && imageIds.length > size)
  ) {
    throw createError({ statusCode: 400, message: "Invalid image list" });
  }
  // Une photo n'apparaît qu'une fois dans une zone
  const filled = imageIds.filter(Boolean);
  if (new Set(filled).size !== filled.length) {
    throw createError({ statusCode: 400, message: "Duplicate photo in zone" });
  }

  try {
    await setZone(page, zone, imageIds);
    return { success: true };
  } catch (err) {
    console.error("Error saving placements:", err);
    throw createError({ statusCode: 500, message: "Failed to save" });
  }
});
