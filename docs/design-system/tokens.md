# Design Tokens - Boticia UI

Documentation des tokens de design utilisés dans le système Boticia UI.

## 🎨 Couleurs

### Couleurs Principales

| Token | Valeur | Utilisation |
|-------|--------|-------------|
| `cream` | `#F5F3EE` | Fond principal du site |
| `dark` | `#2B2B2B` | Texte, bordures, éléments sombres |
| `white` | `#FFFFFF` | Fond des cartes, boutons |
| `black` | `#000000` | Bordures, ombres |

### Couleurs Système (Tailwind)

| Palette | Utilisation | Nuances |
|---------|-------------|---------|
| `gray-*` | Neutrals, états désactivés | 50, 100, 200, 300, 400, 500, 600, 700, 800, 900 |
| `green-*` | Success, validation | 50, 400, 500, 600 |
| `red-*` | Erreurs, alertes | 50, 400, 500, 600 |
| `yellow-*` | Warnings, infos | 50, 400, 500 |
| `fuchsia-*` | Sélection de texte uniquement | 200, 300 |

## 🌑 Ombres

### Ombres Standard

```css
/* Bouton/Élément au repos */
shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]

/* Bouton/Élément au survol */
shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]

/* Bouton/Élément actif */
shadow-none

/* Carte */
shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
```

### Ombres Primary

```css
/* Bouton primary au repos */
shadow-[4px_4px_0px_0px_rgba(43,43,43,0.5)]

/* Bouton primary au survol */
shadow-[2px_2px_0px_0px_rgba(43,43,43,0.5)]
```

### Ombres Disabled

```css
/* Bouton disabled (primary) */
shadow-[2px_2px_0px_0px_rgba(43,43,43,0.1)]
```

## 📐 Bordures

| Type | Classes | Utilisation |
|------|---------|-------------|
| Standard | `border-2 border-dark` | Boutons, cartes, inputs |
| Featured | `border-4 border-dark` | Cartes mises en avant |
| Transparent | `border-transparent` | Boutons ghost |

## 📏 Espacements

### Padding

| Composant | Classes | Valeur |
|-----------|---------|--------|
| Button | `px-6 py-3` | 24px × 12px |
| Button (icon only) | `p-2` | 8px |
| Card | `p-6` | 24px |
| Input | `px-4 py-2` | 16px × 8px |
| Section | `px-6` | 24px |

### Gap

| Type | Classes | Valeur | Utilisation |
|------|---------|--------|-------------|
| Icon + Text | `gap-2` | 8px | Boutons avec icônes |
| Form Fields | `gap-4` | 16px | Espacement entre inputs |
| Sections | `gap-6` | 24px | Grilles de cartes |

### Margin

| Type | Classes | Valeur |
|------|---------|--------|
| Section Bottom | `mb-12`, `mb-16`, `mb-24` | 48px, 64px, 96px |

## 🎭 Transitions

### Standard

```css
transition-all
```

### Transformations

| État | Classes | Effet |
|------|---------|-------|
| Hover | `translate-x-[2px] translate-y-[2px]` | Déplacement léger |
| Active | `translate-x-[4px] translate-y-[4px]` | Effet de presse |

### Animation

```css
/* Loading spinner */
animate-spin
```

## 📝 Typographie

### Tailles de Texte

| Usage | Classes | Taille |
|-------|---------|--------|
| Heading 1 | `text-3xl md:text-5xl lg:text-6xl` | 30px → 48px → 60px |
| Heading 2 | `text-2xl md:text-3xl lg:text-4xl` | 24px → 30px → 36px |
| Heading 3 | `text-xl md:text-2xl` | 20px → 24px |
| Body Large | `text-lg md:text-xl` | 18px → 20px |
| Body | `text-base` | 16px |
| Small | `text-sm` | 14px |

### Poids de Police

| Usage | Classes |
|-------|---------|
| Bold (Headings, Buttons) | `font-bold` |
| Medium (Labels) | `font-medium` |
| Normal (Body) | (défaut) |

### Line Height

| Usage | Classes |
|-------|---------|
| Headings | `leading-tight` |
| Body | (défaut) |

## 🔢 Tailles d'Icônes

| Taille | Pixels | Utilisation |
|--------|--------|-------------|
| `sm` | 16px | Icônes dans boutons icon-only |
| `md` | 20px | Icônes dans boutons standard |
| `lg` | 24px | Icônes standalone |

## 📱 Breakpoints (Tailwind)

| Breakpoint | Taille | Usage |
|------------|--------|-------|
| `sm` | 640px | Mobile large |
| `md` | 768px | Tablette |
| `lg` | 1024px | Desktop |
| `xl` | 1280px | Desktop large |
| `2xl` | 1536px | Desktop XL |

## 🎯 États

### Bouton States

```ts
// Default variant
{
  default: "bg-white text-dark border-dark",
  hover: "shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
  active: "shadow-none translate-x-[4px] translate-y-[4px]",
  disabled: "bg-white text-dark/30 border-dark/10 cursor-not-allowed",
}

// Primary variant
{
  default: "bg-dark text-white border-dark shadow-[4px_4px_0px_0px_rgba(43,43,43,0.5)]",
  hover: "bg-dark/80 shadow-[2px_2px_0px_0px_rgba(43,43,43,0.5)]",
  active: "shadow-none translate-x-[4px] translate-y-[4px]",
  disabled: "bg-cream text-dark/30 border-cream shadow-[2px_2px_0px_0px_rgba(43,43,43,0.1)]",
}

// Ghost variant
{
  default: "text-dark bg-dark/10 border-transparent",
  hover: "bg-dark/20",
  active: "",
  disabled: "text-dark/30 cursor-not-allowed",
}
```

### Card Variants

```ts
{
  standard: "bg-white border-black",
  warning: "bg-yellow-50 border-yellow-400",
  success: "bg-green-50 border-green-500",
  muted: "bg-gray-50 border-gray-300",
  featured: "bg-white border-black border-4",
}
```

## 💡 Usage avec Composable

```vue
<script setup>
const { tokens, brutalButton, brutalCard } = useBoticia();

const buttonClasses = computed(() => {
  const btn = brutalButton();
  return [btn.base, "hover:" + btn.hover, "active:" + btn.active];
});
</script>
```

## 📦 Export des Tokens

Les tokens sont disponibles via le composable `useBoticia()` :

```ts
const { tokens } = useBoticia();

// Accès aux tokens
tokens.colors.cream
tokens.shadows.standard
tokens.borders.featured
tokens.spacing.buttonPadding
```
