<template>
  <div class="flex-1 flex flex-col bg-white">
    <section class="py-6 md:py-8">
      <div class="px-4 md:px-10 max-w-3xl">

        <!-- Header -->
        <div class="mb-10">
          <h1 class="text-2xl md:text-3xl font-bold">
            Mises à jour du site
          </h1>
          <p class="text-dark/40 mt-1">
            Les améliorations apportées à votre site, au fil du temps.
          </p>
        </div>

        <!-- Timeline -->
        <div class="space-y-10">
          <div
            v-for="release in releases"
            :key="release.date"
            class="relative"
          >
            <!-- Date badge -->
            <div class="flex items-center gap-3 mb-4">
              <span class="text-xs font-semibold uppercase tracking-widest text-dark/40">
                {{ release.date }}
              </span>
              <div class="flex-1 h-px bg-dark/10" />
            </div>

            <!-- Changes -->
            <div class="space-y-3">
              <div
                v-for="item in release.items"
                :key="item.title"
                class="flex items-start gap-4 rounded-2xl px-5 py-4"
                :class="categoryStyle(item.category).bg"
              >
                <span
                  class="w-2 h-2 rounded-full shrink-0 mt-2"
                  :class="categoryStyle(item.category).dot"
                />
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="font-semibold text-dark text-sm">{{ item.title }}</span>
                    <span
                      class="text-xs px-2 py-0.5 rounded-full font-medium"
                      :class="categoryStyle(item.category).badge"
                    >
                      {{ categoryLabel(item.category) }}
                    </span>
                  </div>
                  <p class="text-dark/60 text-sm mt-1 leading-relaxed">
                    {{ item.description }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  ssr: false,
  layout: "dashboard",
  middleware: ["auth-admin"],
  pageTransition: false,
  layoutTransition: false,
});

type Category = "feature" | "fix" | "seo" | "design" | "content";

const categoryStyle = (cat: Category) => {
  const styles: Record<Category, { bg: string; dot: string; badge: string }> = {
    feature: {
      bg: "bg-cream/50",
      dot: "bg-dark",
      badge: "bg-dark/10 text-dark/70",
    },
    fix: {
      bg: "bg-red-50",
      dot: "bg-red-400",
      badge: "bg-red-100 text-red-600",
    },
    seo: {
      bg: "bg-green-50",
      dot: "bg-green-500",
      badge: "bg-green-100 text-green-700",
    },
    design: {
      bg: "bg-fuchsia-50",
      dot: "bg-fuchsia-400",
      badge: "bg-fuchsia-100 text-fuchsia-700",
    },
    content: {
      bg: "bg-cream/50",
      dot: "bg-terracotta",
      badge: "bg-terracotta/10 text-terracotta",
    },
  };
  return styles[cat];
};

const categoryLabel = (cat: Category) => {
  const labels: Record<Category, string> = {
    feature: "Nouvelle fonctionnalité",
    fix: "Correction",
    seo: "SEO",
    design: "Design",
    content: "Contenu",
  };
  return labels[cat];
};

const releases = [
  {
    date: "19 mai 2026",
    items: [
      {
        category: "seo" as Category,
        title: "Suppression des anciennes pages dans Google",
        description: "Les anciennes pages de l'ancien site (blogs, collections, pages produits) redirigent maintenant vers l'accueil. Google va progressivement les retirer de ses résultats.",
      },
      {
        category: "fix" as Category,
        title: "Upload de grandes photos corrigé",
        description: "Les photos de plus de 2 MB sont automatiquement compressées avant l'envoi — les grosses photos de smartphone (20 MB) passent maintenant sans erreur.",
      },
      {
        category: "feature" as Category,
        title: "Galerie Événements dans le dashboard",
        description: "La galerie Événements apparaît maintenant dans votre espace galeries, après Ateliers, pour pouvoir y ajouter et gérer vos photos.",
      },
    ],
  },
  {
    date: "9 mai 2026",
    items: [
      {
        category: "feature" as Category,
        title: "Galerie portfolio : 3ème colonne de photos",
        description: "La galerie homepage affiche maintenant une 3ème colonne étroite sur desktop avec 3 emplacements supplémentaires (slots 7, 8, 9) pour montrer plus de photos.",
      },
      {
        category: "feature" as Category,
        title: "Même layout galerie sur toutes les pages",
        description: "Les pages Mariages, Ateliers et Événements utilisent maintenant le même bento que la homepage — 9 emplacements, 3ème colonne incluse.",
      },
      {
        category: "feature" as Category,
        title: "Placeholders galerie — aperçu du layout",
        description: "Quand des emplacements sont vides, des cases grises animées montrent à quoi ressemblera la galerie une fois remplie.",
      },
      {
        category: "feature" as Category,
        title: "Dashboard galeries : aperçu en temps réel",
        description: "Le mini-plan du layout affiche maintenant vos vraies photos dans leurs cases. Vous voyez exactement ce qui sera visible sur le site avant même de sauvegarder.",
      },
      {
        category: "design" as Category,
        title: "Dashboard galeries : miniatures en ratio naturel",
        description: "Les photos dans le dashboard respectent leur ratio d'origine (portrait ou paysage) pour mieux choisir dans quel emplacement les placer.",
      },
      {
        category: "design" as Category,
        title: "Dashboard galeries : bouton ajout intégré à la grille",
        description: "Le bouton 'Ajouter des photos' apparaît directement comme une case dans la grille, à la suite des photos existantes.",
      },
      {
        category: "design" as Category,
        title: "Témoignages : suppression des bordures",
        description: "Les cartes témoignages n'ont plus de contour — l'ensemble est plus aéré et moins chargé visuellement.",
      },
      {
        category: "seo" as Category,
        title: "Priorités SEO dans le sitemap",
        description: "Les pages Mariages, Événements et Ateliers ont maintenant une priorité 0.9 dans le sitemap — Google comprend mieux leur importance et devrait mieux les référencer.",
      },
    ],
  },
  {
    date: "8 mai 2026",
    items: [
      {
        category: "fix" as Category,
        title: "Retrait du bloc photo citation (obsolète)",
        description: "Le réglage 'Photo citation' dans les Paramètres a été supprimé — ce bloc n'existe plus sur la homepage et n'avait plus d'utilité.",
      },
      {
        category: "feature" as Category,
        title: "Page Mises à jour dans le dashboard",
        description: "Cette page ! Vous pouvez maintenant consulter l'historique de toutes les améliorations apportées à votre site, directement depuis votre espace.",
      },
      {
        category: "fix" as Category,
        title: "Déploiements Vercel rétablis",
        description: "Un cron toutes les 6h bloquait les déploiements automatiques depuis le 15 avril. Corrigé : le cron est maintenant quotidien, compatible avec le plan Hobby.",
      },
      {
        category: "fix" as Category,
        title: "Tranches tarifaires mises à jour",
        description: "Les fourchettes de budget dans le formulaire de devis sont maintenant : 3 000–5 000 € / 5 000–8 000 € / 8 000 € et plus.",
      },
      {
        category: "feature" as Category,
        title: "Placeholder téléphone adapté au pays",
        description: "Le format de numéro de téléphone dans le formulaire de devis s'adapte automatiquement selon le pays sélectionné (ex: 201 555 0123 pour les États-Unis).",
      },
      {
        category: "feature" as Category,
        title: "Témoignages défilants sur la homepage",
        description: "Un bloc de témoignages clients apparaît avant la FAQ. Défilement automatique sur desktop, swipe sur mobile, boutons de navigation.",
      },
      {
        category: "feature" as Category,
        title: "Tags Open Graph sur toutes les pages",
        description: "Les pages À propos, FAQ et Mentions légales ont maintenant des aperçus corrects quand elles sont partagées sur les réseaux sociaux.",
      },
      {
        category: "content" as Category,
        title: "Correction grammaticale page d'accueil",
        description: "\"Boticia est un atelier de design floral, donne vie à vos idées\" corrigé en \"qui donne vie à vos idées\".",
      },
      {
        category: "seo" as Category,
        title: "Méta-description Mariages dédiée",
        description: "La description qui apparaît dans Google pour la page Mariages est maintenant précise et limitée à 155 caractères (au lieu d'un texte trop long tronqué).",
      },
      {
        category: "seo" as Category,
        title: "Préchargement de l'image principale",
        description: "L'image du hero se charge maintenant plus vite — amélioration des Core Web Vitals (LCP).",
      },
      {
        category: "seo" as Category,
        title: "Fichier llms.txt créé",
        description: "Un fichier de présentation structuré permet aux intelligences artificielles (ChatGPT, Perplexity, Claude…) de mieux comprendre votre activité et de vous citer dans leurs réponses.",
      },
      {
        category: "seo" as Category,
        title: "Hreflang et sitemap corrigés",
        description: "Les codes de langue sont maintenant au format BCP-47 (fr-FR, en-US, ja-JP) dans le sitemap, avec balise x-default ajoutée. Google comprend mieux quelle version afficher selon la langue de l'utilisateur.",
      },
      {
        category: "seo" as Category,
        title: "Balises HSTS et X-Robots-Tag",
        description: "Les pages privées (dashboard, admin) sont maintenant protégées contre l'indexation accidentelle par Google. Le site force le HTTPS.",
      },
    ],
  },
  {
    date: "14–15 avril 2026",
    items: [
      {
        category: "feature" as Category,
        title: "Bento slots — choix des emplacements galerie",
        description: "Vous pouvez maintenant choisir quelle photo apparaît dans chacun des 6 emplacements du layout bento, directement depuis le dashboard galeries.",
      },
      {
        category: "design" as Category,
        title: "Layout bento sur toutes les galeries",
        description: "Les galeries homepage, mariages, événements et ateliers utilisent désormais un layout bento éditorial (wide + portraits en zigzag) avec overlay '+N' sur la dernière image.",
      },
      {
        category: "feature" as Category,
        title: "Galerie événements dynamique",
        description: "La galerie de la page événements est maintenant modifiable depuis le dashboard (slug 'events'), avec des placeholders si la galerie est vide.",
      },
      {
        category: "feature" as Category,
        title: "Images superposées — bloc Notre approche",
        description: "Deux images carrées superposées sur le bloc 'Notre approche' de la page événements, modifiables depuis les Paramètres du dashboard.",
      },
      {
        category: "seo" as Category,
        title: "SEO — Redirections 301 et robots.txt",
        description: "Redirections pour les URLs sans locale et les pages supprimées. Le robots.txt bloque les zones privées (/dashboard, /admin, /api).",
      },
      {
        category: "seo" as Category,
        title: "Cron keep-alive Supabase",
        description: "Un ping automatique toutes les 24h empêche Supabase de se mettre en pause faute d'activité.",
      },
      {
        category: "design" as Category,
        title: "Footer restructuré",
        description: "Nouveau layout : BOTICIA / Atelier de Design floral / Mariages · Event · Set Design. Les mentions légales sont discrètes dans la ligne copyright.",
      },
      {
        category: "content" as Category,
        title: "Rebranding Provence",
        description: "Toutes les mentions 'Côte d'Azur' remplacées par 'Provence' dans les textes du site (titres, i18n FR/EN/JA). Les JSON-LD conservent le nom officiel de la région.",
      },
    ],
  },
  {
    date: "Avant avril 2026",
    items: [
      {
        category: "fix" as Category,
        title: "Upload d'images en production",
        description: "Les photos de smartphone (5–15 MB) sont maintenant compressées côté navigateur avant l'envoi, pour contourner la limite Vercel de 4,5 MB.",
      },
      {
        category: "fix" as Category,
        title: "Portail client toujours actif",
        description: "Le portail client est maintenant actif par défaut pour toutes les clientes — plus besoin de l'activer manuellement avant d'envoyer un devis.",
      },
      {
        category: "feature" as Category,
        title: "Détection automatique du pays (téléphone)",
        description: "Le formulaire de devis détecte le fuseau horaire de la cliente pour pré-sélectionner son indicatif téléphonique (+1 pour les USA, +33 pour la France, etc.).",
      },
      {
        category: "content" as Category,
        title: "Mentions légales complètes",
        description: "La page mentions légales contient maintenant 7 sections réelles (éditeur, hébergeur, RGPD, cookies, responsabilité…) en 3 langues.",
      },
      {
        category: "design" as Category,
        title: "Hero homepage rebranding",
        description: "Titre BOTICIA en uppercase, sous-titre 'Floral designer', localisation 'Provence · Paris'. Retrait de l'indicateur scroll.",
      },
      {
        category: "fix" as Category,
        title: "Confusion fuseau horaire — prise de RDV",
        description: "La mention '(heure de Paris)' est maintenant affichée à côté des créneaux de rendez-vous pour éviter toute confusion avec les clientes à l'étranger.",
      },
    ],
  },
];
</script>
