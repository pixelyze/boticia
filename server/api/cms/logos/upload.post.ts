/**
 * POST /api/cms/logos/upload
 * Upload a logo to Supabase Storage
 */

import { getSupabase } from "~/server/utils/supabase";
import { serverSupabaseUser } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  if (!user) {
    throw createError({
      statusCode: 401,
      message: "Authentication required",
    });
  }

  const formData = await readMultipartFormData(event);
  if (!formData || formData.length === 0) {
    throw createError({
      statusCode: 400,
      message: "No file provided",
    });
  }

  const file = formData[0];
  if (!file.data || !file.filename) {
    throw createError({
      statusCode: 400,
      message: "Invalid file",
    });
  }

  const allowedTypes = ["image/png", "image/jpeg", "image/svg+xml", "image/webp"];
  if (!allowedTypes.includes(file.type || "")) {
    throw createError({
      statusCode: 400,
      message: "File type not allowed. Use PNG, JPEG, SVG or WebP.",
    });
  }

  const ext = file.filename.split(".").pop();
  const fileName = `logo-${Date.now()}.${ext}`;

  const supabase = getSupabase();

  const { data, error } = await supabase.storage
    .from("logos")
    .upload(fileName, file.data, {
      contentType: file.type || "image/png",
      upsert: false,
    });

  if (error) {
    console.error("Error uploading logo:", error.message);
    throw createError({
      statusCode: 500,
      message: "Failed to upload logo: " + error.message,
    });
  }

  const { data: urlData } = supabase.storage
    .from("logos")
    .getPublicUrl(data.path);

  return {
    success: true,
    data: {
      path: data.path,
      url: toProxyUrl(urlData.publicUrl),
    },
  };
});
