<template>
  <!-- [LAYOUT-EDITORIAL] — Design « gravure et encre »
       Couleurs : palette choisie (useEditorialPalette), en variables CSS
       --ed-* lues par les classes Tailwind ed-*.
       Cadre fin autour de toute la page, comme un passe-partout. -->
  <div
    class="min-h-screen bg-ed-ground p-2.5 font-editorial text-ed-ink selection:bg-fuchsia-300 selection:text-fuchsia-900 md:p-6"
    :style="cssVars"
  >
    <!-- Pas de `isolate` ici : le menu téléphone (z-50) doit passer
         au-dessus du sélecteur de palettes. Chaque gravure s'isole déjà. -->
    <div class="overflow-hidden border-[1.5px] border-ed-ink bg-ed-ground">
      <EditorialHeader />
      <main id="main-content">
        <slot />
      </main>
      <EditorialFooter />
    </div>
    <EditorialPaletteSwitcher v-if="canSwitch" />
  </div>
</template>

<script setup lang="ts">
const { cssVars, canSwitch } = useEditorialPalette();
</script>
