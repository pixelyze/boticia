/**
 * POST /api/admin/proposals/:quoteId
 * Admin — Create a proposal (with optional PDF upload)
 */

import { requireAdmin } from "~/server/utils/serverAuth";
import { createProposal } from "~/server/utils/client-portal";
import { getSupabase } from "~/server/utils/supabase";

export default defineEventHandler(async (event) => {
  const user = await requireAdmin(event);
  const quoteId = getRouterParam(event, "quoteId");

  if (!quoteId) {
    throw createError({
      statusCode: 400,
      message: "Quote ID is required",
    });
  }

  try {
    const formData = await readMultipartFormData(event);
    if (!formData) {
      throw createError({
        statusCode: 400,
        message: "Form data required",
      });
    }

    const titleField = formData.find(
      (f) => f.name === "title"
    );
    const descField = formData.find(
      (f) => f.name === "description"
    );
    const amountField = formData.find(
      (f) => f.name === "total_amount_cents"
    );
    const statusField = formData.find(
      (f) => f.name === "status"
    );
    const file = formData.find((f) => f.name === "file");

    const title = titleField?.data?.toString();
    if (!title) {
      throw createError({
        statusCode: 400,
        message: "Title is required",
      });
    }

    let fileData: {
      filename?: string;
      original_filename?: string;
      mime_type?: string;
      file_size?: number;
      storage_path?: string;
      public_url?: string;
    } = {};

    if (file?.data && file.filename) {
      const ext = file.filename.split(".").pop() || "pdf";
      const filename = `${quoteId}/${Date.now()}.${ext}`;

      const { error: uploadError } = await getSupabase()
        .storage.from("project-proposals")
        .upload(filename, file.data, {
          contentType: file.type || "application/pdf",
        });

      if (uploadError) {
        console.error("Upload error:", uploadError.message);
        throw createError({
          statusCode: 500,
          message: "Failed to upload file",
        });
      }

      const {
        data: { publicUrl },
      } = getSupabase()
        .storage.from("project-proposals")
        .getPublicUrl(filename);

      fileData = {
        filename,
        original_filename: file.filename,
        mime_type: file.type || "application/pdf",
        file_size: file.data.length,
        storage_path: filename,
        public_url: toProxyUrl(publicUrl),
      };
    }

    const proposal = await createProposal({
      quote_id: quoteId,
      title,
      description: descField?.data?.toString() || undefined,
      total_amount_cents: amountField?.data
        ? parseInt(amountField.data.toString(), 10)
        : undefined,
      status:
        (statusField?.data?.toString() as any) || "draft",
      created_by: user.id,
      ...fileData,
    });

    if (!proposal) {
      throw createError({
        statusCode: 500,
        message: "Failed to create proposal",
      });
    }

    return {
      success: true,
      data: proposal,
    };
  } catch (err: any) {
    if (err.statusCode) throw err;
    console.error("Error creating proposal:", err);
    throw createError({
      statusCode: 500,
      message: "Failed to create proposal",
    });
  }
});
