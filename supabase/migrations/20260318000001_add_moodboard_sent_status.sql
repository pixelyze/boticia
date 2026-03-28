-- Add 'moodboard_sent' to quote_requests status check constraint
ALTER TABLE quote_requests DROP CONSTRAINT IF EXISTS quote_requests_status_check;
ALTER TABLE quote_requests ADD CONSTRAINT quote_requests_status_check
  CHECK (status IN ('new', 'contacted', 'moodboard_sent', 'quote_sent', 'signed', 'completed', 'cancelled'));
