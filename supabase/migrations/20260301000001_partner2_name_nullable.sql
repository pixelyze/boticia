-- partner2_name retiré du formulaire de devis : rendre nullable
ALTER TABLE quote_requests ALTER COLUMN partner2_name DROP NOT NULL;
ALTER TABLE quote_requests ALTER COLUMN partner2_name SET DEFAULT NULL;

-- phone désormais obligatoire
UPDATE quote_requests SET phone = '' WHERE phone IS NULL;
ALTER TABLE quote_requests ALTER COLUMN phone SET NOT NULL;
