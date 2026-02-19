-- ========================================
-- Availability Management Schema
-- ========================================
-- Tables pour la gestion des créneaux de disponibilité

-- ========================================
-- TABLE: availability_rules
-- ========================================
-- Règles récurrentes (ex: lundi 10h-18h, créneaux de 2h)
CREATE TABLE IF NOT EXISTS availability_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time VARCHAR(5) NOT NULL, -- "HH:MM"
  end_time VARCHAR(5) NOT NULL,   -- "HH:MM"
  slot_duration INTEGER NOT NULL DEFAULT 120, -- minutes
  is_active BOOLEAN NOT NULL DEFAULT true,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_availability_rules_updated_at
  BEFORE UPDATE ON availability_rules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- TABLE: availability_exceptions
-- ========================================
-- Exceptions ponctuelles (bloquer un jour, ajouter un créneau)
CREATE TABLE IF NOT EXISTS availability_exceptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  exception_date DATE NOT NULL,
  exception_type TEXT NOT NULL CHECK (exception_type IN ('block', 'add')),
  start_time VARCHAR(5), -- NULL = journée entière (pour block)
  end_time VARCHAR(5),
  reason TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_availability_exceptions_date
  ON availability_exceptions(exception_date);

CREATE TRIGGER set_availability_exceptions_updated_at
  BEFORE UPDATE ON availability_exceptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- RLS Policies
-- ========================================
ALTER TABLE availability_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_exceptions ENABLE ROW LEVEL SECURITY;

-- Service role full access
CREATE POLICY "Service role full access on availability_rules"
  ON availability_rules FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access on availability_exceptions"
  ON availability_exceptions FOR ALL
  USING (true)
  WITH CHECK (true);

-- Public read access for slot display
CREATE POLICY "Public read availability_rules"
  ON availability_rules FOR SELECT
  USING (true);

CREATE POLICY "Public read availability_exceptions"
  ON availability_exceptions FOR SELECT
  USING (true);
