import { requireAdmin } from "~/server/utils/serverAuth";
import { getSupabase } from "~/server/utils/supabase";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  try {
    const { data, error } = await getSupabase()
      .from("availability_exceptions")
      .select("*")
      .order("exception_date", { ascending: true });

    if (error) {
      console.error("Error getting exceptions:", error.message);
      return { success: false, data: [] };
    }

    return { success: true, data: data || [] };
  } catch (err) {
    console.error("Error:", err);
    return { success: false, data: [] };
  }
});
