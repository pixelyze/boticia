-- Mot de Laëtitia pour le moodboard en préparation.
-- moodboard_note reste le mot de la version envoyée (vu par la cliente) :
-- à l'envoi, le brouillon y est copié puis vidé.
ALTER TABLE quote_requests
  ADD COLUMN IF NOT EXISTS moodboard_draft_note text;
