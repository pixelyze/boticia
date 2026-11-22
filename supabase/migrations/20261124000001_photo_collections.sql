-- Collections de la photothèque : un nom libre qui regroupe les photos
-- d'un même événement (« Mariage Château de la Gaude, juin 2026 »).
-- Une photo est dans une seule collection, ou dans aucune (NULL).
-- Renommer ou supprimer une collection = mettre à jour ce champ sur
-- toutes ses photos : les photos ne sont jamais supprimées.

alter table gallery_images
  add column if not exists collection text
    check (collection is null or char_length(collection) between 1 and 80);

create index if not exists gallery_images_collection_idx
  on gallery_images (collection)
  where collection is not null;
