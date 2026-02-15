/**
 * GET /api/cms/logos
 * List all logos in storage
 */

import { getSupabase } from "~/server/utils/supabase";

export default defineEventHandler(async () => {
  const supabase = getSupabase();

  const { data, error } = await supabase.storage
    .from("logos")
    .list("", { sortBy: { column: "created_at", order: "asc" } });

  if (error) {
    console.error("Error listing logos:", error.message);
    throw createError({
      statusCode: 500,
      message: "Failed to list logos",
    });
  }

  const logos = (data || [])
    .filter((f) => !f.name.startsWith("."))
    .map((f) => {
      const { data: urlData } = supabase.storage
        .from("logos")
        .getPublicUrl(f.name);

      return {
        path: f.name,
        url: urlData.publicUrl,
        created_at: f.created_at,
      };
    });

  return {
    success: true,
    data: logos,
  };
});
