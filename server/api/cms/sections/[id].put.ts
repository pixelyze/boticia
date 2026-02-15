/**
 * PUT /api/cms/sections/:id
 * Update a section
 */

import { updateSection, getSectionById } from "~/server/utils/cms";
import type { UpdateSectionInput } from "~/server/utils/cms-types";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      message: "Section ID is required",
    });
  }

  const body = await readBody<UpdateSectionInput>(event);

  try {
    const existing = await getSectionById(id);

    if (!existing) {
      throw createError({
        statusCode: 404,
        message: "Section not found",
      });
    }

    const section = await updateSection(id, body);

    if (!section) {
      throw createError({
        statusCode: 500,
        message: "Failed to update section",
      });
    }

    return {
      success: true,
      data: section,
    };
  } catch (err: any) {
    if (err.statusCode) {
      throw err;
    }

    console.error("Error updating section:", err);

    throw createError({
      statusCode: 500,
      message: "Failed to update section",
    });
  }
});
