import { requireAdmin } from "~/server/utils/serverAuth";
import { getSupabase } from "~/server/utils/supabase";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  const exceptionId = getRouterParam(event, "exceptionId");

  try {
    const { error } = await getSupabase()
      .from("availability_exceptions")
      .delete()
      .eq("id", exceptionId);

    if (error) {
      console.error("Error deleting exception:", error.message);
      throw createError({ statusCode: 500, message: error.message });
    }

    return { success: true };
  } catch (err: any) {
    if (err.statusCode) throw err;
    console.error("Error:", err);
    throw createError({ statusCode: 500, message: "Internal error" });
  }
});
