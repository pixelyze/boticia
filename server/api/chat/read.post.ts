/**
 * POST /api/chat/read
 * Mark messages as read
 */
import { getAuthenticatedUser } from "~/server/utils/serverAuth";
import { getSupabase } from "~/server/utils/supabase";

export default defineEventHandler(async (event) => {
  const body = await readBody<{ sender_type: string; token?: string }>(event);
  const config = useRuntimeConfig();
  const isDevAccess = body.token && body.token === config.cronSecret;

  if (!isDevAccess) {
    const user = await getAuthenticatedUser(event);
    if (!user) {
      throw createError({ statusCode: 401, message: "Authentication required" });
    }
  }

  // Mark messages from the OTHER sender as read
  const markType = isDevAccess ? "admin" : "dev";

  try {
    await getSupabase()
      .from("chat_messages")
      .update({ is_read: true })
      .eq("sender_type", markType)
      .eq("is_read", false);

    return { success: true };
  } catch (err) {
    console.error("Error marking read:", err);
    throw createError({ statusCode: 500, message: "Failed to mark as read" });
  }
});
