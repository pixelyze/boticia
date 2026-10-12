/**
 * Photos du site (hero, philosophie) stockées dans le bucket "logos".
 *
 * Historiquement, ces photos passaient par /api/cms/logos/upload et
 * atterrissaient à la racine du bucket, mélangées aux logos. Les nouvelles
 * vont dans "photos/", mais les anciennes restent à la racine : on les
 * repère via la config qui les référence.
 */

import { getConfigByKey } from "~/server/utils/cms";
import { getSupabase } from "~/server/utils/supabase";

export const SITE_PHOTO_CONFIG_KEYS = [
  "hero_image",
  "events_philosophy_image_1",
  "events_philosophy_image_2",
];

/**
 * Chemins (dans le bucket "logos") des photos actuellement utilisées.
 */
export async function getSitePhotoPaths(): Promise<Set<string>> {
  const configs = await Promise.all(
    SITE_PHOTO_CONFIG_KEYS.map((key) => getConfigByKey(key))
  );

  const paths = new Set<string>();
  for (const config of configs) {
    const url = (config?.value as { url?: string } | undefined)?.url;
    const match = url?.match(/\/logos\/(.+)$/);
    if (match) paths.add(decodeURIComponent(match[1]));
  }
  return paths;
}

/**
 * Fichiers du bucket "logos" qui sont de vrais logos : sans les dossiers
 * (id null, ex. "photos/") ni les anciennes photos du site restées à la
 * racine.
 */
export async function listLogoFiles() {
  const { data, error } = await getSupabase()
    .storage.from("logos")
    .list("", { sortBy: { column: "created_at", order: "asc" } });

  if (error) {
    console.error("Error listing logos:", error.message);
    throw createError({
      statusCode: 500,
      message: "Failed to list logos",
    });
  }

  const sitePhotos = await getSitePhotoPaths();
  return (data || []).filter(
    (f) =>
      !f.name.startsWith(".") && f.id !== null && !sitePhotos.has(f.name)
  );
}
