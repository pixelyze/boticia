/**
 * DELETE /api/cms/logos/:path
 * Delete a logo from Supabase Storage
 */

import { getSupabase } from "~/server/utils/supabase";
import { serverSupabaseUser } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  if (!user) {
    throw createError({
      statusCode: 401,
      message: "Authentication required",
    });
  }

  const path = getRouterParam(event, "path");
  if (!path) {
    throw createError({
      statusCode: 400,
      message: "Logo path is required",
    });
  }

  const supabase = getSupabase();

  const { error } = await supabase.storage
    .from("logos")
    .remove([path]);

  if (error) {
    console.error("Error deleting logo:", error.message);
    throw createError({
      statusCode: 500,
      message: "Failed to delete logo",
    });
  }

  return {
    success: true,
  };
});
