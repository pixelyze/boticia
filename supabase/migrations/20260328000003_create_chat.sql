-- Chat messages between admin (Laëtitia) and dev team (Brutal Studio)
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_type TEXT NOT NULL CHECK (sender_type IN ('admin', 'dev')),
  sender_name TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_chat_messages_created ON chat_messages(created_at DESC);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access chat"
  ON chat_messages FOR ALL
  USING (auth.role() = 'service_role');
