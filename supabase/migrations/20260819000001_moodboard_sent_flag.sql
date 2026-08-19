-- Le moodboard cesse d'être une étape du pipeline pour devenir un fait
-- attaché au dossier : une demande reste "contacted" et porte la date à
-- laquelle le moodboard a été envoyé.
--
-- Étape 1/2 — purement additive, sans risque pour le code en place.
-- La contrainte CHECK est resserrée dans une seconde migration, une fois
-- que plus aucun code n'écrit le statut "moodboard_sent".

ALTER TABLE quote_requests
  ADD COLUMN IF NOT EXISTS moodboard_sent_at timestamptz;

COMMENT ON COLUMN quote_requests.moodboard_sent_at IS
  'Date d''envoi du moodboard. NULL = pas encore envoyé.';

-- Les dossiers déjà passés par cette étape redeviennent "contacted" en
-- conservant une date d'envoi : updated_at est la meilleure approximation
-- disponible, le passage au statut ayant été la dernière modification.
UPDATE quote_requests
SET moodboard_sent_at = updated_at,
    status = 'contacted'
WHERE status = 'moodboard_sent';
