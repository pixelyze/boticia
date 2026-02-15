/**
 * Types pour l'éditeur de blocs CMS
 */

export type BlockType =
  | "hero"
  | "text"
  | "image"
  | "cta"
  | "features"
  | "columns"
  | "quote"
  | "gallery"
  | "video"
  | "spacer";

export interface BlockSettings {
  visible: boolean;
  className?: string;
  animation?: string;
  backgroundColor?: string;
  padding?: "none" | "small" | "medium" | "large";
  margin?: "none" | "small" | "medium" | "large";
}

// Contenu spécifique par type de bloc
export interface HeroContent {
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  ctaText?: string;
  ctaLink?: string;
  alignment?: "left" | "center" | "right";
}

export interface TextContent {
  html: string;
  alignment?: "left" | "center" | "right" | "justify";
}

export interface ImageContent {
  url: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  alignment?: "left" | "center" | "right";
}

export interface CTAContent {
  title: string;
  description?: string;
  buttonText: string;
  buttonLink: string;
  variant?: "primary" | "secondary" | "ghost";
}

export interface FeatureItem {
  icon?: string;
  title: string;
  description: string;
}

export interface FeaturesContent {
  title?: string;
  subtitle?: string;
  features: FeatureItem[];
  columns?: 2 | 3 | 4;
}

export interface ColumnContent {
  columns: {
    width?: number;
    content: Block[];
  }[];
}

export interface QuoteContent {
  quote: string;
  author?: string;
  role?: string;
}

export interface GalleryContent {
  images: {
    url: string;
    alt: string;
    caption?: string;
  }[];
  layout?: "grid" | "masonry" | "carousel";
}

export interface VideoContent {
  url: string;
  provider?: "youtube" | "vimeo" | "upload";
  thumbnail?: string;
  caption?: string;
}

export interface SpacerContent {
  height: number;
}

// Union type pour tous les contenus possibles
export type BlockContent =
  | HeroContent
  | TextContent
  | ImageContent
  | CTAContent
  | FeaturesContent
  | ColumnContent
  | QuoteContent
  | GalleryContent
  | VideoContent
  | SpacerContent;

// Interface principale d'un bloc
export interface Block {
  id: string;
  type: BlockType;
  name: string;
  content: BlockContent;
  settings: BlockSettings;
  order: number;
}

// Template de bloc pour la bibliothèque
export interface BlockTemplate {
  type: BlockType;
  name: string;
  description: string;
  icon: string;
  category: "content" | "media" | "layout" | "marketing";
  defaultContent: BlockContent;
  defaultSettings: BlockSettings;
}

// État de l'éditeur
export interface EditorState {
  blocks: Block[];
  selectedBlockId: string | null;
  isDragging: boolean;
  hasUnsavedChanges: boolean;
}
