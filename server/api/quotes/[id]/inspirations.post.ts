/**
 * POST /api/quotes/:id/inspirations
 * Public — Upload an inspiration photo for a quote request (multipart)
 */

import { getQuoteRequestById } from "~/server/utils/quotes";
import {
  createInspiration,
  countInspirations,
} from "~/server/utils/client-portal";
import { compressImage } from "~/server/utils/image-compress";
import { getSupabase } from "~/server/utils/supabase";

const MAX_INSPIRATIONS = 5;

export default defineEventHandler(async (event) => {
  const quoteId = getRouterParam(event, "id");

  if (!quoteId) {
    throw createError({
      statusCode: 400,
      message: "Quote ID is required",
    });
  }

  // Verify the quote exists
  const quote = await getQuoteRequestById(quoteId);
  if (!quote) {
    throw createError({
      statusCode: 404,
      message: "Quote request not found",
    });
  }

  // Check limit
  const count = await countInspirations(quoteId);
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

    // Compress to WebP
    const compressed = await compressImage(file.data, {
      maxWidth: 1920,
      quality: 80,
    });

    const filename = `${quoteId}/${Date.now()}.${compressed.ext}`;

    const { error: uploadError } = await getSupabase()
      .storage.from("client-inspirations")
      .upload(filename, compressed.data, {
        contentType: compressed.mimeType,
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
      quote_id: quoteId,
      filename,
      original_filename: file.filename,
      mime_type: compressed.mimeType,
      file_size: compressed.data.length,
      storage_path: filename,
      public_url: toProxyUrl(publicUrl),
      uploaded_by: undefined,
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
