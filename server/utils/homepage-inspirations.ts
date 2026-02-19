/**
 * Homepage Inspirations Utility Functions
 * CRUD operations for homepage inspiration categories and images
 */

import { getSupabase } from "./supabase";
import type {
  HomepageInspirationCategory,
  UpdateCategoryInput,
  HomepageInspirationImage,
  CreateImageInput,
} from "./homepage-inspirations-types";

// ========================================
// CATEGORIES
// ========================================

/**
 * Get all categories ordered by sort_order
 */
export async function getAllCategories(): Promise<
  HomepageInspirationCategory[]
> {
  try {
    const { data, error } = await getSupabase()
      .from("homepage_inspiration_categories")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      console.error(
        "Error getting homepage categories:",
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
 * Get published categories only
 */
export async function getPublishedCategories(): Promise<
  HomepageInspirationCategory[]
> {
  try {
    const { data, error } = await getSupabase()
      .from("homepage_inspiration_categories")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error(
        "Error getting published categories:",
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
 * Get category by ID
 */
export async function getCategoryById(
  id: string
): Promise<HomepageInspirationCategory | null> {
  try {
    const { data, error } = await getSupabase()
      .from("homepage_inspiration_categories")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(
        "Error getting homepage category:",
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
 * Update a category
 */
export async function updateCategory(
  id: string,
  input: UpdateCategoryInput
): Promise<HomepageInspirationCategory | null> {
  try {
    const { data, error } = await getSupabase()
      .from("homepage_inspiration_categories")
      .update(input)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(
        "Error updating homepage category:",
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
// IMAGES
// ========================================

/**
 * Get images by category ID
 */
export async function getImagesByCategory(
  categoryId: string
): Promise<HomepageInspirationImage[]> {
  try {
    const { data, error } = await getSupabase()
      .from("homepage_inspiration_images")
      .select("*")
      .eq("category_id", categoryId)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error(
        "Error getting homepage images:",
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
 * Create an image
 */
export async function createImage(
  input: CreateImageInput
): Promise<HomepageInspirationImage | null> {
  try {
    const { data, error } = await getSupabase()
      .from("homepage_inspiration_images")
      .insert(input)
      .select()
      .single();

    if (error) {
      console.error(
        "Error creating homepage image:",
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
 * Get image by ID
 */
export async function getImageById(
  id: string
): Promise<HomepageInspirationImage | null> {
  try {
    const { data, error } = await getSupabase()
      .from("homepage_inspiration_images")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(
        "Error getting homepage image:",
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
 * Delete an image
 */
export async function deleteImage(
  id: string
): Promise<boolean> {
  try {
    const { error } = await getSupabase()
      .from("homepage_inspiration_images")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(
        "Error deleting homepage image:",
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
