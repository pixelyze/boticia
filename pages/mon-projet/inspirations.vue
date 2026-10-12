<template>
  <div />
</template>

<script setup lang="ts">
// Ancien onglet : les inspirations vivent désormais dans la frise de
// « Mon Projet ». La page reste pour les anciens liens.
definePageMeta({
  ssr: false,
  middleware: [
    (to) =>
      navigateTo(
        {
          path: to.path.replace(/\/inspirations\/?$/, ""),
          query: { etape: "inspirations" },
        },
        { replace: true }
      ),
  ],
});
</script>
