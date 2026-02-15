/**
 * GET /api/cms/components
 * Get all components
 */

import { getComponents } from "~/server/utils/cms";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const filters = {
    category: query.category as string | undefined,
    is_active: query.is_active === "true" ? true : query.is_active === "false" ? false : undefined,
  };

  try {
    const components = await getComponents(filters);

    return {
      success: true,
      data: components,
      count: components.length,
    };
  } catch (err) {
    console.error("Error getting components:", err);

    throw createError({
      statusCode: 500,
      message: "Failed to get components",
    });
  }
});
