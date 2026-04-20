/**
 * GET /api/cron/keep-alive
 * Ping Supabase to prevent free-tier project pausing.
 * Called every hour by Vercel Cron.
 */

import { getSupabase } from "~/server/utils/supabase";

export default defineEventHandler(async (event) => {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = getRequestHeader(event, "authorization");

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  try {
    const { count, error } = await getSupabase()
      .from("galleries")
      .select("id", { count: "exact", head: true });

    if (error) {
      console.error("Keep-alive ping failed:", error.message);
      return { success: false, error: error.message };
    }

    return {
      success: true,
      message: "Supabase is alive",
      galleries: count,
      timestamp: new Date().toISOString(),
    };
  } catch (err: any) {
    console.error("Keep-alive error:", err);
    return { success: false, error: err.message };
  }
});
