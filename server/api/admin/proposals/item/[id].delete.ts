/**
 * DELETE /api/admin/proposals/item/:id
 * Admin — Delete a proposal
 */

import { requireAdmin } from "~/server/utils/serverAuth";
import {
  getProposalById,
  deleteProposal,
} from "~/server/utils/client-portal";
import { getSupabase } from "~/server/utils/supabase";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      message: "Proposal ID is required",
    });
  }

  try {
    const proposal = await getProposalById(id);

    if (!proposal) {
      throw createError({
        statusCode: 404,
        message: "Proposal not found",
      });
    }

    // Delete from storage if it has a file
    if (proposal.storage_path) {
      await getSupabase()
        .storage.from("project-proposals")
        .remove([proposal.storage_path]);
    }

    const deleted = await deleteProposal(id);

    if (!deleted) {
      throw createError({
        statusCode: 500,
        message: "Failed to delete proposal",
      });
    }

    return { success: true };
  } catch (err: any) {
    if (err.statusCode) throw err;
    console.error("Error deleting proposal:", err);
    throw createError({
      statusCode: 500,
      message: "Failed to delete proposal",
    });
  }
});
