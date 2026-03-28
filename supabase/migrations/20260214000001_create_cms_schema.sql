-- ========================================
-- Boticia CMS Schema
-- ========================================
-- Architecture flexible pour gérer pages, sections et composants
-- Utilise JSONB pour maximum de flexibilité

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- TABLE: cms_pages
-- ========================================
-- Gère les pages du site (homepage, about, etc.)
CREATE TABLE IF NOT EXISTS cms_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identification
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,

  -- Métadonnées
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT[],
  og_image TEXT,

  -- État
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMPTZ,

  -- Configuration
  layout TEXT NOT NULL DEFAULT 'default',
  locale TEXT NOT NULL DEFAULT 'fr',

  -- SEO
  canonical_url TEXT,
  robots TEXT DEFAULT 'index,follow',

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Indexes
CREATE INDEX idx_cms_pages_slug ON cms_pages(slug);
CREATE INDEX idx_cms_pages_status ON cms_pages(status);
CREATE INDEX idx_cms_pages_locale ON cms_pages(locale);
CREATE INDEX idx_cms_pages_published_at ON cms_pages(published_at);

-- ========================================
-- TABLE: cms_sections
-- ========================================
-- Sections de contenu dans les pages (Hero, Features, Pricing, etc.)
CREATE TABLE IF NOT EXISTS cms_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relations
  page_id UUID NOT NULL REFERENCES cms_pages(id) ON DELETE CASCADE,

  -- Identification
  name TEXT NOT NULL,
  component_type TEXT NOT NULL, -- 'HeroSection', 'FeaturesSection', etc.

  -- Ordre d'affichage
  sort_order INTEGER NOT NULL DEFAULT 0,

  -- Configuration & Contenu (JSONB pour flexibilité)
  content JSONB NOT NULL DEFAULT '{}',
  settings JSONB NOT NULL DEFAULT '{}',

  -- État
  is_visible BOOLEAN NOT NULL DEFAULT true,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_cms_sections_page_id ON cms_sections(page_id);
CREATE INDEX idx_cms_sections_sort_order ON cms_sections(sort_order);
CREATE INDEX idx_cms_sections_component_type ON cms_sections(component_type);
CREATE INDEX idx_cms_sections_content_gin ON cms_sections USING GIN (content);

-- ========================================
-- TABLE: cms_components
-- ========================================
-- Composants réutilisables (boutons, cartes, etc.)
CREATE TABLE IF NOT EXISTS cms_components (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identification
  name TEXT NOT NULL UNIQUE,
  component_type TEXT NOT NULL, -- 'Button', 'Card', 'FeatureCard', etc.
  category TEXT NOT NULL DEFAULT 'general', -- 'ui', 'landing', 'form', etc.

  -- Description
  description TEXT,
  preview_image TEXT,

  -- Configuration par défaut (JSONB)
  default_props JSONB NOT NULL DEFAULT '{}',

  -- Variantes disponibles
  variants JSONB NOT NULL DEFAULT '[]',

  -- Métadonnées
  is_active BOOLEAN NOT NULL DEFAULT true,
  usage_count INTEGER NOT NULL DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_cms_components_name ON cms_components(name);
CREATE INDEX idx_cms_components_type ON cms_components(component_type);
CREATE INDEX idx_cms_components_category ON cms_components(category);

-- ========================================
-- TABLE: cms_config
-- ========================================
-- Configuration globale du site (footer, navbar, etc.)
CREATE TABLE IF NOT EXISTS cms_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identification
  key TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL DEFAULT 'general', -- 'navigation', 'footer', 'seo', etc.

  -- Valeur (JSONB pour flexibilité)
  value JSONB NOT NULL DEFAULT '{}',

  -- Description
  description TEXT,

  -- Locale
  locale TEXT DEFAULT 'fr',

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Indexes
CREATE INDEX idx_cms_config_key ON cms_config(key);
CREATE INDEX idx_cms_config_category ON cms_config(category);
CREATE INDEX idx_cms_config_locale ON cms_config(locale);

-- ========================================
-- TABLE: cms_media
-- ========================================
-- Gestion des médias (images, vidéos, etc.)
CREATE TABLE IF NOT EXISTS cms_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Fichier
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,

  -- Stockage
  storage_path TEXT NOT NULL,
  storage_bucket TEXT NOT NULL DEFAULT 'cms-media',
  public_url TEXT,

  -- Métadonnées
  alt_text TEXT,
  title TEXT,
  description TEXT,

  -- Dimensions (si image)
  width INTEGER,
  height INTEGER,

  -- Relations
  uploaded_by UUID REFERENCES auth.users(id),

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_cms_media_filename ON cms_media(filename);
CREATE INDEX idx_cms_media_mime_type ON cms_media(mime_type);
CREATE INDEX idx_cms_media_uploaded_by ON cms_media(uploaded_by);

-- ========================================
-- TABLE: cms_history
-- ========================================
-- Historique des modifications pour audit
CREATE TABLE IF NOT EXISTS cms_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Référence
  entity_type TEXT NOT NULL, -- 'page', 'section', 'component', 'config'
  entity_id UUID NOT NULL,

  -- Action
  action TEXT NOT NULL CHECK (action IN ('create', 'update', 'delete', 'publish', 'unpublish')),

  -- Données
  changes JSONB NOT NULL DEFAULT '{}',
  previous_data JSONB,

  -- Auteur
  user_id UUID REFERENCES auth.users(id),

  -- Timestamp
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_cms_history_entity ON cms_history(entity_type, entity_id);
CREATE INDEX idx_cms_history_user ON cms_history(user_id);
CREATE INDEX idx_cms_history_created_at ON cms_history(created_at);

-- ========================================
-- TRIGGERS: Updated At
-- ========================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cms_pages_updated_at
  BEFORE UPDATE ON cms_pages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER cms_sections_updated_at
  BEFORE UPDATE ON cms_sections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER cms_components_updated_at
  BEFORE UPDATE ON cms_components
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER cms_config_updated_at
  BEFORE UPDATE ON cms_config
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER cms_media_updated_at
  BEFORE UPDATE ON cms_media
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- ROW LEVEL SECURITY (RLS)
-- ========================================

-- Enable RLS
ALTER TABLE cms_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_history ENABLE ROW LEVEL SECURITY;

-- Policies: Public can read published content
CREATE POLICY "Public can view published pages"
  ON cms_pages FOR SELECT
  USING (status = 'published');

CREATE POLICY "Public can view visible sections of published pages"
  ON cms_sections FOR SELECT
  USING (
    is_visible = true
    AND EXISTS (
      SELECT 1 FROM cms_pages
      WHERE cms_pages.id = cms_sections.page_id
      AND cms_pages.status = 'published'
    )
  );

CREATE POLICY "Public can view active components"
  ON cms_components FOR SELECT
  USING (is_active = true);

CREATE POLICY "Public can view config"
  ON cms_config FOR SELECT
  USING (true);

CREATE POLICY "Public can view media"
  ON cms_media FOR SELECT
  USING (true);

-- Policies: Authenticated users can manage content
-- (TODO: Ajouter des rôles admin pour plus de contrôle)

CREATE POLICY "Authenticated users can insert pages"
  ON cms_pages FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update pages"
  ON cms_pages FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete pages"
  ON cms_pages FOR DELETE
  TO authenticated
  USING (true);

-- Similar policies for sections, components, config, media
CREATE POLICY "Authenticated users can manage sections"
  ON cms_sections FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage components"
  ON cms_components FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage config"
  ON cms_config FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage media"
  ON cms_media FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can view history"
  ON cms_history FOR SELECT
  TO authenticated
  USING (true);

-- ========================================
-- COMMENTS
-- ========================================

COMMENT ON TABLE cms_pages IS 'Pages du site avec métadonnées SEO';
COMMENT ON TABLE cms_sections IS 'Sections de contenu dans les pages (Hero, Features, etc.)';
COMMENT ON TABLE cms_components IS 'Composants réutilisables du design system';
COMMENT ON TABLE cms_config IS 'Configuration globale du site';
COMMENT ON TABLE cms_media IS 'Bibliothèque de médias (images, vidéos, etc.)';
COMMENT ON TABLE cms_history IS 'Historique des modifications pour audit';

COMMENT ON COLUMN cms_sections.content IS 'Contenu de la section en JSONB (titre, texte, images, etc.)';
COMMENT ON COLUMN cms_sections.settings IS 'Configuration de la section (couleurs, layout, etc.)';
COMMENT ON COLUMN cms_components.default_props IS 'Props par défaut du composant';
COMMENT ON COLUMN cms_components.variants IS 'Variantes disponibles (primary, secondary, etc.)';
