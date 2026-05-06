# Feedbacks Laëtitia — Suivi des retours et corrections

## 1. Portail client non activé par défaut

**Problème** : Laëtitia oubliait d'activer l'espace client avant d'envoyer un devis. La cliente recevait l'email mais ne pouvait pas accéder à son espace (lien cassé).

**Solution** : Le portail client est désormais toujours actif. Le toggle d'activation a été retiré du dashboard. Toutes les clientes existantes ont retrouvé l'accès automatiquement.

**Fichiers modifiés** :
- `server/utils/client-portal.ts` — retrait du filtre `portal_enabled`
- `pages/dashboard/quotes/[id].vue` — retrait du composant PortalToggle

---

## 2. Numéros de téléphone internationaux bloqués

**Problème** : Les clientes américaines ne pouvaient pas remplir le formulaire de devis car le champ téléphone affichait par défaut l'indicatif français (+33). Elles ne pensaient pas à changer le pays.

**Solution** : Le formulaire détecte automatiquement le pays de la cliente via son fuseau horaire (Intl API). Une cliente aux US voit directement le drapeau US et +1. Un texte d'aide a été ajouté : "Indicatif détecté automatiquement. Cliquez sur le drapeau pour le modifier."

**Fichiers modifiés** :
- `pages/devis.vue` — détection timezone + texte d'aide
- `i18n/locales/fr.json`, `en.json`, `ja.json` — clé `phone_hint`

---

## 3. Upload d'images en prod (Vercel)

**Problème** : L'upload de photos (galeries, inspirations, moodboard) échouait en production. Les photos de smartphone (5-15 MB) dépassaient la limite body de 4,5 MB des serverless functions Vercel.

**Solution** : Compression client-side via `browser-image-compression` avant l'envoi. Les images > 3 MB sont compressées à max 2560px / qualité 85%. Le serveur re-compresse ensuite en WebP 1920px via Sharp.

**Fichiers modifiés** :
- `composables/useImageCompression.ts` — nouveau composable
- 9 sites d'upload mis à jour (galeries, inspirations, logos, moodboard, devis)

---

## 4. Coming-soon en production

**Problème** : Le middleware coming-soon redirigait tout le trafic en prod, le site n'était pas accessible.

**Solution** : Suppression du middleware `coming-soon.global.ts` et de la page `coming-soon.vue`.

---

## 5. Rebranding "Côte d'Azur" → "Provence"

**Problème** : Laëtitia a déménagé en Provence, toutes les mentions "Côte d'Azur" devaient être changées.

**Solution** : Remplacement systématique dans tous les titres de pages, textes i18n (fr/en/ja), et contenus. Les JSON-LD schema conservent "Provence-Alpes-Côte d'Azur" (nom officiel de la région administrative pour Google).

---

## 6. Hero homepage — Rebranding

**Problème** : Laëtitia voulait un hero plus épuré et international.

**Solution** :
- Titre H1 : "BOTICIA" (uppercase)
- Sous-titre : "Floral designer"
- Localisation : "Provence · Paris"
- Retrait de l'indicateur scroll (texte + barre)
- "BOTICIA" en uppercase sur tout le site (header, footer, page erreur) via CSS

---

## 7. Textes de contenu — Reformulations

**Demandes de Laëtitia** :
- Section événements : nouveau sous-titre reformulé
- Carte mariage : "votre univers" → "votre vision"
- Features : "Fleurs françaises" → "Fleurs de saison", circuit court à 60%, "approche raisonnée"
- Titre features : "Un design floral pensé pour vos événements"
- Page mariages : titre "Design floral mariage", intro reformulée avec "wedding designer floral"
- FAQ : haute saison "mai à septembre" → "mai à octobre"
- Tarifs : 800€ → 2 500€, 2000-5000€ → 3 500-8 000€

---

## 8. Footer — Restructuration

**Problème** : Le footer mélangeait "Qui suis-je", "FAQ" et "Mentions légales" sur la même ligne.

**Solution** :
- Nouveau layout : BOTICIA / Atelier de Design floral / Mariages · Event · Set Design
- "Qui suis-je" et "FAQ" restent en liens principaux
- "Mentions légales" reléguée dans la ligne copyright (discret, cliquable, souligné)

---

## 9. Mentions légales — Contenu réel

**Problème** : La page mentions légales contenait du Lorem ipsum.

**Solution** : 7 sections réelles (éditeur, hébergeur, propriété intellectuelle, RGPD, cookies, responsabilité, droit applicable) en 3 langues.

---

## 10. Galeries — Layout bento

**Problème** : Les galeries affichaient les images en grille uniforme, pas assez éditorial.

**Solution** : Layout bento avec alternance wide/portrait en zigzag (3 rangées). Overlay "+N" sur la dernière image pour indiquer les photos restantes. Appliqué sur homepage, mariages, événements et ateliers.

---

## 11. Galeries — Bento slots (choix des emplacements)

**Problème** : Laëtitia ne pouvait pas choisir quelles photos apparaissaient dans le layout bento ni à quel emplacement.

**Solution** : Colonne `bento_slot` (1-6) ajoutée sur les images. Dans le dashboard, un sélecteur numéroté apparaît sur chaque photo + un schéma visuel du layout. Assigner un numéro déjà pris libère l'ancienne image automatiquement.

**Migration SQL requise** : `ALTER TABLE gallery_images ADD COLUMN bento_slot INTEGER;`

---

## 12. Galerie événements — Dynamique

**Problème** : La galerie de la page événements utilisait des images statiques codées en dur. Laëtitia ne pouvait pas la modifier depuis le dashboard.

**Solution** : Branchement sur le système de galeries dynamiques (slug `events`). Placeholders avec les images existantes si la galerie n'existe pas encore en base.

**Migration SQL requise** : `INSERT INTO galleries (slug, title, description, is_published) VALUES ('events', 'Galerie Événements', '...', true);`

---

## 13. Page événements — Images superposées "Notre approche"

**Problème** : Laëtitia voulait 2 images en superposition sur le bloc "Notre approche" de la page événements, gérables depuis le dashboard.

**Solution** : 2 images carrées superposées (haut-gauche / bas-droite), modifiables depuis les Paramètres du dashboard (clés CMS `events_philosophy_image_1` et `events_philosophy_image_2`).

---

## 14. Page ateliers — Swap sections

**Problème** : Laëtitia voulait inverser l'ordre des blocs "Nos ateliers" (galerie) et "Pour qui", et échanger leurs backgrounds.

**Solution** : Galerie "Nos ateliers" placée au-dessus de "Pour qui". Backgrounds échangés (galerie en bg-white, Pour qui en bg-cream-light).

---

## 15. SEO — Indexation Google

**Problème** : 257 pages en 404, 78 redirections, 120 pages non indexées dans Google Search Console.

**Solutions** :
- Redirections 301 pour les pages supprimées (coming-soon) et les URLs sans locale
- robots.txt bloquant les zones privées (/dashboard, /admin, /mon-projet, /login, /api)
- JSON-LD enrichi (FAQPage, Service, BreadcrumbList, Florist)
- Sitemap avec hreflang
- Titre Google : "Boticia — Floral designer | Provence · Paris"

---

## 16. Supabase — Prévention pause free-tier

**Problème** : Risque que le projet Supabase se mette en pause après 7 jours d'inactivité.

**Solution** : Cron Vercel qui ping Supabase toutes les 6 heures (`/api/cron/keep-alive`).

---

## 17. Confusion fuseau horaire — Prise de RDV

**Problème** : Une cliente américaine a réservé un créneau en pensant que l'heure affichée était dans son fuseau local, alors que c'était l'heure de Paris.

**Solution** : Ajout de la mention "(heure de Paris)" à côté du créneau sélectionné dans le formulaire de devis, et "Les horaires sont en heure de Paris (CET)" dans le modal de prise de RDV au-dessus des créneaux.
