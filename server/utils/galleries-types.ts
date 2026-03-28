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

export interface GalleryImage {
  id: string;
  gallery_id: string;
  filename: string;
  original_filename: string;
  mime_type: string;
  file_size: number;
  storage_path: string;
  public_url: string;
  caption?: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface CreateGalleryImageInput {
  gallery_id: string;
  filename: string;
  original_filename: string;
  mime_type: string;
  file_size: number;
  storage_path: string;
  public_url: string;
  caption?: string;
}
