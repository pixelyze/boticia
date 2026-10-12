/**
 * DELETE /api/cms/logos/:path
 * Delete a logo from Supabase Storage
 */

import { getSupabase } from "~/server/utils/supabase";
import { serverSupabaseUser } from "#supabase/server";
import { getSitePhotoPaths } from "~/server/utils/site-photos";

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

  // Garde-fou : une photo utilisée sur le site ne se supprime pas d'ici.
  const sitePhotos = await getSitePhotoPaths();
  if (sitePhotos.has(path)) {
    throw createError({
      statusCode: 409,
      message: "Cette image est utilisée comme photo du site",
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
