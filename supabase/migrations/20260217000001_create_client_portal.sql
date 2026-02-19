-- ========================================
-- Client Portal Schema
-- ========================================
-- Tables pour le portail client (couples)

-- ========================================
-- ALTER: quote_requests
-- ========================================
ALTER TABLE quote_requests
  ADD COLUMN portal_enabled BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN moodboard_note TEXT;

-- ========================================
-- TABLE: client_inspirations
-- ========================================
CREATE TABLE IF NOT EXISTS client_inspirations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Relation
  quote_id UUID NOT NULL REFERENCES quote_requests(id) ON DELETE CASCADE,

  -- Fichier
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,

  -- Meta
  caption TEXT,
  uploaded_by UUID REFERENCES auth.users(id),

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_client_inspirations_quote_id
  ON client_inspirations(quote_id);

CREATE TRIGGER set_client_inspirations_updated_at
  BEFORE UPDATE ON client_inspirations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- TABLE: project_moodboard_items
-- ========================================
CREATE TABLE IF NOT EXISTS project_moodboard_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Relation
  quote_id UUID NOT NULL REFERENCES quote_requests(id) ON DELETE CASCADE,

  -- Type
  item_type TEXT NOT NULL CHECK (item_type IN ('image', 'pdf', 'link')),

  -- Fichier (nullable pour les liens)
  filename TEXT,
  original_filename TEXT,
  mime_type TEXT,
  file_size INTEGER,
  storage_path TEXT,
  public_url TEXT,

  -- Lien externe (pour type 'link')
  external_url TEXT,

  -- Meta
  title TEXT,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  uploaded_by UUID REFERENCES auth.users(id),

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_project_moodboard_items_quote_id
  ON project_moodboard_items(quote_id);

CREATE TRIGGER set_project_moodboard_items_updated_at
  BEFORE UPDATE ON project_moodboard_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- TABLE: project_proposals
-- ========================================
CREATE TABLE IF NOT EXISTS project_proposals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Relation
  quote_id UUID NOT NULL REFERENCES quote_requests(id) ON DELETE CASCADE,

  -- Contenu
  title TEXT NOT NULL,
  description TEXT,
  total_amount_cents INTEGER,

  -- Fichier PDF
  filename TEXT,
  original_filename TEXT,
  mime_type TEXT,
  file_size INTEGER,
  storage_path TEXT,
  public_url TEXT,

  -- Statut
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'pending', 'viewed', 'accepted', 'revision_requested')),

  -- Reponse client
  viewed_at TIMESTAMPTZ,
  responded_at TIMESTAMPTZ,
  client_comment TEXT,

  -- Meta
  created_by UUID REFERENCES auth.users(id),

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_project_proposals_quote_id
  ON project_proposals(quote_id);

CREATE TRIGGER set_project_proposals_updated_at
  BEFORE UPDATE ON project_proposals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- RLS: client_inspirations
-- ========================================
ALTER TABLE client_inspirations ENABLE ROW LEVEL SECURITY;

-- Service role : acces complet
CREATE POLICY "Service role full access on client_inspirations"
  ON client_inspirations
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Client : SELECT ses propres fichiers (via email match)
CREATE POLICY "Client can select own inspirations"
  ON client_inspirations
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM quote_requests qr
      WHERE qr.id = client_inspirations.quote_id
        AND qr.portal_enabled = true
        AND qr.email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

-- Client : INSERT ses propres fichiers
CREATE POLICY "Client can insert own inspirations"
  ON client_inspirations
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM quote_requests qr
      WHERE qr.id = client_inspirations.quote_id
        AND qr.portal_enabled = true
        AND qr.email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

-- Client : DELETE ses propres fichiers
CREATE POLICY "Client can delete own inspirations"
  ON client_inspirations
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM quote_requests qr
      WHERE qr.id = client_inspirations.quote_id
        AND qr.portal_enabled = true
        AND qr.email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

-- ========================================
-- RLS: project_moodboard_items
-- ========================================
ALTER TABLE project_moodboard_items ENABLE ROW LEVEL SECURITY;

-- Service role : acces complet
CREATE POLICY "Service role full access on project_moodboard_items"
  ON project_moodboard_items
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Client : SELECT uniquement (lecture seule)
CREATE POLICY "Client can select moodboard items"
  ON project_moodboard_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM quote_requests qr
      WHERE qr.id = project_moodboard_items.quote_id
        AND qr.portal_enabled = true
        AND qr.email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

-- ========================================
-- RLS: project_proposals
-- ========================================
ALTER TABLE project_proposals ENABLE ROW LEVEL SECURITY;

-- Service role : acces complet
CREATE POLICY "Service role full access on project_proposals"
  ON project_proposals
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Client : SELECT
CREATE POLICY "Client can select proposals"
  ON project_proposals
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM quote_requests qr
      WHERE qr.id = project_proposals.quote_id
        AND qr.portal_enabled = true
        AND qr.email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

-- Client : UPDATE (pour accepter/demander revision)
CREATE POLICY "Client can update proposals"
  ON project_proposals
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM quote_requests qr
      WHERE qr.id = project_proposals.quote_id
        AND qr.portal_enabled = true
        AND qr.email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM quote_requests qr
      WHERE qr.id = project_proposals.quote_id
        AND qr.portal_enabled = true
        AND qr.email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

-- ========================================
-- STORAGE BUCKETS
-- ========================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('client-inspirations', 'client-inspirations', true, 10485760,
   ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/heic']),
  ('project-moodboard', 'project-moodboard', true, 20971520,
   ARRAY['image/png', 'image/jpeg', 'image/webp', 'application/pdf']),
  ('project-proposals', 'project-proposals', true, 20971520,
   ARRAY['application/pdf', 'image/png', 'image/jpeg'])
ON CONFLICT (id) DO NOTHING;

-- Storage policies: public read, service role write
CREATE POLICY "Public read client-inspirations"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'client-inspirations');

CREATE POLICY "Service role write client-inspirations"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'client-inspirations');

CREATE POLICY "Service role delete client-inspirations"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'client-inspirations');

CREATE POLICY "Public read project-moodboard"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'project-moodboard');

CREATE POLICY "Service role write project-moodboard"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'project-moodboard');

CREATE POLICY "Service role delete project-moodboard"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'project-moodboard');

CREATE POLICY "Public read project-proposals"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'project-proposals');

CREATE POLICY "Service role write project-proposals"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'project-proposals');

CREATE POLICY "Service role delete project-proposals"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'project-proposals');
