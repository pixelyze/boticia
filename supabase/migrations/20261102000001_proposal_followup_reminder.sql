-- Rappel de relance : deux jours après qu'une cliente a ouvert son devis
-- sans y répondre, Laëtitia reçoit un email pour lui écrire sur WhatsApp.
-- Cette date garantit un seul rappel par version de devis.

ALTER TABLE project_proposals
  ADD COLUMN IF NOT EXISTS followup_reminder_sent_at timestamptz;

COMMENT ON COLUMN project_proposals.followup_reminder_sent_at IS
  'Date du rappel de relance envoyé à Laëtitia. NULL = pas encore envoyé.';

-- Devis déjà ouverts avant cette fonctionnalité : pas de rappel en rafale
-- au premier passage du cron.
UPDATE project_proposals
SET followup_reminder_sent_at = now()
WHERE status = 'viewed' AND followup_reminder_sent_at IS NULL;
