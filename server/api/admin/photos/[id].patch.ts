/**
 * PATCH /api/admin/photos/:id
 * Admin — Modifie la légende ou le type d'une photo
 */

import { requireAdmin } from "~/server/utils/serverAuth";
import { updateGalleryImage } from "~/server/utils/galleries";
import { isPhotoType } from "~/server/utils/photo-placements";

const CAPTION_MAX = 200;

export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, message: "Photo ID is required" });
  }

  const body = await readBody(event);
  const update: Record<string, any> = {};

  if ("caption" in body) {
    const caption = typeof body.caption === "string" ? body.caption.trim() : "";
    if (caption.length > CAPTION_MAX) {
      throw createError({ statusCode: 400, message: "Caption too long" });
    }
    update.caption = caption || null;
  }

  if ("photo_type" in body) {
    if (body.photo_type !== null && !isPhotoType(body.photo_type)) {
      throw createError({ statusCode: 400, message: "Invalid photo type" });
    }
    update.photo_type = body.photo_type;
  }

  const image = await updateGalleryImage(id, update);
  if (!image) {
    throw createError({ statusCode: 500, message: "Failed to update photo" });
  }

  return { success: true, data: image };
});
