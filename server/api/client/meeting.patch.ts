/**
 * PATCH /api/client/meeting
 * Client — Update meeting date/time
 */

import { requireClient } from "~/server/utils/serverAuth";
import { getSupabase } from "~/server/utils/supabase";

export default defineEventHandler(async (event) => {
  const { quoteRequest } = await requireClient(event);

  const body = await readBody(event);

  try {
    const { data, error } = await getSupabase()
      .from("quote_requests")
      .update({
        meeting_date: body.date,
        meeting_time: body.time,
      })
      .eq("id", quoteRequest.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating meeting:", error.message);
      throw createError({ statusCode: 500, message: error.message });
    }

    return { success: true, data };
  } catch (err: any) {
    if (err.statusCode) throw err;
    console.error("Error:", err);
    throw createError({ statusCode: 500, message: "Internal error" });
  }
});
