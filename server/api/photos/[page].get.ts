/**
 * GET /api/photos/:page
 * Photos d'une page du site, rangées par zone (grille, visionneuse,
 * ouverture, chapitres)
 */

import {
  getPagePhotos,
  isPlacementPage,
} from "~/server/utils/photo-placements";

// PUBLIC: photos affichées sur les pages publiques du site
export default defineEventHandler(async (event) => {
  const page = getRouterParam(event, "page");

  if (!isPlacementPage(page)) {
    throw createError({ statusCode: 404, message: "Unknown page" });
  }

  try {
    return { success: true, data: await getPagePhotos(page) };
  } catch {
    throw createError({ statusCode: 500, message: "Failed to load photos" });
  }
});
