/**
 * Types TypeScript pour le CMS Boticia
 */

// ========================================
// ENUMS & CONSTANTS
// ========================================

export type PageStatus = "draft" | "published" | "archived";
export type PageLayout = "default" | "landing" | "dashboard";
export type Locale = "fr" | "en" | "ja";

export type HistoryAction = "create" | "update" | "delete" | "publish" | "unpublish";
export type HistoryEntityType = "page" | "section" | "component" | "config";

export type ComponentCategory = "ui" | "landing" | "form" | "layout" | "modal";

// ========================================
// CMS PAGE
// ========================================

export interface CmsPage {
  id: string;
  slug: string;
  title: string;
  description?: string;

  // Métadonnées SEO
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
  og_image?: string;
  canonical_url?: string;
  robots?: string;

  // État
  status: PageStatus;
  published_at?: string;

  // Configuration
  layout: PageLayout;
  locale: Locale;

  // Timestamps
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;

  // Relations (populated via join)
  sections?: CmsSection[];
}

export interface CreatePageInput {
  slug: string;
  title: string;
  description?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
  og_image?: string;
  status?: PageStatus;
  layout?: PageLayout;
  locale?: Locale;
}

export interface UpdatePageInput {
  slug?: string;
  title?: string;
  description?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
  og_image?: string;
  canonical_url?: string;
  robots?: string;
  status?: PageStatus;
  layout?: PageLayout;
  locale?: Locale;
}

// ========================================
// CMS SECTION
// ========================================

export interface CmsSection {
  id: string;
  page_id: string;
  name: string;
  component_type: string;
  sort_order: number;
  content: Record<string, any>;
  settings: Record<string, any>;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateSectionInput {
  page_id: string;
  name: string;
  component_type: string;
  sort_order?: number;
  content?: Record<string, any>;
  settings?: Record<string, any>;
  is_visible?: boolean;
}

export interface UpdateSectionInput {
  name?: string;
  component_type?: string;
  sort_order?: number;
  content?: Record<string, any>;
  settings?: Record<string, any>;
  is_visible?: boolean;
}

// ========================================
// CMS COMPONENT
// ========================================

export interface CmsComponent {
  id: string;
  name: string;
  component_type: string;
  category: ComponentCategory;
  description?: string;
  preview_image?: string;
  default_props: Record<string, any>;
  variants: ComponentVariant[];
  is_active: boolean;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export interface ComponentVariant {
  name: string;
  label: string;
  [key: string]: any;
}

export interface CreateComponentInput {
  name: string;
  component_type: string;
  category: ComponentCategory;
  description?: string;
  preview_image?: string;
  default_props?: Record<string, any>;
  variants?: ComponentVariant[];
  is_active?: boolean;
}

export interface UpdateComponentInput {
  name?: string;
  component_type?: string;
  category?: ComponentCategory;
  description?: string;
  preview_image?: string;
  default_props?: Record<string, any>;
  variants?: ComponentVariant[];
  is_active?: boolean;
}

// ========================================
// CMS CONFIG
// ========================================

export interface CmsConfig {
  id: string;
  key: string;
  category: string;
  value: Record<string, any>;
  description?: string;
  locale?: Locale;
  created_at: string;
  updated_at: string;
  updated_by?: string;
}

export interface CreateConfigInput {
  key: string;
  category: string;
  value: Record<string, any>;
  description?: string;
  locale?: Locale;
}

export interface UpdateConfigInput {
  value?: Record<string, any>;
  description?: string;
  category?: string;
}

// ========================================
// CMS MEDIA
// ========================================

export interface CmsMedia {
  id: string;
  filename: string;
  original_filename: string;
  mime_type: string;
  file_size: number;
  storage_path: string;
  storage_bucket: string;
  public_url?: string;
  alt_text?: string;
  title?: string;
  description?: string;
  width?: number;
  height?: number;
  uploaded_by?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateMediaInput {
  filename: string;
  original_filename: string;
  mime_type: string;
  file_size: number;
  storage_path: string;
  storage_bucket?: string;
  public_url?: string;
  alt_text?: string;
  title?: string;
  description?: string;
  width?: number;
  height?: number;
}

export interface UpdateMediaInput {
  alt_text?: string;
  title?: string;
  description?: string;
}

// ========================================
// CMS HISTORY
// ========================================

export interface CmsHistory {
  id: string;
  entity_type: HistoryEntityType;
  entity_id: string;
  action: HistoryAction;
  changes: Record<string, any>;
  previous_data?: Record<string, any>;
  user_id?: string;
  created_at: string;
}

export interface CreateHistoryInput {
  entity_type: HistoryEntityType;
  entity_id: string;
  action: HistoryAction;
  changes: Record<string, any>;
  previous_data?: Record<string, any>;
}
