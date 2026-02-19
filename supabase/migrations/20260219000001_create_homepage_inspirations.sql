-- ========================================
-- Homepage Inspiration Categories & Images
-- ========================================

-- Categories table
CREATE TABLE IF NOT EXISTS homepage_inspiration_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  cover_filename TEXT,
  cover_original_filename TEXT,
  cover_mime_type TEXT,
  cover_file_size INTEGER,
  cover_storage_path TEXT,
  cover_public_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  link TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Gallery images table
CREATE TABLE IF NOT EXISTS homepage_inspiration_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES homepage_inspiration_categories(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  caption TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_homepage_inspiration_images_category
  ON homepage_inspiration_images(category_id);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_homepage_inspirations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_homepage_inspiration_categories_updated
  BEFORE UPDATE ON homepage_inspiration_categories
  FOR EACH ROW EXECUTE FUNCTION update_homepage_inspirations_updated_at();

CREATE TRIGGER trg_homepage_inspiration_images_updated
  BEFORE UPDATE ON homepage_inspiration_images
  FOR EACH ROW EXECUTE FUNCTION update_homepage_inspirations_updated_at();

-- ========================================
-- Storage bucket
-- ========================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'homepage-inspirations',
  'homepage-inspirations',
  true,
  10485760,
  ARRAY['image/png', 'image/jpeg', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- ========================================
-- RLS
-- ========================================

ALTER TABLE homepage_inspiration_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_inspiration_images ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Public can read homepage categories"
  ON homepage_inspiration_categories FOR SELECT
  USING (true);

CREATE POLICY "Public can read homepage images"
  ON homepage_inspiration_images FOR SELECT
  USING (true);

-- Service role full access
CREATE POLICY "Service role full access on categories"
  ON homepage_inspiration_categories FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access on images"
  ON homepage_inspiration_images FOR ALL
  USING (auth.role() = 'service_role');

-- Storage policies
CREATE POLICY "Public read homepage-inspirations"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'homepage-inspirations');

CREATE POLICY "Service role upload homepage-inspirations"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'homepage-inspirations');

CREATE POLICY "Service role delete homepage-inspirations"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'homepage-inspirations');

-- ========================================
-- Seed: 6 default categories
-- ========================================

INSERT INTO homepage_inspiration_categories (slug, sort_order, is_published, link) VALUES
  ('story_1', 1, true, '/pricing'),
  ('story_2', 2, true, '/pricing'),
  ('story_3', 3, true, '/events'),
  ('story_4', 4, true, '/workshops'),
  ('story_5', 5, true, '/contact'),
  ('story_6', 6, true, '/pricing');
