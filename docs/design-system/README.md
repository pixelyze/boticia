# Boticia UI Design System

Design system brutal et minimaliste pour Boticia.

## 🎨 Principes de Design

### Style Visuel
- **Brutal Design** : Bordures épaisses, ombres portées prononcées
- **Géométrique** : Formes nettes, angles droits
- **Minimaliste** : Pas de dégradés, pas de courbes
- **Tactile** : Effets de presse sur les interactions

### Palette de Couleurs

```ts
// Couleurs principales (Tailwind config)
colors: {
  cream: '#F5F3EE',  // Fond principal
  dark: '#2B2B2B',   // Texte et bordures
}

// Couleurs système
- gray-50 à gray-900  // Neutrals
- green-*             // Success
- red-*               // Errors
- yellow-*            // Warnings
- fuchsia-*           // Text selection uniquement
```

### Ombres

```css
/* Standard shadow */
shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]

/* Hover shadow */
shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]

/* Active shadow */
shadow-none + translate-x-[4px] translate-y-[4px]

/* Card shadow */
shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]

/* Primary button shadow */
shadow-[4px_4px_0px_0px_rgba(43,43,43,0.5)]
```

### Bordures

```css
/* Standard */
border-2 border-dark

/* Featured */
border-4 border-dark
```

### Espacements

```css
/* Padding composants */
px-6 py-3        // Buttons, inputs
p-6              // Cards

/* Gaps */
gap-2            // Icons + text
gap-4            // Form fields
gap-6            // Sections
```

## 📦 Composants

### Base Components (`components/ui/`)

#### Button
Variantes : `primary`, `default`, `ghost`

```vue
<Button variant="primary" icon="Check">
  Primary Action
</Button>
<Button variant="default">
  Secondary Action
</Button>
<Button variant="ghost">
  Tertiary Action
</Button>
```

Props :
- `variant` : "primary" | "default" | "ghost"
- `icon` : Nom de l'icône Lucide
- `rightIcon` : Icône à droite
- `loading` : État de chargement
- `disabled` : Désactivé
- `iconOnly` : Bouton icône seule
- `to` : Route interne (NuxtLink)
- `href` : Lien externe

#### Card
Variantes : `standard`, `warning`, `success`, `muted`, `featured`

```vue
<Card variant="standard">
  Contenu de la carte
</Card>
<Card variant="featured">
  Carte mise en avant (border-4)
</Card>
```

Props :
- `variant` : "standard" | "warning" | "success" | "muted" | "featured"
- `noShadow` : Désactive l'ombre

#### Input
```vue
<Input
  v-model="value"
  placeholder="Entrez votre texte"
  icon="Mail"
/>
```

#### Select
```vue
<Select
  v-model="selected"
  :options="options"
  placeholder="Sélectionnez..."
/>
```

### Layout Components (`components/layout/`)

- **Header** : Navigation principale
- **Footer** : Pied de page
- **Breadcrumb** : Fil d'Ariane
- **MobileMenu** : Menu mobile

### Landing Components (`components/landing/`)

- **HeroSection** : Section hero de la homepage
- **FeaturesSection** : Grille de fonctionnalités
- **PricingSection** : Plans tarifaires
- **FAQSection** : Questions fréquentes
- **ProcessSection** : Étapes d'un processus

### Form Components (`components/forms/`)

- **DatePicker** : Sélecteur de date
- **TimePicker** : Sélecteur d'heure

### Modal Components (`components/modals/`)

- **BaseModal** : Modal de base avec transitions
- **LanguageSelectorModal** : Sélection de langue
- **SettingsModal** : Paramètres

## 🎯 Conventions

### Nommage des Classes

```vue
<!-- Base + Variants + States + Custom -->
<div :class="[baseClasses, variantClasses, stateClasses, customClasses]">
```

### Props TypeScript

```ts
interface Props {
  variant?: "primary" | "secondary";
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "primary",
  disabled: false,
});
```

### Émissions d'Événements

```ts
const emit = defineEmits(["click", "change"]);
```

## 📚 Utilisation

### Importer un Composant

```vue
<script setup>
import Button from "~/components/ui/Button.vue";
</script>

<template>
  <Button variant="primary">Click me</Button>
</template>
```

### Composants Auto-Importés

Nuxt auto-importe tous les composants :

```vue
<template>
  <!-- Pas besoin d'import -->
  <Button variant="primary">Click me</Button>
</template>
```

## 🚀 Guidelines

1. **Toujours utiliser les composants du design system**
   - ❌ `<button>` natif
   - ✅ `<Button>` du design system

2. **Utiliser uniquement les couleurs Tailwind définies**
   - ❌ Hex/RGB personnalisés
   - ✅ Classes Tailwind (`gray-50`, `green-500`, etc.)

3. **Respecter les variantes existantes**
   - Ne pas créer de nouvelles variantes sans raison
   - Utiliser les props pour personnaliser

4. **Maintenir la cohérence des ombres**
   - Toujours utiliser les ombres standardisées
   - Respecter les transitions hover/active

## 🔄 Contribution

Pour ajouter un nouveau composant :

1. Créer le fichier dans le bon dossier (`ui/`, `landing/`, etc.)
2. Suivre la structure TypeScript + Props
3. Documenter les variantes et props ici
4. Ajouter des exemples d'utilisation
5. Vérifier la cohérence avec les autres composants
