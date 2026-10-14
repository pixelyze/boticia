/**
 * POST /api/cms/logos/upload
 * Upload a logo to Supabase Storage
 */

import { getSupabase } from "~/server/utils/supabase";
import { requireAdminSession } from "~/server/utils/serverAuth";
import { compressImage, rasterizeLogo } from "~/server/utils/image-compress";
import { listLogoFiles } from "~/server/utils/site-photos";

// Mêmes règles que pages/dashboard/personalisation.vue
const MAX_LOGOS = 3;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];
const SVG_TYPE = "image/svg+xml";
const MAX_FILE_BYTES = 4 * 1024 * 1024;

export default defineEventHandler(async (event) => {
  await requireAdminSession(event);

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

  // SVG accepté pour les logos seulement, et jamais stocké tel quel :
  // servi depuis boticia.fr via /api/storage, un SVG peut embarquer du
  // JavaScript exécuté sur le domaine du site. Il est converti en PNG.
  const isSvg = !isPhoto && file.type === SVG_TYPE;
  if (!isSvg && !ALLOWED_TYPES.includes(file.type || "")) {
    throw createError({
      statusCode: 400,
      message: isPhoto
        ? "Format non accepté. Utilisez PNG, JPG ou WebP."
        : "Format non accepté. Utilisez PNG, JPG, WebP ou SVG.",
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
  let converted;
  try {
    converted = isPhoto
      ? await compressImage(file.data, { maxWidth: 1920, quality: 80 })
      : await rasterizeLogo(file.data, isSvg);
  } catch {
    throw createError({
      statusCode: 400,
      message: "Image illisible. Vérifiez le fichier et réessayez.",
    });
  }
  const { data: body, mimeType: contentType, ext } = converted;
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
