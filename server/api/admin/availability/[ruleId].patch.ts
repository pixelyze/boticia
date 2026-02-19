import { requireAdmin } from "~/server/utils/serverAuth";
import { getSupabase } from "~/server/utils/supabase";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  const ruleId = getRouterParam(event, "ruleId");
  const body = await readBody(event);

  try {
    const updates: Record<string, unknown> = {};
    if (body.day_of_week !== undefined) updates.day_of_week = body.day_of_week;
    if (body.start_time !== undefined) updates.start_time = body.start_time;
    if (body.end_time !== undefined) updates.end_time = body.end_time;
    if (body.slot_duration !== undefined) updates.slot_duration = body.slot_duration;
    if (body.is_active !== undefined) updates.is_active = body.is_active;

    const { data, error } = await getSupabase()
      .from("availability_rules")
      .update(updates)
      .eq("id", ruleId)
      .select()
      .single();

    if (error) {
      console.error("Error updating rule:", error.message);
      throw createError({ statusCode: 500, message: error.message });
    }

    return { success: true, data };
  } catch (err: any) {
    if (err.statusCode) throw err;
    console.error("Error:", err);
    throw createError({ statusCode: 500, message: "Internal error" });
  }
});
