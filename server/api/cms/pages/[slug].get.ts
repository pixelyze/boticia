/**
 * GET /api/cms/pages/:slug
 * Get page by slug
 */

import { getPageBySlug } from "~/server/utils/cms";

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");

  if (!slug) {
    throw createError({
      statusCode: 400,
      message: "Slug is required",
    });
  }

  const query = getQuery(event);
  const includeSections = query.includeSections !== "false";

  try {
    const page = await getPageBySlug(slug, includeSections);

    if (!page) {
      throw createError({
        statusCode: 404,
        message: "Page not found",
      });
    }

    return {
      success: true,
      data: page,
    };
  } catch (err: any) {
    if (err.statusCode) {
      throw err;
    }

    console.error("Error getting page:", err);

    throw createError({
      statusCode: 500,
      message: "Failed to get page",
    });
  }
});
