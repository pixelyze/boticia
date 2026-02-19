/**
 * PATCH /api/admin/proposals/item/:id
 * Admin — Update a proposal
 */

import { requireAdmin } from "~/server/utils/serverAuth";
import {
  getProposalById,
  updateProposal,
} from "~/server/utils/client-portal";
import type { UpdateProposalInput } from "~/server/utils/client-portal-types";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      message: "Proposal ID is required",
    });
  }

  const body = await readBody<UpdateProposalInput>(event);

  try {
    const existing = await getProposalById(id);

    if (!existing) {
      throw createError({
        statusCode: 404,
        message: "Proposal not found",
      });
    }

    const proposal = await updateProposal(id, body);

    if (!proposal) {
      throw createError({
        statusCode: 500,
        message: "Failed to update proposal",
      });
    }

    return {
      success: true,
      data: proposal,
    };
  } catch (err: any) {
    if (err.statusCode) throw err;
    console.error("Error updating proposal:", err);
    throw createError({
      statusCode: 500,
      message: "Failed to update proposal",
    });
  }
});
