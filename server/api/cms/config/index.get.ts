/**
 * GET /api/cms/config
 * Get all config entries or by key
 */

import { getConfigs, getConfigByKey } from "~/server/utils/cms";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  // If key is provided, get specific config
  if (query.key) {
    try {
      const config = await getConfigByKey(
        query.key as string,
        query.locale as string | undefined
      );

      if (!config) {
        throw createError({
          statusCode: 404,
          message: "Config not found",
        });
      }

      return {
        success: true,
        data: config,
      };
    } catch (err: any) {
      if (err.statusCode) {
        throw err;
      }

      console.error("Error getting config:", err);

      throw createError({
        statusCode: 500,
        message: "Failed to get config",
      });
    }
  }

  // Otherwise get all configs with filters
  const filters = {
    category: query.category as string | undefined,
    locale: query.locale as string | undefined,
  };

  try {
    const configs = await getConfigs(filters);

    return {
      success: true,
      data: configs,
      count: configs.length,
    };
  } catch (err) {
    console.error("Error getting configs:", err);

    throw createError({
      statusCode: 500,
      message: "Failed to get configs",
    });
  }
});
