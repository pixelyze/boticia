/**
 * POST /api/chat
 * Send a chat message (requires auth or dev token)
 */
import { getAuthenticatedUser } from "~/server/utils/serverAuth";
import { isAdmin } from "~/server/utils/adminAuth";
import { getSupabase } from "~/server/utils/supabase";

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    message: string;
    sender_type?: string;
    sender_name?: string;
    token?: string;
  }>(event);

  if (!body.message?.trim()) {
    throw createError({ statusCode: 400, message: "Message is required" });
  }

  const config = useRuntimeConfig();
  const isDevAccess = body.token && body.token === config.cronSecret;

  let senderType = "admin";
  let senderName = "Admin";

  if (isDevAccess) {
    senderType = "dev";
    senderName = body.sender_name || "Brutal Studio";
  } else {
    const user = await getAuthenticatedUser(event);
    if (!user) {
      throw createError({ statusCode: 401, message: "Authentication required" });
    }
    const adminUser = await isAdmin(user.email);
    senderType = adminUser ? "admin" : "client";
    senderName = user.email?.split("@")[0] || "User";
    // Capitalize first letter
    senderName = senderName.charAt(0).toUpperCase() + senderName.slice(1);
  }

  try {
    const { data, error } = await getSupabase()
      .from("chat_messages")
      .insert({
        sender_type: senderType,
        sender_name: senderName,
        message: body.message.trim(),
      })
      .select()
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (err) {
    console.error("Error sending message:", err);
    throw createError({ statusCode: 500, message: "Failed to send message" });
  }
});
