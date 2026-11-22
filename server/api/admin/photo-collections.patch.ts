/**
 * PATCH /api/admin/photo-collections
 * Admin — Renomme une collection de la photothèque, ou la supprime.
 * Body : { from: "Ancien nom", to: "Nouveau nom" } pour renommer,
 *        { from: "Ancien nom", to: null } pour supprimer.
 * Les photos ne sont jamais supprimées : seul leur champ collection change.
 */

import { requireAdmin } from "~/server/utils/serverAuth";
import { getSupabase } from "~/server/utils/supabase";
import { cleanCollection } from "~/server/utils/photo-placements";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  const body = await readBody(event);
  const from = cleanCollection(body?.from);
  if (!from) {
    throw createError({ statusCode: 400, message: "Collection is required" });
  }
  const to = cleanCollection(body?.to);

  const { data, error } = await getSupabase()
    .from("gallery_images")
    .update({ collection: to })
    .eq("collection", from)
    .select("id");

  if (error) {
    console.error("Error updating collection:", error.message);
    throw createError({ statusCode: 500, message: "Failed to update collection" });
  }

  return { success: true, data: { count: data?.length ?? 0, collection: to } };
});
