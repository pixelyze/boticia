-- Add discovery call slot fields to quote_requests
ALTER TABLE quote_requests
  ADD COLUMN meeting_date DATE,
  ADD COLUMN meeting_time TEXT;
