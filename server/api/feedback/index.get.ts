/**
 * GET /api/feedback
 * Admin — List all feedback ordered by newest first
 */

import { requireAdmin } from "~/server/utils/serverAuth";
import { getSupabase } from "~/server/utils/supabase";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("feedback")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[FEEDBACK] Fetch error:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch feedback",
    });
  }

  return { success: true, data };
});
