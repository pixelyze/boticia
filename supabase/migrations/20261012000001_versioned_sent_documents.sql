-- Devis et moodboard envoyés : figés et versionnés.
--
-- Un document en préparation (sent_at NULL) se modifie et se supprime
-- librement. Une fois envoyé, il ne bouge plus : un changement passe par
-- une nouvelle version, et l'ancienne reste dans l'historique de la fiche.

ALTER TABLE project_proposals
  ADD COLUMN IF NOT EXISTS sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS version integer,
  ADD COLUMN IF NOT EXISTS superseded_at timestamptz;

COMMENT ON COLUMN project_proposals.sent_at IS
  'Date d''envoi à la cliente. NULL = devis en préparation (brouillon).';
COMMENT ON COLUMN project_proposals.version IS
  'Numéro de version (1, 2…), attribué à l''envoi.';
COMMENT ON COLUMN project_proposals.superseded_at IS
  'Date à laquelle une version suivante a été envoyée. NULL = version en cours.';

ALTER TABLE project_moodboard_items
  ADD COLUMN IF NOT EXISTS sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS version integer;

COMMENT ON COLUMN project_moodboard_items.sent_at IS
  'Date d''envoi de la version dont fait partie l''élément. NULL = en préparation.';
COMMENT ON COLUMN project_moodboard_items.version IS
  'Version du moodboard (1, 2…) dont fait partie l''élément.';

-- ── Reprise des devis existants ─────────────────────────────────────────
-- Envoyé = la cliente l'a vu ou y a répondu, ou la demande est passée en
-- "Devis envoyé" (ou au-delà). Date d'envoi : premier passage en
-- "quote_sent" journalisé après le dépôt, à défaut la date de dépôt.
UPDATE project_proposals p
SET sent_at = COALESCE(
  (
    SELECT min(l.created_at)
    FROM quote_activity_log l
    WHERE l.quote_id = p.quote_id
      AND l.action = 'status_changed'
      AND l.details->>'to' = 'quote_sent'
      AND l.created_at >= p.created_at
  ),
  p.created_at
)
FROM quote_requests q
WHERE q.id = p.quote_id
  AND p.sent_at IS NULL
  AND (
    p.status IN ('viewed', 'accepted', 'revision_requested')
    OR (
      p.status = 'pending'
      AND q.status IN ('quote_sent', 'signed', 'completed')
    )
  );

-- Déposé mais jamais envoyé : redevient un brouillon (la cliente le
-- voyait pourtant déjà, faute de distinction avant cette migration).
UPDATE project_proposals
SET status = 'draft'
WHERE sent_at IS NULL AND status = 'pending';

UPDATE project_proposals p
SET version = v.n
FROM (
  SELECT id,
    row_number() OVER (
      PARTITION BY quote_id ORDER BY sent_at, created_at
    ) AS n
  FROM project_proposals
  WHERE sent_at IS NOT NULL
) v
WHERE p.id = v.id;

UPDATE project_proposals p
SET superseded_at = nxt.next_sent_at
FROM (
  SELECT id,
    lead(sent_at) OVER (PARTITION BY quote_id ORDER BY version) AS next_sent_at
  FROM project_proposals
  WHERE sent_at IS NOT NULL
) nxt
WHERE p.id = nxt.id AND nxt.next_sent_at IS NOT NULL;

-- ── Reprise des moodboards existants ────────────────────────────────────
-- Un moodboard déjà envoyé devient la version 1.
UPDATE project_moodboard_items m
SET sent_at = q.moodboard_sent_at,
    version = 1
FROM quote_requests q
WHERE q.id = m.quote_id
  AND q.moodboard_sent_at IS NOT NULL
  AND m.sent_at IS NULL
  AND m.created_at <= q.moodboard_sent_at;
