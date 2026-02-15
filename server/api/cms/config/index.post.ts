/**
 * POST /api/cms/config
 * Create or update config (upsert)
 */

import { upsertConfig } from "~/server/utils/cms";
import type { CreateConfigInput } from "~/server/utils/cms-types";

export default defineEventHandler(async (event) => {
  const body = await readBody<CreateConfigInput>(event);

  // Validate required fields
  if (!body.key || !body.category || !body.value) {
    throw createError({
      statusCode: 400,
      message: "key, category, and value are required",
    });
  }

  try {
    const config = await upsertConfig(body);

    if (!config) {
      throw createError({
        statusCode: 500,
        message: "Failed to save config",
      });
    }

    return {
      success: true,
      data: config,
    };
  } catch (err) {
    console.error("Error saving config:", err);

    throw createError({
      statusCode: 500,
      message: "Failed to save config",
    });
  }
});
