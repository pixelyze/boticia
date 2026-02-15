/**
 * GET /api/cms/sections?pageId=xxx
 * Get sections by page ID
 */

import { getSectionsByPageId } from "~/server/utils/cms";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const pageId = query.pageId as string;

  if (!pageId) {
    throw createError({
      statusCode: 400,
      message: "pageId is required",
    });
  }

  try {
    const sections = await getSectionsByPageId(pageId);

    return {
      success: true,
      data: sections,
      count: sections.length,
    };
  } catch (err) {
    console.error("Error getting sections:", err);

    throw createError({
      statusCode: 500,
      message: "Failed to get sections",
    });
  }
});
