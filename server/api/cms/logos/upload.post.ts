/**
 * POST /api/cms/logos/upload
 * Upload a logo to Supabase Storage
 */

import { getSupabase } from "~/server/utils/supabase";
import { serverSupabaseUser } from "#supabase/server";
import { compressImage } from "~/server/utils/image-compress";
import { listLogoFiles } from "~/server/utils/site-photos";

// Mêmes règles que pages/dashboard/personalisation.vue
const MAX_LOGOS = 3;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_FILE_BYTES = 4 * 1024 * 1024;

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

  const file = formData.find((part) => part.name === "file") ?? formData[0];
  // "photo" = photo du site (hero, philosophie), rangée à part pour ne pas
  // apparaître dans la liste des logos. Par défaut : un logo.
  const isPhoto =
    formData.find((part) => part.name === "kind")?.data.toString() ===
    "photo";
  if (!file.data || !file.filename) {
    throw createError({
      statusCode: 400,
      message: "Invalid file",
    });
  }

  // Pas de SVG : servi depuis boticia.fr via /api/storage, un SVG peut
  // embarquer du JavaScript exécuté sur le domaine du site.
  if (!ALLOWED_TYPES.includes(file.type || "")) {
    throw createError({
      statusCode: 400,
      message: "Format non accepté. Utilisez PNG, JPG ou WebP.",
    });
  }

  // Garde-fou : le navigateur compresse déjà au-delà de 2 Mo avant l'envoi,
  // un fichier plus lourd ne vient pas de la page.
  if (file.data.length > MAX_FILE_BYTES) {
    throw createError({
      statusCode: 413,
      message: "Fichier trop lourd (4 Mo maximum).",
    });
  }

  if (!isPhoto && (await listLogoFiles()).length >= MAX_LOGOS) {
    throw createError({
      statusCode: 409,
      message: `Limite de ${MAX_LOGOS} logos atteinte. Supprimez-en un pour en ajouter un nouveau.`,
    });
  }

  // Le logo s'affiche à ~100px de haut : 512px de large suffit (Retina
  // inclus). Une photo du site reste en pleine largeur (1920px, comme les
  // galeries).
  const { data: body, mimeType: contentType, ext } = await compressImage(
    file.data,
    {
      maxWidth: isPhoto ? 1920 : 512,
      quality: isPhoto ? 80 : 85,
    }
  );
  const fileName = isPhoto
    ? `photos/photo-${Date.now()}.${ext}`
    : `logo-${Date.now()}.${ext}`;

  const supabase = getSupabase();

  const { data, error } = await supabase.storage
    .from("logos")
    .upload(fileName, body, {
      contentType,
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
