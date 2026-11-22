/**
 * Photothèque et emplacements
 *
 * Une photo est déposée une seule fois (table gallery_images), puis placée
 * sur les pages du site (table photo_placements) : une zone par page, des
 * positions numérotées à partir de 0.
 */

import { getSupabase } from "./supabase";
import type { GalleryImage, PhotoType } from "./galleries-types";

// Pages du site et leurs zones. size = nombre de cases ; null = sans limite.
export const PLACEMENT_PAGES = {
  home: { grid: 9, viewer: null },
  wedding: { grid: 9, viewer: null },
  // subscription : les 2 photos de la section « Abonnement floral »
  events: { grid: 9, viewer: null, subscription: 2 },
  workshops: { grid: 3 },
  creations: {
    opening: 1,
    bouquets: 2,
    ceremonie: 2,
    reception: 2,
    accessoires: 2,
  },
} as const;

export type PlacementPage = keyof typeof PLACEMENT_PAGES;

export interface Placement {
  image_id: string;
  page: PlacementPage;
  zone: string;
  position: number;
}

// Ce qu'une page publique reçoit d'une photo
export interface PublicPhoto {
  id: string;
  public_url: string;
  // Légende dans la langue demandée (l'anglais sert aussi au japonais,
  // le français sert si l'anglais est vide)
  caption: string | null;
}

export function isPlacementPage(page: unknown): page is PlacementPage {
  return typeof page === "string" && page in PLACEMENT_PAGES;
}

export function zoneSize(page: PlacementPage, zone: string): number | null | undefined {
  return (PLACEMENT_PAGES[page] as Record<string, number | null>)[zone];
}

/**
 * Photos d'une page, rangées par zone. Les zones à taille fixe gardent
 * leurs cases vides (null) pour que la mise en page reste stable.
 */
export async function getPagePhotos(
  page: PlacementPage,
  locale = "fr"
): Promise<Record<string, (PublicPhoto | null)[]>> {
  const { data, error } = await getSupabase()
    .from("photo_placements")
    .select(
      "zone, position, image:gallery_images(id, public_url, caption, caption_en)"
    )
    .eq("page", page)
    .order("position", { ascending: true });

  if (error) {
    console.error("Error getting page photos:", error.message);
    throw error;
  }

  const result: Record<string, (PublicPhoto | null)[]> = {};
  for (const [zone, size] of Object.entries(PLACEMENT_PAGES[page])) {
    result[zone] = size ? Array(size).fill(null) : [];
  }
  for (const row of (data || []) as any[]) {
    if (!row.image || !(row.zone in result)) continue;
    const { caption_en: captionEn, ...photo } = row.image;
    if (locale !== "fr" && captionEn) photo.caption = captionEn;
    row.image = photo;
    const list = result[row.zone];
    const size = zoneSize(page, row.zone);
    if (size) {
      if (row.position < size) list[row.position] = row.image;
    } else {
      list.push(row.image);
    }
  }
  return result;
}

/**
 * Photothèque complète (admin) et tous les emplacements
 */
export async function getLibrary(): Promise<{
  photos: GalleryImage[];
  placements: Placement[];
}> {
  const [photos, placements] = await Promise.all([
    getSupabase()
      .from("gallery_images")
      .select("*")
      .order("created_at", { ascending: false }),
    getSupabase()
      .from("photo_placements")
      .select("image_id, page, zone, position")
      .order("position", { ascending: true }),
  ]);

  if (photos.error) throw photos.error;
  if (placements.error) throw placements.error;

  return {
    photos: photos.data || [],
    placements: (placements.data || []) as Placement[],
  };
}

/**
 * Remplace le contenu d'une zone. imageIds : une photo par position,
 * null pour une case vide (zones à taille fixe).
 */
export async function setZone(
  page: PlacementPage,
  zone: string,
  imageIds: (string | null)[]
): Promise<void> {
  const supabase = getSupabase();

  const { error: deleteError } = await supabase
    .from("photo_placements")
    .delete()
    .eq("page", page)
    .eq("zone", zone);
  if (deleteError) throw deleteError;

  const rows = imageIds
    .map((image_id, position) => ({ image_id, page, zone, position }))
    .filter((row) => row.image_id);
  if (!rows.length) return;

  const { error: insertError } = await supabase
    .from("photo_placements")
    .insert(rows);
  if (insertError) throw insertError;
}

export function isPhotoType(value: unknown): value is PhotoType {
  return value === "mariage" || value === "entreprise" || value === "atelier";
}

export const COLLECTION_MAX = 80;

/**
 * Nom de collection propre : espaces en trop retirés, vide = aucune
 * collection (null). Lève une erreur 400 si le nom est trop long.
 */
export function cleanCollection(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value !== "string") {
    throw createError({ statusCode: 400, message: "Invalid collection" });
  }
  const name = value.replace(/\s+/g, " ").trim();
  if (name.length > COLLECTION_MAX) {
    throw createError({ statusCode: 400, message: "Collection name too long" });
  }
  return name || null;
}
