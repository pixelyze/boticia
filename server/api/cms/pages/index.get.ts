/**
 * GET /api/cms/pages
 * Get all pages with optional filters
 */

import { getPages } from "~/server/utils/cms";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const filters = {
    status: query.status as string | undefined,
    locale: query.locale as string | undefined,
    includeSections: query.includeSections === "true",
  };

  try {
    const pages = await getPages(filters);

    return {
      success: true,
      data: pages,
      count: pages.length,
    };
  } catch (err) {
    console.error("Error getting pages:", err);

    throw createError({
      statusCode: 500,
      message: "Failed to get pages",
    });
  }
});
