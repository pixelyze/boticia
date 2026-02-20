/**
 * POST /api/client/inspirations
 * Client — Upload an inspiration photo (multipart)
 */

import { requireClient } from "~/server/utils/serverAuth";
import {
  createInspiration,
  countInspirations,
} from "~/server/utils/client-portal";
import { getSupabase } from "~/server/utils/supabase";

const MAX_INSPIRATIONS = 20;

export default defineEventHandler(async (event) => {
  const { user, quoteRequest } = await requireClient(event);

  // Check limit
  const count = await countInspirations(quoteRequest.id);
  if (count >= MAX_INSPIRATIONS) {
    throw createError({
      statusCode: 400,
      message: `Maximum ${MAX_INSPIRATIONS} inspirations allowed`,
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
    const captionField = formData.find(
      (f) => f.name === "caption"
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
      "image/heic",
    ];
    if (!allowedTypes.includes(file.type || "")) {
      throw createError({
        statusCode: 400,
        message: "File type not allowed",
      });
    }

    // Upload to Supabase Storage
    const ext = file.filename.split(".").pop() || "jpg";
    const filename = `${quoteRequest.id}/${Date.now()}.${ext}`;

    const { error: uploadError } = await getSupabase()
      .storage.from("client-inspirations")
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
      .storage.from("client-inspirations")
      .getPublicUrl(filename);

    const inspiration = await createInspiration({
      quote_id: quoteRequest.id,
      filename,
      original_filename: file.filename,
      mime_type: file.type || "image/jpeg",
      file_size: file.data.length,
      storage_path: filename,
      public_url: toProxyUrl(publicUrl),
      caption: captionField?.data?.toString() || undefined,
      uploaded_by: user.id,
    });

    if (!inspiration) {
      throw createError({
        statusCode: 500,
        message: "Failed to save inspiration",
      });
    }

    return {
      success: true,
      data: inspiration,
    };
  } catch (err: any) {
    if (err.statusCode) throw err;
    console.error("Error uploading inspiration:", err);
    throw createError({
      statusCode: 500,
      message: "Failed to upload inspiration",
    });
  }
});
