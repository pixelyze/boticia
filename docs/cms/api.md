# CMS API Documentation

Documentation complète de l'API Backend pour le CMS Boticia.

## 🌐 Base URL

```
Local: http://localhost:3008/api/cms
Production: https://boticia.com/api/cms
```

## 🔐 Authentification

> **Note** : L'authentification sera ajoutée dans une prochaine version.
> Pour l'instant, tous les endpoints sont accessibles sans authentification.

## 📄 Pages

### GET /api/cms/pages

Récupérer toutes les pages avec filtres optionnels.

**Query Parameters** :
- `status` (optional) : `draft` | `published` | `archived`
- `locale` (optional) : `fr` | `en` | `ja`
- `includeSections` (optional) : `true` | `false` (default: `false`)

**Response** :
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "slug": "/",
      "title": "Accueil",
      "status": "published",
      "locale": "fr",
      "layout": "landing",
      "created_at": "2026-02-14T10:00:00Z",
      "sections": []
    }
  ],
  "count": 1
}
```

**Exemple** :
```bash
# Get all published pages
curl http://localhost:3008/api/cms/pages?status=published

# Get pages with sections
curl http://localhost:3008/api/cms/pages?includeSections=true
```

---

### GET /api/cms/pages/:slug

Récupérer une page par son slug.

**Path Parameters** :
- `slug` : URL slug de la page (ex: `/`, `/about`)

**Query Parameters** :
- `includeSections` (optional) : `true` | `false` (default: `true`)

**Response** :
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "slug": "/",
    "title": "Accueil",
    "status": "published",
    "sections": [
      {
        "id": "uuid-section",
        "component_type": "HeroSection",
        "content": {},
        "settings": {}
      }
    ]
  }
}
```

**Exemple** :
```bash
# Get homepage
curl http://localhost:3008/api/cms/pages/%2F

# Get about page without sections
curl http://localhost:3008/api/cms/pages/about?includeSections=false
```

---

### POST /api/cms/pages

Créer une nouvelle page.

**Body** :
```json
{
  "slug": "/new-page",
  "title": "Nouvelle Page",
  "description": "Description de la page",
  "status": "draft",
  "layout": "default",
  "locale": "fr",
  "meta_title": "Titre SEO",
  "meta_description": "Description SEO"
}
```

**Required Fields** :
- `slug` : string
- `title` : string

**Response** :
```json
{
  "success": true,
  "data": {
    "id": "new-uuid",
    "slug": "/new-page",
    "title": "Nouvelle Page",
    "status": "draft",
    "created_at": "2026-02-14T12:00:00Z"
  }
}
```

**Exemple** :
```bash
curl -X POST http://localhost:3008/api/cms/pages \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "/about",
    "title": "À Propos",
    "status": "draft"
  }'
```

---

### PUT /api/cms/pages/:id

Mettre à jour une page existante.

**Path Parameters** :
- `id` : UUID de la page

**Body** :
```json
{
  "title": "Titre Mis à Jour",
  "status": "published",
  "meta_description": "Nouvelle description"
}
```

**Response** :
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Titre Mis à Jour",
    "status": "published",
    "published_at": "2026-02-14T13:00:00Z",
    "updated_at": "2026-02-14T13:00:00Z"
  }
}
```

**Exemple** :
```bash
curl -X PUT http://localhost:3008/api/cms/pages/uuid-123 \
  -H "Content-Type: application/json" \
  -d '{"status": "published"}'
```

---

### DELETE /api/cms/pages/:id

Supprimer une page.

**Path Parameters** :
- `id` : UUID de la page

**Response** :
```json
{
  "success": true,
  "message": "Page deleted successfully"
}
```

**Exemple** :
```bash
curl -X DELETE http://localhost:3008/api/cms/pages/uuid-123
```

---

## 🧩 Sections

### GET /api/cms/sections

Récupérer les sections d'une page.

**Query Parameters** :
- `pageId` (required) : UUID de la page

**Response** :
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "page_id": "page-uuid",
      "name": "Hero Principal",
      "component_type": "HeroSection",
      "sort_order": 0,
      "content": {
        "title": "Bienvenue",
        "subtitle": "Description"
      },
      "settings": {
        "background": "cream"
      },
      "is_visible": true
    }
  ],
  "count": 1
}
```

**Exemple** :
```bash
curl http://localhost:3008/api/cms/sections?pageId=page-uuid
```

---

### POST /api/cms/sections

Créer une nouvelle section.

**Body** :
```json
{
  "page_id": "page-uuid",
  "name": "Hero Principal",
  "component_type": "HeroSection",
  "sort_order": 0,
  "content": {
    "title": "Titre Hero",
    "subtitle": "Sous-titre"
  },
  "settings": {
    "background": "cream"
  },
  "is_visible": true
}
```

**Required Fields** :
- `page_id` : string
- `name` : string
- `component_type` : string

**Exemple** :
```bash
curl -X POST http://localhost:3008/api/cms/sections \
  -H "Content-Type: application/json" \
  -d '{
    "page_id": "page-uuid",
    "name": "Features",
    "component_type": "FeaturesSection",
    "content": {}
  }'
```

---

### PUT /api/cms/sections/:id

Mettre à jour une section.

**Path Parameters** :
- `id` : UUID de la section

**Body** :
```json
{
  "content": {
    "title": "Nouveau Titre"
  },
  "is_visible": false
}
```

---

### DELETE /api/cms/sections/:id

Supprimer une section.

**Path Parameters** :
- `id` : UUID de la section

---

### POST /api/cms/sections/reorder

Réordonner les sections d'une page.

**Body** :
```json
{
  "sectionIds": ["uuid-3", "uuid-1", "uuid-2"]
}
```

**Response** :
```json
{
  "success": true,
  "message": "Sections reordered successfully"
}
```

**Exemple** :
```bash
curl -X POST http://localhost:3008/api/cms/sections/reorder \
  -H "Content-Type: application/json" \
  -d '{"sectionIds": ["uuid-3", "uuid-1", "uuid-2"]}'
```

---

## 🎨 Components

### GET /api/cms/components

Récupérer tous les composants.

**Query Parameters** :
- `category` (optional) : `ui` | `landing` | `form` | `layout` | `modal`
- `is_active` (optional) : `true` | `false`

**Response** :
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "primary-cta",
      "component_type": "Button",
      "category": "ui",
      "default_props": {
        "variant": "primary",
        "icon": "ArrowRight"
      },
      "variants": [
        {"name": "default", "label": "Par défaut"},
        {"name": "loading", "label": "Chargement"}
      ],
      "is_active": true
    }
  ],
  "count": 1
}
```

**Exemple** :
```bash
# Get all UI components
curl http://localhost:3008/api/cms/components?category=ui

# Get active components only
curl http://localhost:3008/api/cms/components?is_active=true
```

---

### POST /api/cms/components

Créer un composant.

**Body** :
```json
{
  "name": "feature-card",
  "component_type": "Card",
  "category": "landing",
  "description": "Carte de fonctionnalité",
  "default_props": {
    "variant": "standard"
  },
  "variants": [
    {"name": "standard", "label": "Standard"},
    {"name": "featured", "label": "Mis en avant"}
  ]
}
```

**Required Fields** :
- `name` : string
- `component_type` : string
- `category` : string

---

## ⚙️ Config

### GET /api/cms/config

Récupérer la configuration.

**Query Parameters** :
- `key` (optional) : Clé de config spécifique
- `category` (optional) : `navigation` | `footer` | `seo` | `general`
- `locale` (optional) : `fr` | `en` | `ja`

**Response (all configs)** :
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "key": "site.navigation",
      "category": "navigation",
      "locale": "fr",
      "value": {
        "items": [
          {"label": "Accueil", "href": "/"}
        ]
      }
    }
  ],
  "count": 1
}
```

**Response (single config)** :
```json
{
  "success": true,
  "data": {
    "key": "site.navigation",
    "value": {
      "items": [...]
    }
  }
}
```

**Exemples** :
```bash
# Get all configs
curl http://localhost:3008/api/cms/config

# Get navigation config
curl http://localhost:3008/api/cms/config?key=site.navigation

# Get footer configs
curl http://localhost:3008/api/cms/config?category=footer
```

---

### POST /api/cms/config

Créer ou mettre à jour une configuration (upsert).

**Body** :
```json
{
  "key": "site.navigation",
  "category": "navigation",
  "locale": "fr",
  "value": {
    "items": [
      {"label": "Accueil", "href": "/"},
      {"label": "Tarifs", "href": "#pricing"}
    ]
  },
  "description": "Navigation principale du site"
}
```

**Required Fields** :
- `key` : string
- `category` : string
- `value` : object

**Exemple** :
```bash
curl -X POST http://localhost:3008/api/cms/config \
  -H "Content-Type: application/json" \
  -d '{
    "key": "footer.links",
    "category": "footer",
    "value": {"columns": []}
  }'
```

---

## 📸 Media

### GET /api/cms/media

Récupérer tous les médias.

**Response** :
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "filename": "hero-image.jpg",
      "original_filename": "photo.jpg",
      "mime_type": "image/jpeg",
      "file_size": 123456,
      "storage_path": "cms-media/2026/02/hero-image.jpg",
      "public_url": "https://...",
      "alt_text": "Image hero",
      "width": 1920,
      "height": 1080,
      "created_at": "2026-02-14T10:00:00Z"
    }
  ],
  "count": 1
}
```

**Exemple** :
```bash
curl http://localhost:3008/api/cms/media
```

---

## 🔍 Codes d'Erreur

| Code | Message | Description |
|------|---------|-------------|
| 400 | Bad Request | Paramètres invalides ou manquants |
| 404 | Not Found | Ressource introuvable |
| 500 | Internal Server Error | Erreur serveur |

**Exemple de réponse d'erreur** :
```json
{
  "statusCode": 404,
  "statusMessage": "Not Found",
  "message": "Page not found"
}
```

---

## 🚀 Exemples d'Utilisation

### Créer une page complète avec sections

```typescript
// 1. Créer la page
const pageResponse = await fetch('/api/cms/pages', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    slug: '/about',
    title: 'À Propos',
    status: 'draft',
    locale: 'fr',
  }),
});

const { data: page } = await pageResponse.json();

// 2. Ajouter une section Hero
await fetch('/api/cms/sections', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    page_id: page.id,
    name: 'Hero',
    component_type: 'HeroSection',
    sort_order: 0,
    content: {
      title: 'À Propos de Boticia',
      subtitle: 'Notre mission',
    },
  }),
});

// 3. Publier la page
await fetch(`/api/cms/pages/${page.id}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ status: 'published' }),
});
```

### Récupérer et afficher une page

```typescript
// Récupérer la page avec sections
const response = await fetch('/api/cms/pages/%2F?includeSections=true');
const { data: page } = await response.json();

// Afficher les sections
page.sections.forEach((section) => {
  console.log(`Section: ${section.component_type}`);
  console.log(`Content:`, section.content);
});
```

---

## 📚 Ressources

- [Architecture CMS](./architecture.md)
- [Types TypeScript](/server/utils/cms-types.ts)
- [Fonctions CRUD](/server/utils/cms.ts)
- [Migrations SQL](/supabase/migrations/)
