/**
 * POST /api/feedback
 * Authenticated — Submit feedback (bug, suggestion, question)
 */

import { requireAuth } from "~/server/utils/serverAuth";
import { getSupabase } from "~/server/utils/supabase";
import { sendFeedbackNotification } from "~/server/utils/email";

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event);
  const body = await readBody<{ type: string; message: string }>(event);

  // Validate type
  const validTypes = ["bug", "suggestion", "question"];
  if (!body.type || !validTypes.includes(body.type)) {
    throw createError({
      statusCode: 400,
      message: "type must be bug, suggestion, or question",
    });
  }

  // Validate message
  if (!body.message?.trim()) {
    throw createError({
      statusCode: 400,
      message: "message is required",
    });
  }

  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("feedback")
    .insert({
      user_email: user.email || "",
      type: body.type,
      message: body.message.trim(),
    })
    .select()
    .single();

  if (error) {
    console.error("[FEEDBACK] Insert error:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to save feedback",
    });
  }

  // Send email notification (non-blocking)
  sendFeedbackNotification({
    type: body.type,
    message: body.message.trim(),
    userEmail: user.email || "",
  }).catch((err) => {
    console.error("[FEEDBACK] Email notification failed:", err);
  });

  return { success: true, data };
});
