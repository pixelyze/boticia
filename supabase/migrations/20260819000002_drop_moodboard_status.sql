-- Étape 2/2 — à n'appliquer qu'APRÈS le déploiement du code qui n'écrit
-- plus le statut "moodboard_sent".
--
-- Resserrer cette contrainte avant le déploiement ferait échouer chaque
-- envoi de moodboard depuis la version en production.

ALTER TABLE quote_requests
  DROP CONSTRAINT IF EXISTS quote_requests_status_check;

ALTER TABLE quote_requests
  ADD CONSTRAINT quote_requests_status_check
  CHECK (
    status IN (
      'new',
      'contacted',
      'quote_sent',
      'signed',
      'completed',
      'cancelled'
    )
  );
