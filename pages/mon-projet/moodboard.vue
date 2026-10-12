<template>
  <div />
</template>

<script setup lang="ts">
// Ancien onglet : le moodboard vit désormais dans la frise de « Mon
// Projet ». La page reste pour les liens déjà envoyés par email.
definePageMeta({
  ssr: false,
  middleware: [
    (to) =>
      navigateTo(
        {
          path: to.path.replace(/\/moodboard\/?$/, ""),
          query: { etape: "moodboard" },
        },
        { replace: true }
      ),
  ],
});
</script>
