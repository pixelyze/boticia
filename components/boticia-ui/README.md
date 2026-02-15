# Boticia UI - Design System

Design system brutal et minimaliste pour Boticia SaaS.

## 📍 Vue d'ensemble

Boticia UI est un design system complet construit avec :
- **Nuxt 3** + Vue 3 + TypeScript
- **Tailwind CSS**
- **Lucide Icons**
- Style **Neo-Brutalism** : bordures épaisses, ombres portées, géométrie nette

## 🎨 Philosophie

- **Brutal & Direct** : Pas de fioritures, design franc et honnête
- **Géométrique** : Angles droits, formes nettes
- **Tactile** : Effets de presse et feedback visuel fort
- **Accessible** : Contraste élevé, états clairs

## 📦 Composants Disponibles

### Base (`components/ui/`)
- **Button** - Bouton avec variantes primary/default/ghost
- **Card** - Cartes avec ombres brutales
- **Input** - Champs de formulaire
- **Select** - Liste déroulante
- **Tag** - Étiquettes colorées
- **InfoNote** - Notes d'information
- **StatusIcon** - Icônes de statut
- **ProgressBar** - Barre de progression
- **FeatureList** - Liste de fonctionnalités
- **StepIndicator** - Indicateur d'étapes
- **OptionButton** - Boutons d'option sélectionnables
- **IconLucid** - Wrapper pour icônes Lucide
- **BlockQuote** - Citations
- **FAQ** - Questions-réponses

### Landing (`components/landing/`)
- **HeroSection** - Section hero
- **FeaturesSection** - Grille de fonctionnalités
- **PricingSection** - Plans tarifaires
- **FAQSection** - Questions fréquentes
- **ProcessSection** - Étapes d'un processus

### Layout (`components/layout/`)
- **Header** - En-tête de navigation
- **Footer** - Pied de page
- **Breadcrumb** - Fil d'Ariane
- **MobileMenu** - Menu mobile

### Forms (`components/forms/`)
- **DatePicker** - Sélecteur de date
- **TimePicker** - Sélecteur d'heure

### Modals (`components/modals/`)
- **BaseModal** - Modal de base avec transitions
- **LanguageSelectorModal** - Sélection de langue
- **SettingsModal** - Paramètres

## 🚀 Démarrage Rapide

### Utilisation Auto-importée

Nuxt auto-importe tous les composants :

```vue
<template>
  <!-- Pas besoin d'import -->
  <Button variant="primary" icon="Check">
    Action Principale
  </Button>

  <Card variant="featured">
    <h3>Titre de la carte</h3>
    <p>Contenu de la carte</p>
  </Card>
</template>
```

### Avec Composable

```vue
<script setup>
const { tokens, brutalButton, brutalCard } = useBoticia();
</script>

<template>
  <div :class="brutalCard()">
    Carte avec effet brutal
  </div>
</template>
```

## 📚 Documentation

- **[Design Tokens](/docs/design-system/tokens.md)** - Couleurs, ombres, espacements
- **[Guide Complet](/docs/design-system/README.md)** - Conventions et patterns
- **[Playground](/design-system)** - Visualisez tous les composants

## 🎯 Exemples

### Bouton Primary avec Icône

```vue
<Button variant="primary" icon="ArrowRight" rightIcon="Check">
  Continuer
</Button>
```

### Carte Featured

```vue
<Card variant="featured">
  <h3 class="font-bold mb-2">Carte Mise en Avant</h3>
  <p class="text-gray-600">Bordure épaisse (4px) pour attirer l'attention</p>
</Card>
```

### Formulaire avec Validation

```vue
<Input
  v-model="email"
  type="email"
  label="Email"
  placeholder="vous@exemple.com"
  :error="emailError"
  icon="Mail"
/>
```

## 🎨 Tokens de Design

### Couleurs
```ts
colors: {
  cream: '#F5F3EE',  // Fond principal
  dark: '#2B2B2B',   // Texte et bordures
}
```

### Ombres
```css
shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]      /* Standard */
shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]      /* Card */
shadow-[4px_4px_0px_0px_rgba(43,43,43,0.5)] /* Primary */
```

### Bordures
```css
border-2 border-dark    /* Standard */
border-4 border-dark    /* Featured */
```

## 🔧 Composable useBoticia()

Utilitaires centralisés pour le design system :

```ts
const { tokens, brutalEffect, brutalButton, brutalCard } = useBoticia();

// Tokens
tokens.colors.cream
tokens.shadows.standard
tokens.borders.featured

// Helpers
brutalEffect('button')  // Classes pour effet brutal
brutalButton()          // Classes bouton avec états
brutalCard(true)        // Classes carte (featured)
```

## 📝 Conventions

### Nommage des Props

```ts
interface Props {
  variant?: "primary" | "default" | "ghost";
  disabled?: boolean;
  loading?: boolean;
}
```

### Classes Dynamiques

```vue
<script setup>
const classes = computed(() => [
  baseClasses,
  variantClasses,
  stateClasses,
  customClasses
]);
</script>
```

### Émissions d'Événements

```ts
const emit = defineEmits<{
  click: [event: Event];
  change: [value: string];
}>();
```

## ✅ Best Practices

1. **Toujours utiliser les composants du design system**
   - ❌ `<button>` natif
   - ✅ `<Button>` composant

2. **Respecter les couleurs Tailwind**
   - ❌ Hex/RGB personnalisés
   - ✅ `gray-50`, `green-500`, etc.

3. **Maintenir la cohérence des ombres**
   - Toujours utiliser les tokens standards
   - Respecter les transitions hover/active

4. **Props over Classes quand possible**
   - Préférer `variant="primary"` à des classes custom

## 🔄 Contribution

Pour ajouter un composant :

1. Créer dans le bon dossier (`ui/`, `landing/`, etc.)
2. Structure TypeScript avec Props
3. Suivre les conventions de nommage
4. Documenter les variantes
5. Ajouter au playground
6. Mettre à jour ce README

## 📦 Structure

```
components/
├── boticia-ui/
│   └── README.md          # Ce fichier
├── ui/                    # Composants de base
├── landing/               # Sections marketing
├── layout/                # Structure de page
├── forms/                 # Formulaires
└── modals/                # Modales

docs/design-system/
├── README.md              # Guide complet
└── tokens.md              # Documentation tokens

composables/
└── useBoticia.ts          # Utilitaires design system

pages/
└── design-system.vue      # Playground
```

## 🌐 Liens Utiles

- [Playground Live](/design-system) - Visualisez tous les composants
- [Lucide Icons](https://lucide.dev) - Bibliothèque d'icônes
- [Tailwind CSS](https://tailwindcss.com) - Framework CSS

---

**Boticia UI** - Design System Brutal & Minimal
