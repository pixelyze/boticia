-- Add service_type column to quote_requests
-- Supports: mariage, evenement, atelier
ALTER TABLE quote_requests
  ADD COLUMN IF NOT EXISTS service_type TEXT NOT NULL DEFAULT 'mariage'
  CHECK (service_type IN ('mariage', 'evenement', 'atelier'));

-- Add event-specific fields
ALTER TABLE quote_requests
  ADD COLUMN IF NOT EXISTS event_type TEXT,
  ADD COLUMN IF NOT EXISTS guest_count INTEGER,
  ADD COLUMN IF NOT EXISTS workshop_type TEXT;
