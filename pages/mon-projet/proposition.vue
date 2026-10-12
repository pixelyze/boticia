<template>
  <div />
</template>

<script setup lang="ts">
// Ancien onglet : le devis vit désormais dans la frise de « Mon Projet ».
// La page reste pour les liens déjà envoyés par email.
definePageMeta({
  ssr: false,
  middleware: [
    (to) =>
      navigateTo(
        {
          path: to.path.replace(/\/proposition\/?$/, ""),
          query: { etape: "devis" },
        },
        { replace: true }
      ),
  ],
});
</script>
