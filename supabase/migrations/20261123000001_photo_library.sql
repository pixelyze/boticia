-- ============================================================
-- Photothèque et emplacements (nov. 2026)
--
-- Avant : 5 galeries, chacune liée à une page, avec des cases
-- numérotées (bento_slot) et un remplissage automatique caché.
-- Après : une seule photothèque (gallery_images) et une table
-- d'emplacements (photo_placements) qui dit quelle photo va où.
--
-- La reprise fige ce que le site affiche aujourd'hui : rien ne
-- change sur le site le jour de la bascule.
-- ============================================================

-- 1. Type de photo (un seul) et photos hors galerie --------------------
alter table public.gallery_images
  add column if not exists photo_type text
  check (photo_type in ('mariage', 'entreprise', 'atelier'));

alter table public.gallery_images
  alter column gallery_id drop not null;

-- 2. Emplacements ------------------------------------------------------
--   grid        : grille (9 cases Accueil/Mariages/Entreprises, 3 Ateliers)
--   viewer      : photos en plus, visibles dans la visionneuse
--   opening     : grande photo d'ouverture de Créations
--   bouquets, ceremonie, reception, accessoires : chapitres de Créations
--   subscription : les 2 photos de la section « Abonnement floral »
--                  (page Entreprises), autrefois réglées dans Personnalisation
create table if not exists public.photo_placements (
  id uuid primary key default gen_random_uuid(),
  image_id uuid not null references public.gallery_images(id) on delete cascade,
  page text not null
    check (page in ('home', 'wedding', 'events', 'creations', 'workshops')),
  zone text not null
    check (zone in ('grid', 'viewer', 'opening', 'subscription',
                    'bouquets', 'ceremonie', 'reception', 'accessoires')),
  position integer not null check (position >= 0),
  created_at timestamptz not null default now(),
  unique (page, zone, position)
);

create index if not exists photo_placements_image_idx
  on public.photo_placements (image_id);

alter table public.photo_placements enable row level security;

drop policy if exists "Service role full access photo_placements"
  on public.photo_placements;
create policy "Service role full access photo_placements"
  on public.photo_placements
  for all using (auth.role() = 'service_role');

-- 3. Reprise de l'existant ---------------------------------------------
-- Ordre d'affichage d'une galerie : sort_order, puis date d'ajout.
-- Une même photo envoyée dans plusieurs galeries (même fichier
-- d'origine) devient une seule photo : la plus ancienne.
-- La colonne « category » n'existe qu'en local (essai abandonné) :
-- to_jsonb permet de la lire sans erreur si elle est absente.
create temporary table _imgs on commit drop as
select
  gi.id,
  g.slug,
  gi.bento_slot,
  to_jsonb(gi) ->> 'category' as category,
  row_number() over (
    partition by g.slug order by gi.sort_order, gi.created_at, gi.id
  ) as rn,
  first_value(gi.id) over (
    partition by gi.original_filename order by gi.created_at, gi.id
  ) as canon
from public.gallery_images gi
join public.galleries g on g.id = gi.gallery_id;

-- Type de photo, déduit de la galerie d'origine
update public.gallery_images gi
set photo_type = t.photo_type
from (
  select canon,
         (array_agg(
            case slug
              when 'wedding' then 'mariage'
              when 'creations' then 'mariage'
              when 'events' then 'entreprise'
              when 'workshops' then 'atelier'
            end
            order by case slug
              when 'creations' then 1 when 'wedding' then 2
              when 'events' then 3 when 'workshops' then 4 else 5 end
          ) filter (where slug <> 'portfolio'))[1] as photo_type
  from _imgs
  group by canon
) t
where gi.id = t.canon and t.photo_type is not null and gi.photo_type is null;

-- Grilles : cases choisies, puis cases vides complétées avec les photos
-- suivantes (comme le site) ; le reste va dans la visionneuse.
create temporary table _grid_pages on commit drop as
select * from (values
  ('portfolio', 'home', 9, true),
  ('wedding', 'wedding', 9, true),
  ('events', 'events', 9, true),
  ('workshops', 'workshops', 3, false)
) as v(slug, page, size, has_viewer);

create temporary table _slotted on commit drop as
select distinct on (i.slug, i.bento_slot)
  i.slug, i.id, i.canon, i.bento_slot - 1 as pos
from _imgs i
join _grid_pages p on p.slug = i.slug
where i.bento_slot between 1 and p.size
order by i.slug, i.bento_slot, i.rn;

create temporary table _empty on commit drop as
select p.slug, s.pos,
       row_number() over (partition by p.slug order by s.pos) as k
from _grid_pages p
cross join lateral generate_series(0, p.size - 1) as s(pos)
where not exists (
  select 1 from _slotted x where x.slug = p.slug and x.pos = s.pos
);

-- Photos restantes : une seule fois chacune par page (une photo envoyée
-- 2 fois dans la même galerie n'occupe qu'une case)
create temporary table _rest on commit drop as
select slug, canon, row_number() over (partition by slug order by rn) as k
from (
  select i.slug, i.canon, min(i.rn) as rn
  from _imgs i
  join _grid_pages p on p.slug = i.slug
  where not exists (
    select 1 from _slotted x where x.slug = i.slug and x.canon = i.canon
  )
  group by i.slug, i.canon
) d;

insert into public.photo_placements (image_id, page, zone, position)
select s.canon, p.page, 'grid', s.pos
from _slotted s join _grid_pages p on p.slug = s.slug
union all
select r.canon, p.page, 'grid', e.pos
from _empty e
join _rest r on r.slug = e.slug and r.k = e.k
join _grid_pages p on p.slug = e.slug
union all
select r.canon, p.page, 'viewer',
       (r.k - (select count(*) from _empty e2 where e2.slug = r.slug) - 1)::int
from _rest r
join _grid_pages p on p.slug = r.slug and p.has_viewer
where r.k > (select count(*) from _empty e2 where e2.slug = r.slug)
on conflict do nothing;

-- Créations : ouverture (choisie, sinon la première photo) et chapitres
insert into public.photo_placements (image_id, page, zone, position)
select canon, 'creations', 'opening', 0
from _imgs
where slug = 'creations'
order by (category = 'ouverture') desc nulls last, rn
limit 1
on conflict do nothing;

insert into public.photo_placements (image_id, page, zone, position)
select canon, 'creations', category, (k - 1)::int
from (
  select canon, category,
         row_number() over (partition by category order by min(rn)) as k
  from _imgs
  where slug = 'creations'
    and category in ('bouquets', 'ceremonie', 'reception', 'accessoires')
  group by canon, category
) c
where k <= 2
on conflict do nothing;

-- Doublons : les copies d'une même photo disparaissent de la photothèque
-- (leurs emplacements pointent déjà vers la photo gardée). Les fichiers
-- restent dans le stockage.
delete from public.gallery_images gi
using _imgs i
where i.id = gi.id and i.canon <> gi.id;

-- Abonnement floral (page Entreprises) : les 2 photos réglées jusqu'ici
-- dans Personnalisation (cms_config) entrent dans la photothèque, type
-- « Entreprise ». Une photo déjà présente (même adresse) est réutilisée.
-- Leurs fichiers restent où ils sont (souvent dans le bucket « logos »).
create temporary table _sub on commit drop as
select value ->> 'url' as url,
       case key when 'events_philosophy_image_1' then 0 else 1 end as pos,
       key
from public.cms_config
where key in ('events_philosophy_image_1', 'events_philosophy_image_2')
  and coalesce(value ->> 'url', '') <> '';

insert into public.gallery_images
  (gallery_id, photo_type, filename, original_filename, mime_type,
   file_size, storage_path, public_url)
select distinct on (s.url)
  null, 'entreprise',
  regexp_replace(s.url, '^.*/', ''),
  regexp_replace(s.url, '^.*/', ''),
  case
    when s.url ilike '%.png' then 'image/png'
    when s.url ilike '%.jp%g' then 'image/jpeg'
    else 'image/webp'
  end,
  0,
  regexp_replace(s.url, '^.*/object/public/[^/]+/', ''),
  s.url
from _sub s
where not exists (
  select 1 from public.gallery_images gi where gi.public_url = s.url
);

insert into public.photo_placements (image_id, page, zone, position)
select (select gi.id from public.gallery_images gi
        where gi.public_url = s.url order by gi.created_at limit 1),
       'events', 'subscription', s.pos
from _sub s
on conflict do nothing;

-- 4. Nettoyage de l'essai local abandonné ------------------------------
alter table public.gallery_images drop column if exists category;
