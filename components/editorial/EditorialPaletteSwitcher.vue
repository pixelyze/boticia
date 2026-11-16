<template>
  <!-- [COMP-EDITORIAL-PALETTE] — Sélecteur de palette
       Outil de présentation : affiché seulement sur la démo et en local
       (voir useEditorialPalette). Le choix est gardé dans un cookie. -->
  <div
    class="fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full border-[1.5px] border-ed-ink bg-white py-1 pl-4 pr-1 font-sans text-dark shadow-lg"
    role="group"
    :aria-label="$t('editorial.palette.hint')"
    :title="$t('editorial.palette.hint')"
  >
    <p class="hidden text-xs font-semibold uppercase tracking-[0.2em] sm:block">
      {{ palette.name }}
    </p>
    <div class="flex">
      <Button
        v-for="item in palettes"
        :key="item.key"
        variant="ghost"
        class="!border-0 !p-1.5"
        :aria-label="item.name"
        :aria-pressed="item.key === palette.key ? 'true' : 'false'"
        @click="setPalette(item.key)"
      >
        <!-- Pastille aux couleurs de la palette (encre + fleur) -->
        <span
          class="block h-6 w-6 rounded-full ring-offset-2"
          :class="item.key === palette.key ? 'ring-2 ring-dark' : ''"
          :style="{
            background: `linear-gradient(135deg, ${item.ink} 50%, ${item.tint} 50%)`,
          }"
        />
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
const { palette, palettes, setPalette } = useEditorialPalette();
</script>
