/**
 * PATCH /api/admin/galleries/:id
 * Admin — Update gallery (title, description, is_published)
 */

import { requireAdmin } from "~/server/utils/serverAuth";
import { updateGallery } from "~/server/utils/galleries";

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
    const body = await readBody(event);
    const gallery = await updateGallery(id, body);

    if (!gallery) {
      throw createError({
        statusCode: 404,
        message: "Gallery not found",
      });
    }

    return { success: true, data: gallery };
  } catch (err: any) {
    if (err.statusCode) throw err;
    console.error("Error updating gallery:", err);
    throw createError({
      statusCode: 500,
      message: "Failed to update gallery",
    });
  }
});
