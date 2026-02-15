/**
 * POST /api/cms/sections
 * Create a new section
 */

import { createSection } from "~/server/utils/cms";
import type { CreateSectionInput } from "~/server/utils/cms-types";

export default defineEventHandler(async (event) => {
  const body = await readBody<CreateSectionInput>(event);

  // Validate required fields
  if (!body.page_id || !body.name || !body.component_type) {
    throw createError({
      statusCode: 400,
      message: "page_id, name, and component_type are required",
    });
  }

  try {
    const section = await createSection(body);

    if (!section) {
      throw createError({
        statusCode: 500,
        message: "Failed to create section",
      });
    }

    return {
      success: true,
      data: section,
    };
  } catch (err) {
    console.error("Error creating section:", err);

    throw createError({
      statusCode: 500,
      message: "Failed to create section",
    });
  }
});
