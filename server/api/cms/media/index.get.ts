/**
 * GET /api/cms/media
 * Get all media
 */

import { getMedia } from "~/server/utils/cms";

export default defineEventHandler(async (event) => {
  try {
    const media = await getMedia();

    return {
      success: true,
      data: media,
      count: media.length,
    };
  } catch (err) {
    console.error("Error getting media:", err);

    throw createError({
      statusCode: 500,
      message: "Failed to get media",
    });
  }
});
