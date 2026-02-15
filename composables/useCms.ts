/**
 * Composable pour gérer le CMS côté client
 * Appels API centralisés pour Pages, Sections, Config, etc.
 */

import type {
  CmsPage,
  CmsSection,
  CmsComponent,
  CmsConfig,
  CmsMedia,
  CreatePageInput,
  UpdatePageInput,
  CreateSectionInput,
  UpdateSectionInput,
  CreateConfigInput,
} from "~/server/utils/cms-types";

export const useCms = () => {
  // ========================================
  // PAGES
  // ========================================

  /**
   * Get all pages
   */
  const getPages = async (filters?: {
    status?: string;
    locale?: string;
    includeSections?: boolean;
  }): Promise<CmsPage[]> => {
    try {
      const query = new URLSearchParams();

      if (filters?.status) query.append("status", filters.status);
      if (filters?.locale) query.append("locale", filters.locale);
      if (filters?.includeSections)
        query.append("includeSections", "true");

      const response = await $fetch<{ success: boolean; data: CmsPage[] }>(
        `/api/cms/pages?${query.toString()}`
      );

      return response.data || [];
    } catch (error) {
      console.error("Error getting pages:", error);
      return [];
    }
  };

  /**
   * Get page by slug
   */
  const getPageBySlug = async (
    slug: string,
    includeSections = true
  ): Promise<CmsPage | null> => {
    try {
      const query = includeSections ? "?includeSections=true" : "";
      const response = await $fetch<{ success: boolean; data: CmsPage }>(
        `/api/cms/pages/${encodeURIComponent(slug)}${query}`
      );

      return response.data;
    } catch (error) {
      console.error("Error getting page:", error);
      return null;
    }
  };

  /**
   * Create page
   */
  const createPage = async (
    input: CreatePageInput
  ): Promise<CmsPage | null> => {
    try {
      const response = await $fetch<{ success: boolean; data: CmsPage }>(
        "/api/cms/pages",
        {
          method: "POST",
          body: input,
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error creating page:", error);
      throw error;
    }
  };

  /**
   * Update page
   */
  const updatePage = async (
    id: string,
    input: UpdatePageInput
  ): Promise<CmsPage | null> => {
    try {
      const response = await $fetch<{ success: boolean; data: CmsPage }>(
        `/api/cms/pages/${id}`,
        {
          method: "PUT",
          body: input,
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error updating page:", error);
      throw error;
    }
  };

  /**
   * Delete page
   */
  const deletePage = async (id: string): Promise<boolean> => {
    try {
      await $fetch(`/api/cms/pages/${id}`, {
        method: "DELETE",
      });

      return true;
    } catch (error) {
      console.error("Error deleting page:", error);
      return false;
    }
  };

  /**
   * Publish page
   */
  const publishPage = async (id: string): Promise<CmsPage | null> => {
    return updatePage(id, { status: "published" });
  };

  /**
   * Unpublish page
   */
  const unpublishPage = async (id: string): Promise<CmsPage | null> => {
    return updatePage(id, { status: "draft" });
  };

  // ========================================
  // SECTIONS
  // ========================================

  /**
   * Get sections by page ID
   */
  const getSectionsByPageId = async (
    pageId: string
  ): Promise<CmsSection[]> => {
    try {
      const response = await $fetch<{
        success: boolean;
        data: CmsSection[];
      }>(`/api/cms/sections?pageId=${pageId}`);

      return response.data || [];
    } catch (error) {
      console.error("Error getting sections:", error);
      return [];
    }
  };

  /**
   * Create section
   */
  const createSection = async (
    input: CreateSectionInput
  ): Promise<CmsSection | null> => {
    try {
      const response = await $fetch<{
        success: boolean;
        data: CmsSection;
      }>("/api/cms/sections", {
        method: "POST",
        body: input,
      });

      return response.data;
    } catch (error) {
      console.error("Error creating section:", error);
      throw error;
    }
  };

  /**
   * Update section
   */
  const updateSection = async (
    id: string,
    input: UpdateSectionInput
  ): Promise<CmsSection | null> => {
    try {
      const response = await $fetch<{
        success: boolean;
        data: CmsSection;
      }>(`/api/cms/sections/${id}`, {
        method: "PUT",
        body: input,
      });

      return response.data;
    } catch (error) {
      console.error("Error updating section:", error);
      throw error;
    }
  };

  /**
   * Delete section
   */
  const deleteSection = async (id: string): Promise<boolean> => {
    try {
      await $fetch(`/api/cms/sections/${id}`, {
        method: "DELETE",
      });

      return true;
    } catch (error) {
      console.error("Error deleting section:", error);
      return false;
    }
  };

  /**
   * Reorder sections
   */
  const reorderSections = async (
    sectionIds: string[]
  ): Promise<boolean> => {
    try {
      await $fetch("/api/cms/sections/reorder", {
        method: "POST",
        body: { sectionIds },
      });

      return true;
    } catch (error) {
      console.error("Error reordering sections:", error);
      return false;
    }
  };

  // ========================================
  // COMPONENTS
  // ========================================

  /**
   * Get all components
   */
  const getComponents = async (filters?: {
    category?: string;
    is_active?: boolean;
  }): Promise<CmsComponent[]> => {
    try {
      const query = new URLSearchParams();

      if (filters?.category) query.append("category", filters.category);
      if (filters?.is_active !== undefined)
        query.append("is_active", String(filters.is_active));

      const response = await $fetch<{
        success: boolean;
        data: CmsComponent[];
      }>(`/api/cms/components?${query.toString()}`);

      return response.data || [];
    } catch (error) {
      console.error("Error getting components:", error);
      return [];
    }
  };

  // ========================================
  // CONFIG
  // ========================================

  /**
   * Get config by key
   */
  const getConfig = async (
    key: string,
    locale?: string
  ): Promise<CmsConfig | null> => {
    try {
      const query = new URLSearchParams({ key });
      if (locale) query.append("locale", locale);

      const response = await $fetch<{ success: boolean; data: CmsConfig }>(
        `/api/cms/config?${query.toString()}`
      );

      return response.data;
    } catch (error) {
      console.error("Error getting config:", error);
      return null;
    }
  };

  /**
   * Get all configs
   */
  const getConfigs = async (filters?: {
    category?: string;
    locale?: string;
  }): Promise<CmsConfig[]> => {
    try {
      const query = new URLSearchParams();

      if (filters?.category) query.append("category", filters.category);
      if (filters?.locale) query.append("locale", filters.locale);

      const response = await $fetch<{
        success: boolean;
        data: CmsConfig[];
      }>(`/api/cms/config?${query.toString()}`);

      return response.data || [];
    } catch (error) {
      console.error("Error getting configs:", error);
      return [];
    }
  };

  /**
   * Upsert config
   */
  const upsertConfig = async (
    input: CreateConfigInput
  ): Promise<CmsConfig | null> => {
    try {
      const response = await $fetch<{ success: boolean; data: CmsConfig }>(
        "/api/cms/config",
        {
          method: "POST",
          body: input,
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error upserting config:", error);
      throw error;
    }
  };

  // ========================================
  // MEDIA
  // ========================================

  /**
   * Get all media
   */
  const getMedia = async (): Promise<CmsMedia[]> => {
    try {
      const response = await $fetch<{ success: boolean; data: CmsMedia[] }>(
        "/api/cms/media"
      );

      return response.data || [];
    } catch (error) {
      console.error("Error getting media:", error);
      return [];
    }
  };

  return {
    // Pages
    getPages,
    getPageBySlug,
    createPage,
    updatePage,
    deletePage,
    publishPage,
    unpublishPage,

    // Sections
    getSectionsByPageId,
    createSection,
    updateSection,
    deleteSection,
    reorderSections,

    // Components
    getComponents,

    // Config
    getConfig,
    getConfigs,
    upsertConfig,

    // Media
    getMedia,
  };
};
