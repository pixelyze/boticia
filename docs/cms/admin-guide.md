# Guide d'Administration CMS Boticia

Guide complet pour utiliser l'interface d'administration du CMS.

## 🚀 Accès à l'Admin

L'interface d'administration est accessible à l'adresse :

```
http://localhost:3008/admin/cms
```

## 📄 Gestion des Pages

### Liste des Pages (`/admin/cms`)

Interface principale pour gérer toutes les pages du site.

**Fonctionnalités** :
- ✅ Vue d'ensemble de toutes les pages
- ✅ Filtres par statut (draft, published, archived)
- ✅ Filtres par langue (fr, en, ja)
- ✅ Actions rapides : Publier, Dépublier, Supprimer
- ✅ Création de nouvelles pages

**Actions disponibles** :
1. **Créer une Page** : Bouton "Nouvelle Page"
2. **Éditer** : Accès à l'éditeur complet
3. **Publier/Dépublier** : Changer le statut rapidement
4. **Supprimer** : Avec confirmation

### Éditeur de Page (`/admin/cms/pages/:id`)

Interface d'édition complète avec 3 onglets.

#### Onglet Contenu

Gérez les sections de la page :

**Ajouter une Section** :
1. Cliquez sur "Ajouter une Section"
2. Choisissez le nom (ex: "Hero Principal")
3. Sélectionnez le type de composant :
   - HeroSection
   - FeaturesSection
   - PricingSection
   - FAQSection
   - ProcessSection
4. Cliquez sur "Ajouter"

**Éditer une Section** :
1. Cliquez sur "Éditer" sur la section
2. Modifiez le nom
3. Éditez le contenu JSON :
```json
{
  "title": "Titre de la section",
  "subtitle": "Sous-titre",
  "cta": {
    "text": "En savoir plus",
    "href": "#"
  }
}
```
4. Enregistrez

**Actions sur les Sections** :
- **Réordonner** : Drag & drop (icône de grip)
- **Masquer/Afficher** : Toggle de visibilité
- **Supprimer** : Avec confirmation

#### Onglet Paramètres

Configuration de base de la page :

| Champ | Description |
|-------|-------------|
| Titre | Titre affiché de la page |
| Slug | URL de la page (ex: `/about`) |
| Description | Description courte |
| Langue | `fr`, `en`, ou `ja` |
| Layout | `default`, `landing`, ou `dashboard` |

#### Onglet SEO

Optimisation pour les moteurs de recherche :

| Champ | Description |
|-------|-------------|
| Titre SEO | Titre optimisé (50-60 caractères) |
| Description SEO | Meta description (150-160 caractères) |
| URL Canonique | URL principale de la page |
| Robots | Directives pour les robots (ex: `index,follow`) |
| Image OG | Image pour partage social (Open Graph) |

**Actions globales** :
- **Enregistrer** : Sauvegarde tous les changements
- **Publier** : Rend la page visible publiquement
- **Dépublier** : Repasse la page en brouillon

---

## ⚙️ Configuration Globale (`/admin/cms/config`)

Gérez les paramètres globaux du site organisés par catégories.

### Catégories Disponibles

#### Navigation
Configuration de la navigation principale :

```json
{
  "key": "site.navigation",
  "category": "navigation",
  "locale": "fr",
  "value": {
    "items": [
      {
        "label": "Accueil",
        "href": "/"
      },
      {
        "label": "Fonctionnalités",
        "href": "#features"
      },
      {
        "label": "Tarifs",
        "href": "#pricing"
      }
    ]
  }
}
```

#### Footer
Configuration du pied de page :

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
          {"label": "Fonctionnalités", "href": "#features"},
          {"label": "Tarifs", "href": "#pricing"}
        ]
      },
      {
        "title": "Légal",
        "links": [
          {"label": "Mentions légales", "href": "/legal"},
          {"label": "CGU", "href": "/terms"}
        ]
      }
    ],
    "social": {
      "twitter": "https://twitter.com/boticia",
      "linkedin": "https://linkedin.com/company/boticia"
    }
  }
}
```

#### SEO
Configuration SEO globale :

```json
{
  "key": "seo.defaults",
  "category": "seo",
  "value": {
    "site_name": "Boticia",
    "default_title": "Boticia - Votre Assistant Intelligent",
    "default_description": "Automatisez vos tâches avec Boticia",
    "default_og_image": "/images/og-default.jpg",
    "twitter_handle": "@boticia"
  }
}
```

#### Social
Réseaux sociaux :

```json
{
  "key": "social.links",
  "category": "social",
  "value": {
    "twitter": "https://twitter.com/boticia",
    "linkedin": "https://linkedin.com/company/boticia",
    "github": "https://github.com/boticia"
  }
}
```

### Créer une Configuration

1. Cliquez sur "Nouvelle Config"
2. Remplissez les champs :
   - **Clé** : Identifiant unique (ex: `site.navigation`)
   - **Catégorie** : `general`, `navigation`, `footer`, `seo`, `social`
   - **Langue** : Global ou locale spécifique
   - **Valeur** : JSON de la configuration
   - **Description** : Description optionnelle
3. Cliquez sur "Créer"

### Éditer une Configuration

1. Cliquez sur "Éditer" sur la configuration
2. Modifiez la valeur JSON
3. Cliquez sur "Enregistrer"

**Note** : Les configurations utilisent l'upsert, donc créer une config avec une clé existante la mettra à jour.

---

## 📊 Exemples de Flux de Travail

### Créer une Nouvelle Page Landing

1. **Créer la page** :
   - Aller sur `/admin/cms`
   - Cliquer sur "Nouvelle Page"
   - Slug: `/landing`
   - Titre: "Page Landing"
   - Layout: `landing`
   - Langue: `fr`

2. **Ajouter les sections** :
   - **Section 1** : Hero
     - Type: `HeroSection`
     - Contenu:
     ```json
     {
       "title": "Bienvenue sur Boticia",
       "subtitle": "Automatisez vos tâches",
       "logo": "/logo-boticia.png"
     }
     ```

   - **Section 2** : Features
     - Type: `FeaturesSection`
     - Contenu:
     ```json
     {
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
     }
     ```

   - **Section 3** : Pricing
     - Type: `PricingSection`
     - Contenu: (structure de tarifs)

3. **Configurer le SEO** :
   - Onglet "SEO"
   - Titre SEO: "Boticia - Automatisez vos Tâches"
   - Description SEO: "Gagnez du temps avec Boticia..."
   - Image OG: `/images/og-landing.jpg`

4. **Publier** :
   - Cliquer sur "Enregistrer"
   - Cliquer sur "Publier"

### Mettre à Jour la Navigation

1. **Accéder à la config** :
   - Aller sur `/admin/cms/config`
   - Chercher `site.navigation`

2. **Éditer** :
   - Cliquer sur "Éditer"
   - Modifier le JSON :
   ```json
   {
     "items": [
       {"label": "Accueil", "href": "/"},
       {"label": "Nouveau", "href": "/new"}
     ]
   }
   ```

3. **Enregistrer** :
   - Cliquer sur "Enregistrer"
   - Les changements sont appliqués immédiatement

---

## 🎨 Structure du Contenu JSON

### Hero Section

```json
{
  "title": "Titre Principal",
  "subtitle": "Sous-titre",
  "logo": "/logo.png",
  "cta": {
    "text": "Commencer",
    "href": "/signup"
  }
}
```

### Features Section

```json
{
  "title": "Nos Fonctionnalités",
  "subtitle": "Ce qui nous rend unique",
  "features": [
    {
      "icon": "Zap",
      "title": "Fonctionnalité 1",
      "description": "Description de la fonctionnalité"
    }
  ]
}
```

### Pricing Section

```json
{
  "title": "Tarifs",
  "subtitle": "Choisissez votre plan",
  "plans": [
    {
      "name": "Gratuit",
      "price": "0€",
      "period": "/mois",
      "features": ["Feature 1", "Feature 2"],
      "cta": {
        "text": "Commencer",
        "href": "/signup"
      }
    }
  ]
}
```

### FAQ Section

```json
{
  "title": "Questions Fréquentes",
  "items": [
    {
      "question": "Comment ça marche ?",
      "answer": "Explication détaillée..."
    }
  ]
}
```

---

## 🔒 Sécurité

### Authentification (À venir)

Pour l'instant, l'admin est accessible sans authentification en développement.

**TODO** :
- Ajouter l'authentification Supabase
- Ajouter les rôles (admin, editor, viewer)
- Row Level Security sur les tables CMS

### Validation

- ✅ Validation des champs requis
- ✅ Validation du format JSON
- ✅ Validation des slugs uniques
- ⚠️ TODO : Validation du contenu XSS

---

## 🚀 Raccourcis Clavier (À venir)

| Raccourci | Action |
|-----------|--------|
| `Ctrl + S` | Enregistrer |
| `Ctrl + P` | Publier |
| `Ctrl + N` | Nouvelle page |
| `Esc` | Fermer modal |

---

## 📚 Ressources

- [Architecture CMS](./architecture.md)
- [API Documentation](./api.md)
- [Design System](../design-system/README.md)
- [Migration SQL](/supabase/migrations/20260214000001_create_cms_schema.sql)

---

## 🆘 Dépannage

### Erreur lors de la sauvegarde

**Problème** : "Erreur lors de l'enregistrement"

**Solutions** :
1. Vérifiez que le JSON est valide
2. Vérifiez que Supabase est démarré
3. Consultez la console du navigateur pour plus de détails

### Section ne s'affiche pas

**Problème** : Section créée mais invisible

**Solutions** :
1. Vérifiez que `is_visible` est `true`
2. Vérifiez que la page est publiée
3. Vérifiez l'ordre des sections (`sort_order`)

### Page 404

**Problème** : Page introuvable après publication

**Solutions** :
1. Vérifiez le slug (doit commencer par `/`)
2. Vérifiez que le statut est `published`
3. Rechargez la liste des pages
