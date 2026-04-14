/**
 * Galleries Utility Functions
 * CRUD operations for galleries and gallery images
 */

import { getSupabase } from "./supabase";
import type {
  Gallery,
  GalleryImage,
  CreateGalleryImageInput,
} from "./galleries-types";

export type { GalleryImage };

// ========================================
// GALLERIES
// ========================================

/**
 * Get all galleries ordered by title
 */
export async function getAllGalleries(): Promise<Gallery[]> {
  try {
    const { data, error } = await getSupabase()
      .from("galleries")
      .select("*")
      .order("title", { ascending: true });

    if (error) {
      console.error("Error getting galleries:", error.message);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Error:", err);
    return [];
  }
}

/**
 * Get gallery by slug (public)
 */
export async function getGalleryBySlug(
  slug: string
): Promise<Gallery | null> {
  try {
    const { data, error } = await getSupabase()
      .from("galleries")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .single();

    if (error) {
      console.error(
        "Error getting gallery by slug:",
        error.message
      );
      return null;
    }

    return data;
  } catch (err) {
    console.error("Error:", err);
    return null;
  }
}

/**
 * Get gallery by ID (admin)
 */
export async function getGalleryById(
  id: string
): Promise<Gallery | null> {
  try {
    const { data, error } = await getSupabase()
      .from("galleries")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(
        "Error getting gallery by id:",
        error.message
      );
      return null;
    }

    return data;
  } catch (err) {
    console.error("Error:", err);
    return null;
  }
}

/**
 * Update gallery
 */
export async function updateGallery(
  id: string,
  input: Partial<Pick<Gallery, "title" | "description" | "is_published">>
): Promise<Gallery | null> {
  try {
    const { data, error } = await getSupabase()
      .from("galleries")
      .update(input)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(
        "Error updating gallery:",
        error.message
      );
      return null;
    }

    return data;
  } catch (err) {
    console.error("Error:", err);
    return null;
  }
}

// ========================================
// GALLERY IMAGES
// ========================================

/**
 * Get images by gallery ID
 */
export async function getGalleryImages(
  galleryId: string
): Promise<GalleryImage[]> {
  try {
    const { data, error } = await getSupabase()
      .from("gallery_images")
      .select("*")
      .eq("gallery_id", galleryId)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error(
        "Error getting gallery images:",
        error.message
      );
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Error:", err);
    return [];
  }
}

/**
 * Get images by gallery slug (public)
 */
export async function getGalleryImagesBySlug(
  slug: string
): Promise<GalleryImage[]> {
  try {
    const gallery = await getGalleryBySlug(slug);
    if (!gallery) return [];
    return getGalleryImages(gallery.id);
  } catch (err) {
    console.error("Error:", err);
    return [];
  }
}

/**
 * Create a gallery image
 */
export async function createGalleryImage(
  input: CreateGalleryImageInput
): Promise<GalleryImage | null> {
  try {
    const { data, error } = await getSupabase()
      .from("gallery_images")
      .insert(input)
      .select()
      .single();

    if (error) {
      console.error(
        "Error creating gallery image:",
        error.message
      );
      return null;
    }

    return data;
  } catch (err) {
    console.error("Error:", err);
    return null;
  }
}

/**
 * Get gallery image by ID
 */
export async function getGalleryImageById(
  id: string
): Promise<GalleryImage | null> {
  try {
    const { data, error } = await getSupabase()
      .from("gallery_images")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(
        "Error getting gallery image:",
        error.message
      );
      return null;
    }

    return data;
  } catch (err) {
    console.error("Error:", err);
    return null;
  }
}

/**
 * Update a gallery image (bento_slot, caption, sort_order)
 */
export async function updateGalleryImage(
  id: string,
  input: Partial<Pick<GalleryImage, "bento_slot" | "caption" | "sort_order">>
): Promise<GalleryImage | null> {
  try {
    const { data, error } = await getSupabase()
      .from("gallery_images")
      .update(input)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating gallery image:", error.message);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Error:", err);
    return null;
  }
}

/**
 * Delete a gallery image
 */
export async function deleteGalleryImage(
  id: string
): Promise<boolean> {
  try {
    const { error } = await getSupabase()
      .from("gallery_images")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(
        "Error deleting gallery image:",
        error.message
      );
      return false;
    }

    return true;
  } catch (err) {
    console.error("Error:", err);
    return false;
  }
}
