<template>
  <!-- DEV-ONLY — Comparaison typographique : échelle actuelle contre
       échelle harmonisée (inspirée du design « gravure et encre »),
       avec trois polices de paragraphe. Styles en ligne pour ne pas
       dépendre de la génération Tailwind. -->
  <div style="background: #fff; min-height: 100vh; padding: 48px 24px">
    <div style="max-width: 1100px; margin: 0 auto">
      <h1 style="font-family: 'Playfair Display', serif; font-size: 36px; color: #2b2b2b">
        Typographie du site
      </h1>
      <p style="font-family: 'Source Sans 3', sans-serif; font-size: 17px; color: #2b2b2b; max-width: 680px; margin-top: 8px">
        Le même extrait (le bloc « Notre savoir-faire » de l'accueil), dans
        l'échelle actuelle puis dans l'échelle harmonisée, avec trois
        polices de paragraphe. Les titres restent en Playfair Display.
      </p>

      <section
        v-for="v in variants"
        :key="v.key"
        :style="{ background: '#F4F2EE', padding: '56px 48px', marginTop: '48px' }"
      >
        <p :style="{ fontFamily: 'Source Sans 3, sans-serif', fontSize: '14px', color: '#C4784B', marginBottom: '32px', letterSpacing: '0.05em' }">
          {{ v.name }} — {{ v.note }}
        </p>

        <p :style="v.label">NOTRE SAVOIR-FAIRE</p>
        <h2 :style="v.h2">Un design floral pensé pour vos événements</h2>
        <p :style="v.lead">
          Mariage, événement d'entreprise ou établissement : Boticia crée
          votre décor floral en Provence et à Paris, avec des fleurs de
          saison et un design floral à votre image.
        </p>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 40px; margin-top: 48px">
          <div v-for="item in ITEMS" :key="item.title">
            <h3 :style="v.h3">{{ item.title }}</h3>
            <p :style="v.body">{{ item.text }}</p>
            <p :style="v.small">Fleurs de saison · Provence · Paris</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
// DEV-ONLY
if (!import.meta.dev) {
  throw createError({ statusCode: 404 });
}

definePageMeta({ layout: false });

useHead({
  link: [
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,wght@0,400;0,600;1,400&family=Jost:wght@300;400;500&display=swap",
    },
  ],
});

const ITEMS = [
  {
    title: "Fleurs de saison",
    text: "Nous privilégions des fleurs de saison, cultivées en circuit court à plus de 60 %, afin de garantir une fraîcheur optimale tout en réduisant notre impact écologique.",
  },
  {
    title: "Créations sur mesure",
    text: "Chaque composition florale est unique, pensée et réalisée à la main selon vos envies, votre thème et votre lieu de réception.",
  },
  {
    title: "Approche éco-responsable",
    text: "Des pratiques durables à chaque étape : fleurs de saison, une approche raisonnée, supports réutilisables.",
  },
];

const DARK = "#2B2B2B";
const heading = "'Playfair Display', serif";

// Échelle harmonisée : 5 tailles seulement, paragraphes en encre pleine
const scale = (bodyFont, bodySize = "17px") => ({
  label: { fontFamily: "'Source Sans 3', sans-serif", fontSize: "13px", fontWeight: 600, letterSpacing: "0.3em", color: DARK, textTransform: "uppercase" },
  h2: { fontFamily: heading, fontSize: "40px", lineHeight: 1.15, color: DARK, marginTop: "16px" },
  lead: { fontFamily: bodyFont, fontSize: "19px", lineHeight: 1.6, color: DARK, marginTop: "20px", maxWidth: "680px" },
  h3: { fontFamily: heading, fontSize: "26px", lineHeight: 1.25, color: DARK },
  body: { fontFamily: bodyFont, fontSize: bodySize, lineHeight: 1.7, color: DARK, marginTop: "12px" },
  small: { fontFamily: bodyFont, fontSize: "14px", color: "#6B7280", marginTop: "12px" },
});

const variants = [
  {
    key: "actuel",
    name: "Actuel",
    note: "tagline 18 px, titres 44 et 36 px, paragraphes 20 px gris clair (text-dark/70)",
    label: { fontFamily: "'Source Sans 3', sans-serif", fontSize: "18px", letterSpacing: "0.3em", color: "rgba(43,43,43,0.7)", textTransform: "uppercase" },
    h2: { fontFamily: heading, fontSize: "44px", fontWeight: 500, lineHeight: 1.25, color: DARK, marginTop: "16px" },
    lead: { fontFamily: "'Source Sans 3', sans-serif", fontSize: "18px", lineHeight: 1.6, color: "rgba(43,43,43,0.6)", marginTop: "16px", maxWidth: "680px" },
    h3: { fontFamily: heading, fontSize: "36px", lineHeight: 1.375, color: DARK },
    body: { fontFamily: "'Source Sans 3', sans-serif", fontSize: "20px", lineHeight: 1.625, color: "rgba(43,43,43,0.7)", marginTop: "16px" },
    small: { fontFamily: "'Source Sans 3', sans-serif", fontSize: "16px", color: "rgba(43,43,43,0.55)", marginTop: "12px" },
  },
  { key: "a", name: "A · Source Sans 3", note: "police actuelle, échelle harmonisée, texte en encre pleine", ...scale("'Source Sans 3', sans-serif") },
  { key: "b", name: "B · Source Serif 4", note: "la police du design « gravure et encre » : rendu revue, le plus éditorial", ...scale("'Source Serif 4', serif") },
  { key: "c", name: "C · Jost", note: "linéale fine et géométrique, très mode / haute couture", ...scale("'Jost', sans-serif", "17px") },
];
</script>
