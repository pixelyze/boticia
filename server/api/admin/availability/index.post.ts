import { requireAdmin } from "~/server/utils/serverAuth";
import { getSupabase } from "~/server/utils/supabase";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  const body = await readBody(event);

  try {
    const { data, error } = await getSupabase()
      .from("availability_rules")
      .insert({
        day_of_week: body.day_of_week,
        start_time: body.start_time,
        end_time: body.end_time,
        slot_duration: body.slot_duration || 120,
        is_active: body.is_active ?? true,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating rule:", error.message);
      throw createError({ statusCode: 500, message: error.message });
    }

    return { success: true, data };
  } catch (err: any) {
    if (err.statusCode) throw err;
    console.error("Error:", err);
    throw createError({ statusCode: 500, message: "Internal error" });
  }
});
