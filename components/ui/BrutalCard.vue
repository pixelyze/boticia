<template>
  <div class="bg-white border-2 border-black p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
    <!-- Titre -->
    <h2 v-if="title" class="text-xl md:text-2xl font-bold mb-6">{{ title }}</h2>

    <!-- Contenu principal -->
    <slot />

    <!-- Footer (boutons, actions) -->
    <div v-if="$slots.footer" class="mt-4">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string;
}>();
</script>
