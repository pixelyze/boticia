CREATE TABLE IF NOT EXISTS quote_activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quote_id UUID NOT NULL REFERENCES quote_requests(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_activity_log_quote_id ON quote_activity_log(quote_id);
CREATE INDEX idx_activity_log_created_at ON quote_activity_log(created_at);

ALTER TABLE quote_activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on quote_activity_log"
  ON quote_activity_log FOR ALL USING (true) WITH CHECK (true);
