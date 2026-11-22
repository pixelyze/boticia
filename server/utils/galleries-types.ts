/**
 * Types for the galleries system
 */

export interface Gallery {
  id: string;
  slug: string;
  title: string;
  description?: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export const PHOTO_TYPES = ["mariage", "entreprise", "atelier"] as const;
export type PhotoType = (typeof PHOTO_TYPES)[number];

export interface GalleryImage {
  id: string;
  gallery_id: string | null;
  filename: string;
  original_filename: string;
  mime_type: string;
  file_size: number;
  storage_path: string;
  public_url: string;
  caption?: string;
  // Légende anglaise, facultative (versions anglaise et japonaise du site)
  caption_en?: string | null;
  sort_order: number;
  bento_slot?: number | null;
  // Type de photo (photothèque) : un seul par photo
  photo_type?: PhotoType | null;
  // Collection (photothèque) : nom de l'événement, une seule par photo
  collection?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateGalleryImageInput {
  gallery_id?: string | null;
  photo_type?: PhotoType | null;
  collection?: string | null;
  filename: string;
  original_filename: string;
  mime_type: string;
  file_size: number;
  storage_path: string;
  public_url: string;
  caption?: string;
}
