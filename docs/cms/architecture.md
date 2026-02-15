# Architecture CMS Boticia

Documentation de l'architecture du CMS avec Supabase.

## 📐 Vue d'ensemble

Le CMS Boticia utilise une architecture flexible basée sur :
- **PostgreSQL** (Supabase) pour le stockage
- **JSONB** pour la flexibilité du contenu
- **Row Level Security** pour la sécurité
- **Composants réutilisables** pour la cohérence

## 🗄️ Schéma de Base de Données

### Tables Principales

#### 1. `cms_pages`
Gère les pages du site (homepage, about, pricing, etc.)

**Champs clés** :
- `slug` : URL de la page (`/`, `/about`, `/pricing`)
- `title` : Titre de la page
- `status` : `draft` | `published` | `archived`
- `layout` : Template de page (`default`, `landing`, `dashboard`)
- `locale` : Langue (`fr`, `en`, `ja`)

**Métadonnées SEO** :
- `meta_title`, `meta_description`, `meta_keywords`
- `og_image`, `canonical_url`, `robots`

**Exemple** :
```json
{
  "id": "uuid-1",
  "slug": "/",
  "title": "Accueil - Boticia",
  "status": "published",
  "layout": "landing",
  "locale": "fr",
  "meta_title": "Boticia - Votre assistant intelligent",
  "meta_description": "Automatisez vos tâches avec Boticia"
}
```

---

#### 2. `cms_sections`
Sections de contenu dans les pages (Hero, Features, Pricing, etc.)

**Champs clés** :
- `page_id` : Référence à la page parente
- `component_type` : Type de composant (`HeroSection`, `FeaturesSection`)
- `sort_order` : Ordre d'affichage (0, 1, 2...)
- `content` : Contenu en JSONB (titre, texte, images, etc.)
- `settings` : Configuration (couleurs, layout, etc.)
- `is_visible` : Visible ou masqué

**Exemple - Hero Section** :
```json
{
  "id": "uuid-2",
  "page_id": "uuid-1",
  "component_type": "HeroSection",
  "sort_order": 0,
  "content": {
    "title": "Automatisez vos tâches quotidiennes",
    "subtitle": "Gagnez du temps avec Boticia",
    "logo": "/logo-boticia.png"
  },
  "settings": {
    "background": "cream",
    "alignment": "center"
  },
  "is_visible": true
}
```

**Exemple - Features Section** :
```json
{
  "id": "uuid-3",
  "page_id": "uuid-1",
  "component_type": "FeaturesSection",
  "sort_order": 1,
  "content": {
    "title": "Fonctionnalités",
    "features": [
      {
        "icon": "Zap",
        "title": "Rapide",
        "description": "Automatisation en temps réel"
      },
      {
        "icon": "Shield",
        "title": "Sécurisé",
        "description": "Vos données sont protégées"
      }
    ]
  },
  "settings": {
    "columns": 3,
    "showIcons": true
  }
}
```

---

#### 3. `cms_components`
Composants réutilisables du design system

**Champs clés** :
- `name` : Identifiant unique (`primary-cta`, `feature-card`)
- `component_type` : Type de composant (`Button`, `Card`)
- `category` : Catégorie (`ui`, `landing`, `form`)
- `default_props` : Props par défaut en JSONB
- `variants` : Variantes disponibles

**Exemple - Bouton CTA** :
```json
{
  "name": "primary-cta",
  "component_type": "Button",
  "category": "ui",
  "default_props": {
    "variant": "primary",
    "icon": "ArrowRight"
  },
  "variants": [
    { "name": "default", "label": "Par défaut" },
    { "name": "with-icon", "label": "Avec icône", "icon": "Check" },
    { "name": "loading", "label": "Chargement", "loading": true }
  ]
}
```

---

#### 4. `cms_config`
Configuration globale du site (footer, navbar, SEO, etc.)

**Champs clés** :
- `key` : Clé unique (`site.navigation`, `footer.links`)
- `category` : Catégorie (`navigation`, `footer`, `seo`)
- `value` : Valeur en JSONB
- `locale` : Langue

**Exemple - Navigation** :
```json
{
  "key": "site.navigation",
  "category": "navigation",
  "locale": "fr",
  "value": {
    "items": [
      { "label": "Accueil", "href": "/" },
      { "label": "Fonctionnalités", "href": "#features" },
      { "label": "Tarifs", "href": "#pricing" }
    ]
  }
}
```

**Exemple - Footer** :
```json
{
  "key": "footer.links",
  "category": "footer",
  "locale": "fr",
  "value": {
    "columns": [
      {
        "title": "Produit",
        "links": [
          { "label": "Fonctionnalités", "href": "#features" },
          { "label": "Tarifs", "href": "#pricing" }
        ]
      },
      {
        "title": "Légal",
        "links": [
          { "label": "Mentions légales", "href": "/legal" },
          { "label": "CGU", "href": "/terms" }
        ]
      }
    ]
  }
}
```

---

#### 5. `cms_media`
Bibliothèque de médias (images, vidéos, documents)

**Champs clés** :
- `filename` : Nom du fichier
- `storage_path` : Chemin dans Supabase Storage
- `public_url` : URL publique
- `alt_text`, `title`, `description` : Métadonnées
- `width`, `height` : Dimensions (si image)

**Exemple** :
```json
{
  "filename": "hero-image.jpg",
  "storage_path": "cms-media/2026/02/hero-image.jpg",
  "public_url": "https://xxx.supabase.co/storage/v1/object/public/cms-media/2026/02/hero-image.jpg",
  "alt_text": "Image hero de la homepage",
  "width": 1920,
  "height": 1080
}
```

---

#### 6. `cms_history`
Historique des modifications pour audit

**Champs clés** :
- `entity_type` : Type d'entité (`page`, `section`, `component`)
- `entity_id` : ID de l'entité
- `action` : Action (`create`, `update`, `delete`, `publish`)
- `changes` : Modifications en JSONB
- `previous_data` : Données avant modification
- `user_id` : Auteur de la modification

**Exemple** :
```json
{
  "entity_type": "page",
  "entity_id": "uuid-1",
  "action": "update",
  "changes": {
    "status": { "from": "draft", "to": "published" }
  },
  "user_id": "uuid-user",
  "created_at": "2026-02-14T10:00:00Z"
}
```

---

## 🔒 Sécurité (RLS)

### Politiques Publiques
- ✅ Lecture des pages `published`
- ✅ Lecture des sections visibles des pages publiées
- ✅ Lecture des composants actifs
- ✅ Lecture de la configuration
- ✅ Lecture des médias

### Politiques Authentifiées
- ✅ CRUD complet pour les utilisateurs authentifiés
- ⚠️ TODO : Ajouter des rôles admin/editor pour plus de contrôle

## 🚀 Flux de Travail

### 1. Créer une Page

```sql
INSERT INTO cms_pages (slug, title, status, layout, locale)
VALUES ('/', 'Accueil', 'draft', 'landing', 'fr');
```

### 2. Ajouter des Sections

```sql
INSERT INTO cms_sections (page_id, component_type, sort_order, content)
VALUES (
  'page-uuid',
  'HeroSection',
  0,
  '{"title": "Titre Hero", "subtitle": "Sous-titre"}'
);
```

### 3. Publier la Page

```sql
UPDATE cms_pages
SET status = 'published', published_at = NOW()
WHERE id = 'page-uuid';
```

## 📊 Exemples d'Utilisation

### Récupérer une Page avec ses Sections

```ts
const { data: page } = await supabase
  .from('cms_pages')
  .select(`
    *,
    sections:cms_sections(*)
  `)
  .eq('slug', '/')
  .eq('status', 'published')
  .single();
```

### Récupérer la Configuration

```ts
const { data: config } = await supabase
  .from('cms_config')
  .select('*')
  .eq('key', 'site.navigation')
  .eq('locale', 'fr')
  .single();
```

### Upload d'un Média

```ts
// 1. Upload to Supabase Storage
const { data: file } = await supabase.storage
  .from('cms-media')
  .upload('2026/02/image.jpg', imageFile);

// 2. Enregistrer dans cms_media
const { data: media } = await supabase
  .from('cms_media')
  .insert({
    filename: 'image.jpg',
    storage_path: '2026/02/image.jpg',
    public_url: file.publicUrl,
    alt_text: 'Description de l\'image',
  });
```

## 🎯 Architecture JSONB

### Avantages
- **Flexibilité** : Ajouter des champs sans migration
- **Performance** : Indexation GIN pour recherche rapide
- **Validation** : TypeScript pour type safety

### Structure de `content` pour Sections

```ts
type SectionContent = {
  // Commun à toutes les sections
  title?: string;
  subtitle?: string;

  // Spécifique par type
  [key: string]: any;
};

// Exemple Hero
type HeroContent = SectionContent & {
  logo?: string;
  cta?: {
    text: string;
    href: string;
  };
};

// Exemple Features
type FeaturesContent = SectionContent & {
  features: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
};
```

### Structure de `settings` pour Sections

```ts
type SectionSettings = {
  background?: 'white' | 'cream' | 'dark';
  padding?: 'sm' | 'md' | 'lg';
  alignment?: 'left' | 'center' | 'right';
  columns?: number;
  showDivider?: boolean;
  [key: string]: any;
};
```

## 📝 Migration

Pour appliquer le schéma :

```bash
# Local
supabase db reset

# Production
supabase db push
```

## 🔄 Prochaines Étapes

1. ✅ Schéma SQL créé
2. ⏳ API Backend (CRUD endpoints)
3. ⏳ Interface Admin (dashboard)
4. ⏳ Prévisualisation en temps réel
5. ⏳ Système de publication/versioning
6. ⏳ Gestion des médias (upload, crop, optimize)
7. ⏳ Import/Export de contenu
8. ⏳ Multilingue (i18n)

## 📚 Ressources

- [Supabase Docs](https://supabase.com/docs)
- [PostgreSQL JSONB](https://www.postgresql.org/docs/current/datatype-json.html)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
