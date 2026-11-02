-- Avis affichés sur la page d'accueil, gérés par Laëtitia depuis son
-- tableau de bord (page « Avis »). Deux langues : français (obligatoire) et
-- anglais (facultatif). Le site anglais retombe sur le français si
-- l'anglais est vide ; le site japonais affiche l'anglais.

CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Texte de l'avis
  text_fr TEXT NOT NULL CHECK (length(trim(text_fr)) > 0),
  text_en TEXT,

  -- Signature : « Sophie M. » et la ligne dessous (« Mariage en Provence »)
  author_name TEXT NOT NULL CHECK (length(trim(author_name)) > 0),
  context_fr TEXT,
  context_en TEXT,

  -- Affichage
  is_published BOOLEAN NOT NULL DEFAULT true,
  position INTEGER NOT NULL DEFAULT 0,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_testimonials_position
  ON testimonials(position);

DROP TRIGGER IF EXISTS set_testimonials_updated_at ON testimonials;
CREATE TRIGGER set_testimonials_updated_at
  BEFORE UPDATE ON testimonials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Lecture et écriture uniquement par le serveur (clé service) :
-- RLS activée, aucune politique publique.
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Reprise des 5 avis qui étaient écrits dans les fichiers de traduction.
INSERT INTO testimonials
  (text_fr, text_en, author_name, context_fr, context_en, is_published, position)
SELECT * FROM (VALUES
  ('Laëtitia a su capturer exactement l''univers que j''imaginais pour mon mariage. Les compositions florales étaient d''une beauté rare, élégantes et poétiques.', 'Laëtitia perfectly captured the universe I envisioned for my wedding. The floral arrangements were strikingly beautiful — elegant and poetic.', 'Sophie M.', 'Mariage en Provence', 'Wedding in Provence', true, 1),
  ('Un travail exceptionnel pour notre événement d''entreprise. Les créations florales ont transformé l''espace en quelque chose de vraiment magique.', 'Exceptional work for our corporate event. The floral creations truly transformed the space into something magical.', 'Marie-Claire D.', 'Paris', 'Paris', true, 2),
  ('J''ai participé à un atelier de Laëtitia et j''en suis ressortie avec bien plus qu''un bouquet — une vraie passion pour le design floral.', 'I attended one of Laëtitia''s workshops and left with far more than a bouquet — a genuine passion for floral design.', 'Camille R.', 'Aix-en-Provence', 'Aix-en-Provence', true, 3),
  ('Des fleurs qui racontent une histoire. Laëtitia a une sensibilité artistique unique, chaque composition est une œuvre en soi.', 'Flowers that tell a story. Laëtitia has a unique artistic sensibility; every arrangement is a work of art in itself.', 'Isabelle T.', 'Mariage au Château', 'Château Wedding', true, 4),
  ('Professionnalisme, écoute et créativité. Tout ce qu''on espère trouver chez un fleuriste de mariage. Je recommande sans hésitation.', 'Professionalism, attentiveness, and creativity — everything you hope to find in a wedding florist. Highly recommended.', 'Aurélie B.', 'Côte d''Azur', 'Côte d''Azur', true, 5)
) AS v(text_fr, text_en, author_name, context_fr, context_en, is_published, position)
WHERE NOT EXISTS (SELECT 1 FROM testimonials);
