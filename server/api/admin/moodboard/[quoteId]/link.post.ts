/**
 * POST /api/admin/moodboard/:quoteId/link
 * Admin — Add external link to moodboard
 */

import { requireAdmin } from "~/server/utils/serverAuth";
import { createMoodboardItem } from "~/server/utils/client-portal";

export default defineEventHandler(async (event) => {
  const user = await requireAdmin(event);
  const quoteId = getRouterParam(event, "quoteId");

  if (!quoteId) {
    throw createError({
      statusCode: 400,
      message: "Quote ID is required",
    });
  }

  const body = await readBody(event);
  const { url, title, description } = body as {
    url: string;
    title?: string;
    description?: string;
  };

  if (!url) {
    throw createError({
      statusCode: 400,
      message: "URL is required",
    });
  }

  try {
    const item = await createMoodboardItem({
      quote_id: quoteId,
      item_type: "link",
      external_url: url,
      title: title || undefined,
      description: description || undefined,
      uploaded_by: user.id,
    });

    if (!item) {
      throw createError({
        statusCode: 500,
        message: "Failed to save link",
      });
    }

    return {
      success: true,
      data: item,
    };
  } catch (err: any) {
    if (err.statusCode) throw err;
    console.error("Error adding moodboard link:", err);
    throw createError({
      statusCode: 500,
      message: "Failed to add link",
    });
  }
});
