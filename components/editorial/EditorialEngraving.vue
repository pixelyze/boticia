<template>
  <!-- [COMP-ENGRAVING] — Gravure de Redouté teintée
       La gravure (papier blanc) est fondue dans le fond avec
       mix-blend-multiply ; un cercle pâle derrière, et le même cercle
       en mix-blend-color par-dessus colore la fleur dans le cercle.
       Le fond (bg-ed-ground) est obligatoire sur ce bloc isolé :
       sans lui, le blanc de la gravure resterait visible. -->
  <div class="relative isolate bg-ed-ground">
    <div
      aria-hidden="true"
      class="absolute rounded-full bg-ed-circle"
      :class="circleClass"
    />
    <img
      :src="src"
      :alt="alt"
      :loading="eager ? 'eager' : 'lazy'"
      :fetchpriority="eager ? 'high' : undefined"
      decoding="async"
      class="absolute object-contain mix-blend-multiply"
      :class="imageClass"
    />
    <div
      aria-hidden="true"
      class="absolute rounded-full bg-ed-tint mix-blend-color"
      :class="circleClass"
    />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    src: string;
    alt: string;
    // Position et taille du cercle (classes Tailwind)
    circleClass: string;
    // Position et taille de la gravure (classes Tailwind)
    imageClass?: string;
    eager?: boolean;
  }>(),
  {
    imageClass: "inset-0 h-full w-full",
    eager: false,
  }
);
</script>
