# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack

- **Nuxt 3** / Vue 3 / TypeScript
- **Tailwind CSS**
- **Supabase** (auth, database)
- **Resend** (emails)
- **@nuxtjs/i18n** (FR, EN, JA)

## Commands

```bash
npm run dev            # Development (localhost:3000)
npm run build          # Production build
npm run start          # Start production
npm run emails:compile # Compile MJML email templates
```

## Project Structure

```
/assets          # Static resources (CSS, images)
/components      # Reusable UI components
  /ui            # Base interface components
  /forms         # Form components
  /layout        # Structural components
  /landing       # Landing page sections
  /dashboard     # Dashboard components
  /modals        # Modal components
/composables     # Reusable business logic
/pages           # Application routes
/layouts         # Page layouts
/server          # Server API and endpoints
/i18n            # Translation files
/utils           # Shared utilities
```

## Supabase (IMPORTANT)

### TypeScript Imports

**ALWAYS use `type` for Supabase type imports.**

```ts
// INCORRECT
import { createClient, User } from "@supabase/supabase-js";

// CORRECT
import { createClient } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";
```

### Pages with Authentication

Pages using Supabase Auth must disable SSR:

```ts
definePageMeta({
  ssr: false,
});
```

### Date Formats

**ALWAYS use ISO format for dates sent to Supabase.**

```ts
// INCORRECT
const date = "Saturday January 31, 2026";

// CORRECT
const date = "2026-01-31";
```

### Redirect URLs with i18n

**ALWAYS use `window.location.origin` + explicit locale for redirect URLs.**

```ts
const { locale } = useI18n();
const redirectUrl = `${window.location.origin}/${locale.value}/dashboard/callback`;
```

## Tailwind CSS (IMPORTANT)

**ALWAYS use Tailwind classes. NEVER use custom hex/RGB values.**

| Usage | Allowed colors |
|-------|---------------|
| Neutrals | `gray-50` to `gray-900` |
| Success | `green-*` |
| Errors | `red-*` |
| Text selection | `fuchsia-*` (only for this) |
| Primary contrast | `black`, `white` |

## Buttons and CTAs (IMPORTANT)

**ALWAYS use the `Button` component for all buttons and action links.**

| Variant | Usage |
|---------|-------|
| `primary` | Main action (black, with shadow) |
| `ghost` | Secondary/subtle action (underlined text) |
| `default` | Standard button (white, black border) |

**Never create buttons with raw `<button>`, `<a>` or `<NuxtLink>` tags.** Always use the `Button` component.

## Icons (IMPORTANT)

**Before using an icon, check it is imported in `components/ui/IconLucid.vue`.**

If missing, add it to both the import statement AND the `icons` object.

## i18n (IMPORTANT)

**ALWAYS update ALL translation files simultaneously.**

Files: `i18n/locales/fr.json`, `en.json`, `ja.json`

When modifying a key, update every language file and verify consistency.

## Modals (IMPORTANT)

**ALWAYS use the `useModalTransitions` composable for transitions.**

Required structure:
1. Overlay with backdrop-blur
2. Drag bar with visual indicator
3. Centered bold title
4. Separator line
5. Scrollable content
6. Close button at bottom

Required closing methods: Escape key, overlay click, close button, swipe down on mobile.

## Naming Conventions

- `camelCase`: variables and functions
- `PascalCase`: components and classes
- `UPPER_SNAKE_CASE`: constants
- `kebab-case`: component files

## Formatting

- Prettier with project configuration
- Indentation: 2 spaces
- Semicolons required
- Line limit: 80 characters

## Code Methodology

1. Only modify code directly relevant to the request
2. Never replace code with placeholders like `// ... rest of processing ...`
3. Break down problems into smaller steps
4. Provide a complete plan with reasoning before making changes
5. Always use Tailwind color classes for visual consistency
6. Avoid over-engineering: don't create props/variables for fixed values
