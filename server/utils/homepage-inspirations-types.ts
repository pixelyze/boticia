/**
 * Types TypeScript pour les inspirations de la page d'accueil
 */

// ========================================
// HOMEPAGE INSPIRATION CATEGORY
// ========================================

export interface HomepageInspirationCategory {
  id: string;
  slug: string;
  cover_filename?: string;
  cover_original_filename?: string;
  cover_mime_type?: string;
  cover_file_size?: number;
  cover_storage_path?: string;
  cover_public_url?: string;
  sort_order: number;
  is_published: boolean;
  link?: string;
  created_at: string;
  updated_at: string;
}

export interface UpdateCategoryInput {
  cover_filename?: string | null;
  cover_original_filename?: string | null;
  cover_mime_type?: string | null;
  cover_file_size?: number | null;
  cover_storage_path?: string | null;
  cover_public_url?: string | null;
  sort_order?: number;
  is_published?: boolean;
  link?: string;
}

// ========================================
// HOMEPAGE INSPIRATION IMAGE
// ========================================

export interface HomepageInspirationImage {
  id: string;
  category_id: string;
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

export interface CreateImageInput {
  category_id: string;
  filename: string;
  original_filename: string;
  mime_type: string;
  file_size: number;
  storage_path: string;
  public_url: string;
  caption?: string;
}
