import { requireAdmin } from "~/server/utils/serverAuth";
import { getSupabase } from "~/server/utils/supabase";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  const body = await readBody(event);

  try {
    const { data, error } = await getSupabase()
      .from("availability_exceptions")
      .insert({
        exception_date: body.exception_date,
        exception_type: body.exception_type,
        start_time: body.start_time || null,
        end_time: body.end_time || null,
        reason: body.reason || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating exception:", error.message);
      throw createError({ statusCode: 500, message: error.message });
    }

    return { success: true, data };
  } catch (err: any) {
    if (err.statusCode) throw err;
    console.error("Error:", err);
    throw createError({ statusCode: 500, message: "Internal error" });
  }
});
