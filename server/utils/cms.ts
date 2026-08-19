/**
 * CMS Utility Functions
 * CRUD operations for Boticia CMS
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabase } from "./supabase";
import type {
  CmsPage,
  CmsSection,
  CmsComponent,
  CmsConfig,
  CmsMedia,
  CmsHistory,
  CreatePageInput,
  UpdatePageInput,
  CreateSectionInput,
  UpdateSectionInput,
  CreateComponentInput,
  UpdateComponentInput,
  CreateConfigInput,
  UpdateConfigInput,
  CreateMediaInput,
  UpdateMediaInput,
  CreateHistoryInput,
} from "./cms-types";

// ========================================
// PAGES
// ========================================

/**
 * Get all pages
 */
export async function getPages(
  filters?: {
    status?: string;
    locale?: string;
    includeSections?: boolean;
  }
): Promise<CmsPage[]> {
  try {
    let query = getSupabase().from("cms_pages").select("*");

    if (filters?.status) {
      query = query.eq("status", filters.status);
    }

    if (filters?.locale) {
      query = query.eq("locale", filters.locale);
    }

    if (filters?.includeSections) {
      query = query.select(`
        *,
        sections:cms_sections(*)
      `);
    }

    query = query.order("created_at", { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error("Error getting pages:", error.message);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Error:", err);
    return [];
  }
}

/**
 * Get page by slug
 */
export async function getPageBySlug(
  slug: string,
  includeSections = true
): Promise<CmsPage | null> {
  try {
    let query = getSupabase().from("cms_pages").select("*").eq("slug", slug);

    if (includeSections) {
      query = query.select(`
        *,
        sections:cms_sections(*)
      `);
    }

    const { data, error } = await query.single();

    if (error) {
      console.error("Error getting page:", error.message);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Error:", err);
    return null;
  }
}

/**
 * Get page by ID
 */
export async function getPageById(
  id: string,
  includeSections = false
): Promise<CmsPage | null> {
  try {
    let query = getSupabase().from("cms_pages").select("*").eq("id", id);

    if (includeSections) {
      query = query.select(`
        *,
        sections:cms_sections(*)
      `);
    }

    const { data, error } = await query.single();

    if (error) {
      console.error("Error getting page:", error.message);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Error:", err);
    return null;
  }
}

/**
 * Create page
 */
export async function createPage(
  input: CreatePageInput,
  userId?: string
): Promise<CmsPage | null> {
  try {
    const pageData: any = {
      ...input,
      created_by: userId,
      updated_by: userId,
    };

    const { data, error } = await getSupabase()
      .from("cms_pages")
      .insert(pageData)
      .select()
      .single();

    if (error) {
      console.error("Error creating page:", error.message);
      return null;
    }

    // Log history
    await createHistory({
      entity_type: "page",
      entity_id: data.id,
      action: "create",
      changes: { created: true },
    });

    return data;
  } catch (err) {
    console.error("Error:", err);
    return null;
  }
}

/**
 * Update page
 */
export async function updatePage(
  id: string,
  input: UpdatePageInput,
  userId?: string
): Promise<CmsPage | null> {
  try {
    // Get previous data for history
    const previous = await getPageById(id);

    const updateData: any = {
      ...input,
      updated_by: userId,
    };

    // If publishing, set published_at
    if (input.status === "published" && previous?.status !== "published") {
      updateData.published_at = new Date().toISOString();
    }

    const { data, error } = await getSupabase()
      .from("cms_pages")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating page:", error.message);
      return null;
    }

    // Log history
    await createHistory({
      entity_type: "page",
      entity_id: id,
      action: input.status === "published" ? "publish" : "update",
      changes: input,
      previous_data: previous || undefined,
    });

    return data;
  } catch (err) {
    console.error("Error:", err);
    return null;
  }
}

/**
 * Delete page
 */
export async function deletePage(id: string): Promise<boolean> {
  try {
    // Get previous data for history
    const previous = await getPageById(id);

    const { error } = await getSupabase().from("cms_pages").delete().eq("id", id);

    if (error) {
      console.error("Error deleting page:", error.message);
      return false;
    }

    // Log history
    await createHistory({
      entity_type: "page",
      entity_id: id,
      action: "delete",
      changes: { deleted: true },
      previous_data: previous || undefined,
    });

    return true;
  } catch (err) {
    console.error("Error:", err);
    return false;
  }
}

// ========================================
// SECTIONS
// ========================================

/**
 * Get sections by page ID
 */
export async function getSectionsByPageId(
  pageId: string
): Promise<CmsSection[]> {
  try {
    const { data, error } = await getSupabase()
      .from("cms_sections")
      .select("*")
      .eq("page_id", pageId)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error getting sections:", error.message);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Error:", err);
    return [];
  }
}

/**
 * Get section by ID
 */
export async function getSectionById(id: string): Promise<CmsSection | null> {
  try {
    const { data, error } = await getSupabase()
      .from("cms_sections")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error getting section:", error.message);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Error:", err);
    return null;
  }
}

/**
 * Create section
 */
export async function createSection(
  input: CreateSectionInput
): Promise<CmsSection | null> {
  try {
    const { data, error } = await getSupabase()
      .from("cms_sections")
      .insert(input)
      .select()
      .single();

    if (error) {
      console.error("Error creating section:", error.message);
      return null;
    }

    // Log history
    await createHistory({
      entity_type: "section",
      entity_id: data.id,
      action: "create",
      changes: { created: true },
    });

    return data;
  } catch (err) {
    console.error("Error:", err);
    return null;
  }
}

/**
 * Update section
 */
export async function updateSection(
  id: string,
  input: UpdateSectionInput
): Promise<CmsSection | null> {
  try {
    const previous = await getSectionById(id);

    const { data, error } = await getSupabase()
      .from("cms_sections")
      .update(input)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating section:", error.message);
      return null;
    }

    // Log history
    await createHistory({
      entity_type: "section",
      entity_id: id,
      action: "update",
      changes: input,
      previous_data: previous || undefined,
    });

    return data;
  } catch (err) {
    console.error("Error:", err);
    return null;
  }
}

/**
 * Delete section
 */
export async function deleteSection(id: string): Promise<boolean> {
  try {
    const previous = await getSectionById(id);

    const { error } = await getSupabase()
      .from("cms_sections")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting section:", error.message);
      return false;
    }

    // Log history
    await createHistory({
      entity_type: "section",
      entity_id: id,
      action: "delete",
      changes: { deleted: true },
      previous_data: previous || undefined,
    });

    return true;
  } catch (err) {
    console.error("Error:", err);
    return false;
  }
}

/**
 * Reorder sections
 */
export async function reorderSections(
  sectionIds: string[]
): Promise<boolean> {
  try {
    const updates = sectionIds.map((id, index) =>
      getSupabase()
        .from("cms_sections")
        .update({ sort_order: index })
        .eq("id", id)
    );

    await Promise.all(updates);

    return true;
  } catch (err) {
    console.error("Error reordering sections:", err);
    return false;
  }
}

// ========================================
// COMPONENTS
// ========================================

/**
 * Get all components
 */
export async function getComponents(
  filters?: { category?: string; is_active?: boolean }
): Promise<CmsComponent[]> {
  try {
    let query = getSupabase().from("cms_components").select("*");

    if (filters?.category) {
      query = query.eq("category", filters.category);
    }

    if (filters?.is_active !== undefined) {
      query = query.eq("is_active", filters.is_active);
    }

    query = query.order("name", { ascending: true });

    const { data, error } = await query;

    if (error) {
      console.error("Error getting components:", error.message);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Error:", err);
    return [];
  }
}

/**
 * Get component by name
 */
export async function getComponentByName(
  name: string
): Promise<CmsComponent | null> {
  try {
    const { data, error } = await getSupabase()
      .from("cms_components")
      .select("*")
      .eq("name", name)
      .single();

    if (error) {
      console.error("Error getting component:", error.message);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Error:", err);
    return null;
  }
}

/**
 * Create component
 */
export async function createComponent(
  input: CreateComponentInput
): Promise<CmsComponent | null> {
  try {
    const { data, error } = await getSupabase()
      .from("cms_components")
      .insert(input)
      .select()
      .single();

    if (error) {
      console.error("Error creating component:", error.message);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Error:", err);
    return null;
  }
}

/**
 * Update component
 */
export async function updateComponent(
  id: string,
  input: UpdateComponentInput
): Promise<CmsComponent | null> {
  try {
    const { data, error } = await getSupabase()
      .from("cms_components")
      .update(input)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating component:", error.message);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Error:", err);
    return null;
  }
}

// ========================================
// CONFIG
// ========================================

/**
 * Get all config
 */
export async function getConfigs(
  filters?: { category?: string; locale?: string }
): Promise<CmsConfig[]> {
  try {
    let query = getSupabase().from("cms_config").select("*");

    if (filters?.category) {
      query = query.eq("category", filters.category);
    }

    if (filters?.locale) {
      query = query.eq("locale", filters.locale);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error getting configs:", error.message);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Error:", err);
    return [];
  }
}

/**
 * Get config by key
 */
export async function getConfigByKey(
  key: string,
  locale?: string
): Promise<CmsConfig | null> {
  try {
    let query = getSupabase().from("cms_config").select("*").eq("key", key);

    if (locale) {
      query = query.eq("locale", locale);
    }

    // maybeSingle() : une config absente est un cas normal (upsertConfig
    // s'en sert pour choisir entre insert et update, et l'endpoint en fait
    // un 404). single() en faisait une erreur journalisée.
    const { data, error } = await query.maybeSingle();

    if (error) {
      console.error("Error getting config:", error.message);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Error:", err);
    return null;
  }
}

/**
 * Create or update config
 */
export async function upsertConfig(
  input: CreateConfigInput,
  userId?: string
): Promise<CmsConfig | null> {
  try {
    const existing = await getConfigByKey(input.key, input.locale);

    if (existing) {
      const { data, error } = await getSupabase()
        .from("cms_config")
        .update({ ...input, updated_by: userId })
        .eq("id", existing.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating config:", error.message);
        return null;
      }

      return data;
    } else {
      const { data, error } = await getSupabase()
        .from("cms_config")
        .insert({ ...input, updated_by: userId })
        .select()
        .single();

      if (error) {
        console.error("Error creating config:", error.message);
        return null;
      }

      return data;
    }
  } catch (err) {
    console.error("Error:", err);
    return null;
  }
}

// ========================================
// MEDIA
// ========================================

/**
 * Get all media
 */
export async function getMedia(): Promise<CmsMedia[]> {
  try {
    const { data, error } = await getSupabase()
      .from("cms_media")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error getting media:", error.message);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Error:", err);
    return [];
  }
}

/**
 * Create media entry
 */
export async function createMedia(
  input: CreateMediaInput,
  userId?: string
): Promise<CmsMedia | null> {
  try {
    const { data, error } = await getSupabase()
      .from("cms_media")
      .insert({ ...input, uploaded_by: userId })
      .select()
      .single();

    if (error) {
      console.error("Error creating media:", error.message);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Error:", err);
    return null;
  }
}

/**
 * Update media metadata
 */
export async function updateMedia(
  id: string,
  input: UpdateMediaInput
): Promise<CmsMedia | null> {
  try {
    const { data, error } = await getSupabase()
      .from("cms_media")
      .update(input)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating media:", error.message);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Error:", err);
    return null;
  }
}

/**
 * Delete media
 */
export async function deleteMedia(id: string): Promise<boolean> {
  try {
    const { error } = await getSupabase()
      .from("cms_media")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting media:", error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Error:", err);
    return false;
  }
}

// ========================================
// HISTORY
// ========================================

/**
 * Create history entry
 */
export async function createHistory(
  input: CreateHistoryInput
): Promise<CmsHistory | null> {
  try {
    const { data, error } = await getSupabase()
      .from("cms_history")
      .insert(input)
      .select()
      .single();

    if (error) {
      console.error("Error creating history:", error.message);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Error:", err);
    return null;
  }
}

/**
 * Get history for entity
 */
export async function getHistory(
  entityType: string,
  entityId: string
): Promise<CmsHistory[]> {
  try {
    const { data, error } = await getSupabase()
      .from("cms_history")
      .select("*")
      .eq("entity_type", entityType)
      .eq("entity_id", entityId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error getting history:", error.message);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Error:", err);
    return [];
  }
}
