/**
 * POST /api/admin/moodboard/:quoteId
 * Admin — Upload image/PDF to moodboard
 */

import { requireAdmin } from "~/server/utils/serverAuth";
import { createMoodboardItem } from "~/server/utils/client-portal";
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
    if (!formData || formData.length === 0) {
      throw createError({
        statusCode: 400,
        message: "No file provided",
      });
    }

    const file = formData.find((f) => f.name === "file");
    const titleField = formData.find(
      (f) => f.name === "title"
    );
    const descField = formData.find(
      (f) => f.name === "description"
    );

    if (!file || !file.data || !file.filename) {
      throw createError({
        statusCode: 400,
        message: "Invalid file",
      });
    }

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/webp",
      "application/pdf",
    ];
    if (!allowedTypes.includes(file.type || "")) {
      throw createError({
        statusCode: 400,
        message: "File type not allowed",
      });
    }

    const isPdf = file.type === "application/pdf";
    const itemType = isPdf ? "pdf" : "image";
    const ext = file.filename.split(".").pop() || "jpg";
    const filename = `${quoteId}/${Date.now()}.${ext}`;

    const { error: uploadError } = await getSupabase()
      .storage.from("project-moodboard")
      .upload(filename, file.data, {
        contentType: file.type || "image/jpeg",
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
      .storage.from("project-moodboard")
      .getPublicUrl(filename);

    const item = await createMoodboardItem({
      quote_id: quoteId,
      item_type: itemType,
      filename,
      original_filename: file.filename,
      mime_type: file.type || "image/jpeg",
      file_size: file.data.length,
      storage_path: filename,
      public_url: publicUrl,
      title: titleField?.data?.toString() || undefined,
      description: descField?.data?.toString() || undefined,
      uploaded_by: user.id,
    });

    if (!item) {
      throw createError({
        statusCode: 500,
        message: "Failed to save moodboard item",
      });
    }

    return {
      success: true,
      data: item,
    };
  } catch (err: any) {
    if (err.statusCode) throw err;
    console.error("Error uploading moodboard item:", err);
    throw createError({
      statusCode: 500,
      message: "Failed to upload moodboard item",
    });
  }
});
