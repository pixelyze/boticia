# Nuxt 3 SaaS Starter

A production-ready Nuxt 3 boilerplate for building SaaS applications with authentication, payments, transactional emails, internationalization, and more.

## Stack

- **Nuxt 3** / Vue 3 / TypeScript
- **Tailwind CSS** — Utility-first CSS with brutalist design system
- **Supabase** — Authentication (magic link) & PostgreSQL database
- **Stripe** — Payment processing (checkout sessions, webhooks)
- **Resend** — Transactional emails
- **MJML** — Email template compilation
- **@nuxtjs/i18n** — Internationalization (FR, EN, JA)
- **Vercel** — Deployment with cron jobs

## Quick Start

### 1. Clone and install

```bash
git clone <your-repo-url>
cd nuxt-starter
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

### 3. Supabase setup

1. Create a project at [supabase.com](https://supabase.com)
2. Run the migrations in `supabase/migrations/` in order
3. Configure Authentication > URL Configuration > Redirect URLs:
   - `http://localhost:3000/**`
   - `https://*.vercel.app/**`
   - `https://yourdomain.com/**`
4. Enable Email OTP (magic link) in Authentication > Providers

### 4. Stripe setup

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Dashboard
3. Set up a webhook endpoint pointing to `/api/stripe/webhook`
4. Listen for `checkout.session.completed` events

### 5. Resend setup

1. Create an account at [resend.com](https://resend.com)
2. Verify your domain
3. Get your API key

### 6. Compile email templates

```bash
npm run emails:compile
```

### 7. Run development server

```bash
npm run dev
```

Visit `http://localhost:3000`

## Project Structure

```
├── app.vue                    # Root component
├── error.vue                  # Error page
├── nuxt.config.ts             # Nuxt configuration
├── assets/
│   ├── css/main.css           # Global styles & typography
│   └── img/                   # Logo SVGs
├── components/
│   ├── ui/                    # Base UI components (Button, Card, Tag, etc.)
│   ├── layout/                # Layout components (Header, Footer, Breadcrumb)
│   ├── landing/               # Landing page sections (Hero, Features, Pricing, FAQ)
│   ├── dashboard/             # Dashboard components (ItemCard)
│   ├── modals/                # Modal components (BaseModal, Settings, Language)
│   └── forms/                 # Form components (DatePicker, TimePicker)
├── composables/               # Shared logic (useModal, useForm, useSupabase, etc.)
├── layouts/                   # Page layouts (default, homepage, dashboard, minimal)
├── pages/
│   ├── index.vue              # Landing page
│   ├── dashboard/
│   │   ├── index.vue          # User dashboard (auth + items)
│   │   └── callback.vue       # Auth callback handler
│   ├── success.vue            # Payment success page
│   ├── terms.vue              # Terms & conditions
│   ├── legal.vue              # Legal notice
│   └── design-system.vue      # Component showcase
├── server/
│   ├── api/
│   │   ├── stripe/            # Stripe endpoints (checkout, webhook, session)
│   │   ├── user/              # User endpoints (role, items)
│   │   ├── admin/             # Admin endpoints (items list)
│   │   └── test-email.post.ts # Email testing
│   ├── emails/
│   │   ├── compile.ts         # MJML → TypeScript compiler
│   │   └── mjml/              # MJML email templates
│   └── utils/                 # Server utilities (auth, Supabase, etc.)
├── i18n/locales/              # Translation files (fr.json, en.json, ja.json)
├── supabase/migrations/       # Database migrations
├── public/                    # Static files
└── utils/                     # Shared utilities (emailTemplates)
```

## Features

### Authentication
- Magic link (passwordless) via Supabase
- Role-based access (user/admin)
- Protected dashboard with auth flow

### Payments
- Stripe Checkout integration
- Webhook handling for payment confirmation
- Payment success page with order details

### Emails
- MJML templates compiled to TypeScript
- Resend integration for sending
- Welcome and order confirmation templates included

### Internationalization
- French, English, and Japanese
- Prefix-based routing strategy (`/fr/`, `/en/`, `/ja/`)
- Language selector component

### UI Components
- 20+ brutalist-style components
- Design system page for reference (`/design-system`)
- Mobile-responsive with touch gestures for modals

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run emails:compile` | Compile MJML email templates |

## Deployment

### Vercel

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy

The `vercel.json` includes a cron job configuration for status updates.

## Customization

1. **Branding**: Replace logos in `assets/img/` and update `app.name` in i18n files
2. **Colors**: Modify `tailwind.config.js` for custom palette
3. **Fonts**: Update Google Fonts in `nuxt.config.ts`
4. **Email templates**: Edit MJML files in `server/emails/mjml/` and run `npm run emails:compile`
5. **Database**: Add migrations in `supabase/migrations/`
6. **Favicons**: Generate and place in `public/`

## License

MIT
