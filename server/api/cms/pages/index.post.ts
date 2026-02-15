/**
 * POST /api/cms/pages
 * Create a new page
 */

import { createPage } from "~/server/utils/cms";
import type { CreatePageInput } from "~/server/utils/cms-types";

export default defineEventHandler(async (event) => {
  // TODO: Add authentication check
  // const user = await requireAuth(event);

  const body = await readBody<CreatePageInput>(event);

  // Validate required fields
  if (!body.slug || !body.title) {
    throw createError({
      statusCode: 400,
      message: "Slug and title are required",
    });
  }

  try {
    const page = await createPage(body);

    if (!page) {
      throw createError({
        statusCode: 500,
        message: "Failed to create page",
      });
    }

    return {
      success: true,
      data: page,
    };
  } catch (err) {
    console.error("Error creating page:", err);

    throw createError({
      statusCode: 500,
      message: "Failed to create page",
    });
  }
});
