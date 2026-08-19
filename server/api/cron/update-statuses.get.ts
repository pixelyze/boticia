/**
 * GET /api/cron/update-statuses
 * Fait avancer les statuts qui peuvent l'être sans intervention.
 * Appelé chaque jour à 6h par Vercel Cron (voir vercel.json).
 *
 * Règle actuelle : une demande encore "new" dont le rendez-vous souhaité
 * est passé devient "contacted" — le rendez-vous a eu lieu, seul le suivi
 * n'avait pas été mis à jour.
 */

import { getSupabase } from "~/server/utils/supabase";

export default defineEventHandler(async (event) => {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = getRequestHeader(event, "authorization");

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  // Date du jour au format ISO, comme meeting_date en base.
  const today = new Date().toISOString().slice(0, 10);

  try {
    const { data, error } = await getSupabase()
      .from("quote_requests")
      .update({ status: "contacted" })
      .eq("status", "new")
      .not("meeting_date", "is", null)
      .lt("meeting_date", today)
      .select("id");

    if (error) {
      console.error("Status update failed:", error.message);
      return { success: false, error: error.message };
    }

    const updated = data?.length ?? 0;
    if (updated > 0) {
      console.log(`Statuts avancés vers "contacted" : ${updated}`);
    }

    return {
      success: true,
      updated,
      timestamp: new Date().toISOString(),
    };
  } catch (err: any) {
    console.error("Status update error:", err);
    return { success: false, error: err.message };
  }
});
