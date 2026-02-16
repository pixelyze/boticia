-- ========================================
-- Quote Requests Schema
-- ========================================
-- Table pour les demandes de devis mariage

-- ========================================
-- TABLE: quote_requests
-- ========================================
CREATE TABLE IF NOT EXISTS quote_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Coordonnées
  partner1_name TEXT NOT NULL,
  partner2_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,

  -- Mariage
  wedding_date DATE,
  venue TEXT,
  budget TEXT CHECK (budget IN ('lt_2500', 'lt_4000', 'lt_10000')),

  -- Prestations florales
  floral_needs TEXT[],

  -- Gestion admin
  status TEXT NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'contacted', 'quote_sent', 'signed', 'completed')),
  admin_notes TEXT,

  -- Métadonnées
  locale TEXT NOT NULL DEFAULT 'fr',

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_quote_requests_status ON quote_requests(status);
CREATE INDEX IF NOT EXISTS idx_quote_requests_created_at ON quote_requests(created_at);

-- Trigger updated_at
CREATE TRIGGER set_quote_requests_updated_at
  BEFORE UPDATE ON quote_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- RLS
-- ========================================
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;

-- Service role : accès complet
CREATE POLICY "Service role full access on quote_requests"
  ON quote_requests
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Anonymous : INSERT uniquement (soumission formulaire)
CREATE POLICY "Anonymous can insert quote_requests"
  ON quote_requests
  FOR INSERT
  TO anon
  WITH CHECK (true);
