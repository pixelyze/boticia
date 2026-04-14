/**
 * PATCH /api/admin/galleries/:id/images/:imageId
 * Admin — Update image (bento_slot, caption)
 */

import { requireAdmin } from "~/server/utils/serverAuth";
import { updateGalleryImage } from "~/server/utils/galleries";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  const imageId = getRouterParam(event, "imageId");
  if (!imageId) {
    throw createError({
      statusCode: 400,
      message: "Image ID is required",
    });
  }

  const body = await readBody(event);

  const update: Record<string, any> = {};

  if ("bento_slot" in body) {
    const slot = body.bento_slot;
    if (slot !== null && (slot < 1 || slot > 6)) {
      throw createError({
        statusCode: 400,
        message: "bento_slot must be 1-6 or null",
      });
    }
    update.bento_slot = slot;
  }

  if ("caption" in body) {
    update.caption = body.caption;
  }

  const image = await updateGalleryImage(imageId, update);

  if (!image) {
    throw createError({
      statusCode: 500,
      message: "Failed to update image",
    });
  }

  return { success: true, data: image };
});
