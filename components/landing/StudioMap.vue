<template>
  <!-- [COMP-STUDIO-MAP] — Carte fixe dessinée, façon planche gravée
       (pas de Google Maps : ni cookies ni chargement lourd).
       Projection simplifiée de la Provence (lat 43,28–43,98 ; lon 4,55–5,93),
       positions calculées depuis les coordonnées réelles des villes.
       Passe-partout à double filet, mer hachurée, Durance, Luberon,
       rose des vents fine, échelle 10 km, Lambesc en orange. -->
  <figure>
    <svg
      viewBox="0 0 600 440"
      role="img"
      :aria-label="label"
      class="block w-full h-auto bg-cream-light font-body"
    >
      <defs>
        <!-- Hachures de la mer, comme sur une gravure -->
        <pattern
          id="studio-map-sea"
          width="6"
          height="6"
          patternUnits="userSpaceOnUse"
        >
          <path d="M0 3 H6" class="stroke-dark/15" stroke-width="0.6" />
        </pattern>
        <clipPath id="studio-map-plate">
          <rect x="20" y="20" width="560" height="400" />
        </clipPath>
      </defs>

      <!-- Passe-partout : double filet -->
      <rect x="10.5" y="10.5" width="579" height="419" class="fill-none stroke-dark/40" stroke-width="1" />
      <rect x="20.5" y="20.5" width="559" height="399" class="fill-none stroke-dark/20" stroke-width="0.6" />

      <g clip-path="url(#studio-map-plate)">
        <!-- Mer Méditerranée (côte stylisée) -->
        <path
          d="M20 344 C80 338 140 330 172 334 C200 338 214 356 236 368
             C262 382 300 392 330 404 C352 412 380 418 420 420 L20 420 Z"
          fill="url(#studio-map-sea)"
        />
        <path
          d="M20 344 C80 338 140 330 172 334 C200 338 214 356 236 368
             C262 382 300 392 330 404 C352 412 380 418 420 420"
          class="fill-none stroke-dark/40"
          stroke-width="0.8"
        />
        <!-- Étang de Berre -->
        <ellipse cx="256" cy="304" rx="24" ry="16" fill="url(#studio-map-sea)" class="stroke-dark/40" stroke-width="0.8" />

        <!-- Luberon : relief en fines courbes -->
        <g class="fill-none stroke-dark/20" stroke-width="0.8">
          <path d="M250 104 C300 84 360 80 430 92" />
          <path d="M258 112 C306 93 362 89 436 100" />
          <path d="M266 120 C312 102 366 98 442 108" />
          <path d="M274 128 C318 111 370 107 448 116" />
        </g>

        <!-- Durance -->
        <path
          id="studio-map-durance"
          d="M580 166 C500 182 452 178 412 174 C352 168 310 166 273 150
             C244 138 232 108 213 86 C188 60 150 44 114 36"
          class="fill-none stroke-dark/35"
          stroke-width="1.2"
        />

        <!-- Route Salon – Lambesc – Aix -->
        <path
          d="M237 204 L309 196 L389 271"
          class="fill-none stroke-dark/30"
          stroke-width="0.8"
          stroke-dasharray="2 4"
        />
      </g>

      <!-- Noms de lieux en petites capitales espacées -->
      <text x="455" y="112" class="fill-gray-500 italic" font-size="12" letter-spacing="4">LUBERON</text>
      <text x="476" y="194" class="fill-gray-500 stroke-cream-light italic" stroke-width="4" paint-order="stroke" font-size="11" letter-spacing="1.5">Durance</text>
      <text x="96" y="398" class="fill-gray-500 stroke-cream-light italic" stroke-width="5" paint-order="stroke" font-size="12" letter-spacing="4">MÉDITERRANÉE</text>
      <text x="256" y="331" class="fill-gray-500 stroke-cream-light italic" stroke-width="4" paint-order="stroke" font-size="9.5" letter-spacing="1" text-anchor="middle">Étang de Berre</text>

      <g class="fill-dark">
        <circle v-for="town in TOWNS" :key="town.name" :cx="town.x" :cy="town.y" r="2" />
      </g>
      <g class="fill-dark stroke-cream-light" stroke-width="4" paint-order="stroke" font-size="10.5" letter-spacing="2">
        <text
          v-for="town in TOWNS"
          :key="`label-${town.name}`"
          :x="town.x + town.dx"
          :y="town.y + town.dy"
          :text-anchor="town.anchor"
        >{{ town.name.toUpperCase() }}</text>
      </g>

      <!-- Lambesc : anneaux fins + point orange -->
      <circle cx="309" cy="196" r="22" class="fill-none stroke-orange-500/30" stroke-width="0.8" />
      <circle cx="309" cy="196" r="13" class="fill-none stroke-orange-500/60" stroke-width="0.8" />
      <circle cx="309" cy="196" r="4.5" class="fill-orange-500" />
      <text x="309" y="240" class="fill-dark font-heading italic" font-size="22" text-anchor="middle">Lambesc</text>
      <text x="309" y="256" class="fill-orange-500" font-size="9" font-weight="600" letter-spacing="2.5" text-anchor="middle">STUDIO BOTICIA</text>

      <!-- Rose des vents fine -->
      <g transform="translate(536 70)" class="stroke-dark/50 fill-none" stroke-width="0.8">
        <circle r="16" />
        <path d="M0 -24 L4 0 L0 24 L-4 0 Z" class="fill-dark/80" />
        <path d="M-24 0 L0 3 L24 0 L0 -3 Z" />
      </g>
      <text x="536" y="38" class="fill-dark" font-size="10" letter-spacing="1" text-anchor="middle">N</text>

      <!-- Échelle : 10 km ≈ 54 px à cette latitude -->
      <g transform="translate(470 392)">
        <path d="M0 0 H54 M0 -4 V4 M27 -3 V3 M54 -4 V4" class="stroke-dark/60" stroke-width="0.8" />
        <text x="27" y="16" class="fill-gray-500" font-size="9.5" letter-spacing="1" text-anchor="middle">10 KM</text>
      </g>
    </svg>
  </figure>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
});

// Coordonnées projetées, arrondies (Avignon légèrement descendu pour
// rester dans le cadre) ; dx/dy placent l'étiquette sans
// chevaucher la Durance ni les reliefs
const TOWNS = [
  { name: "Avignon", x: 114, y: 36, dx: -8, dy: 18, anchor: "end" },
  { name: "Apt", x: 368, y: 62, dx: 0, dy: -10, anchor: "middle" },
  { name: "Lourmarin", x: 353, y: 130, dx: 8, dy: 16, anchor: "start" },
  { name: "Salon-de-Provence", x: 237, y: 204, dx: -8, dy: 4, anchor: "end" },
  { name: "Aix-en-Provence", x: 389, y: 271, dx: 8, dy: 4, anchor: "start" },
  { name: "Marseille", x: 356, y: 400, dx: 0, dy: -10, anchor: "middle" },
];
</script>
