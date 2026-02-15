/**
 * POST /api/cms/components
 * Create a component
 */

import { createComponent } from "~/server/utils/cms";
import type { CreateComponentInput } from "~/server/utils/cms-types";

export default defineEventHandler(async (event) => {
  const body = await readBody<CreateComponentInput>(event);

  // Validate required fields
  if (!body.name || !body.component_type || !body.category) {
    throw createError({
      statusCode: 400,
      message: "name, component_type, and category are required",
    });
  }

  try {
    const component = await createComponent(body);

    if (!component) {
      throw createError({
        statusCode: 500,
        message: "Failed to create component",
      });
    }

    return {
      success: true,
      data: component,
    };
  } catch (err) {
    console.error("Error creating component:", err);

    throw createError({
      statusCode: 500,
      message: "Failed to create component",
    });
  }
});
