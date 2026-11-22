-- Légende anglaise des photos (facultative). Les versions anglaise et
-- japonaise du site l'affichent ; si elle est vide, elles reprennent la
-- légende française. Même limite que la légende française : 200 caractères.

alter table public.gallery_images
  add column if not exists caption_en text
    check (caption_en is null or char_length(caption_en) <= 200);
