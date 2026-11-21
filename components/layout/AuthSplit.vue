<template>
  <div
    class="min-h-dvh md:h-screen flex flex-col md:grid md:grid-cols-2 bg-white
      font-body md:overflow-hidden"
  >
    <!-- Nom en texte sur fond uni (plus d'image de logo, comme l'en-tête) :
         bandeau en mobile, demi-écran en desktop -->
    <div
      class="bg-cream-light flex items-center justify-center py-5 md:p-16"
    >
      <!-- Le nom ramène à l'accueil (comme l'en-tête du site) -->
      <NuxtLink
        :to="localePath('/')"
        :aria-label="$t('login_page.back')"
        class="block text-center transition-opacity hover:opacity-80"
      >
        <span
          class="block font-heading font-medium tracking-tight uppercase
            text-dark text-2xl md:text-5xl"
        >
          Boticia
        </span>
        <span
          class="block whitespace-nowrap text-orange-500 text-sm md:text-lg
            mt-1 md:mt-2"
        >
          {{ $t("app.tagline") }}
        </span>
      </NuxtLink>
    </div>

    <!-- Contenu -->
    <div
      class="flex-1 flex flex-col px-6 md:px-16 pt-10 pb-8 md:py-10 md:overflow-y-auto"
    >
      <div class="md:flex-1 md:flex md:items-center md:py-10">
        <div class="w-full max-w-sm mx-auto">
          <slot />
        </div>
      </div>

      <div v-if="$slots.footer" class="w-full max-w-sm mx-auto mt-auto pt-12 md:pt-0">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Mise en page commune aux pages de connexion (login, confirmation du lien).
const localePath = useLocalePath();
</script>
