/**
 * POST /api/quotes/reorder
 * Admin — Batch update kanban positions (and optionally status)
 */

import { requireAdmin } from "~/server/utils/serverAuth";
import { getSupabase } from "~/server/utils/supabase";
import { addQuoteActivity } from "~/server/utils/quotes";
import type { QuoteRequestStatus } from "~/server/utils/quotes-types";

interface ReorderItem {
  id: string;
  kanban_position: number;
  status?: QuoteRequestStatus;
}

export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  const body = await readBody<{ items: ReorderItem[] }>(event);

  if (!body.items || !Array.isArray(body.items)) {
    throw createError({
      statusCode: 400,
      message: "items array is required",
    });
  }

  try {
    const supabase = getSupabase();

    // Fetch current statuses for activity logging
    const ids = body.items
      .filter((item) => item.status)
      .map((item) => item.id);

    let existingMap: Record<string, string> = {};
    if (ids.length > 0) {
      const { data } = await supabase
        .from("quote_requests")
        .select("id, status")
        .in("id", ids);
      if (data) {
        existingMap = Object.fromEntries(
          data.map((d) => [d.id, d.status])
        );
      }
    }

    // Update each item
    const updates = body.items.map(async (item) => {
      const updateData: Record<string, any> = {
        kanban_position: item.kanban_position,
      };
      if (item.status) {
        updateData.status = item.status;
      }

      const { error } = await supabase
        .from("quote_requests")
        .update(updateData)
        .eq("id", item.id);

      if (error) {
        console.error(
          `Error updating quote ${item.id}:`,
          error.message
        );
      }

      // Log status change activity
      if (
        item.status &&
        existingMap[item.id] &&
        existingMap[item.id] !== item.status
      ) {
        await addQuoteActivity(item.id, "status_changed", {
          from: existingMap[item.id],
          to: item.status,
        });
      }
    });

    await Promise.all(updates);

    return { success: true };
  } catch (err: any) {
    if (err.statusCode) {
      throw err;
    }

    console.error("Error reordering quotes:", err);

    throw createError({
      statusCode: 500,
      message: "Failed to reorder quotes",
    });
  }
});
