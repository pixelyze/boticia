/**
 * GET /api/chat
 * Returns chat messages (requires auth or dev token)
 */
import { getAuthenticatedUser } from "~/server/utils/serverAuth";
import { getSupabase } from "~/server/utils/supabase";

export default defineEventHandler(async (event) => {
  // Allow access with either auth token or dev secret
  const query = getQuery(event);
  const devToken = query.token as string | undefined;
  const config = useRuntimeConfig();

  const isDevAccess = devToken && devToken === config.cronSecret;

  if (!isDevAccess) {
    const user = await getAuthenticatedUser(event);
    if (!user) {
      throw createError({ statusCode: 401, message: "Authentication required" });
    }
  }

  try {
    const { data, error } = await getSupabase()
      .from("chat_messages")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) throw error;

    return { success: true, data: data || [] };
  } catch (err) {
    console.error("Error fetching chat:", err);
    throw createError({ statusCode: 500, message: "Failed to fetch messages" });
  }
});
