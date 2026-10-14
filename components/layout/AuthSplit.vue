<template>
  <div
    class="min-h-dvh md:h-screen flex flex-col md:grid md:grid-cols-2 bg-white md:overflow-hidden"
  >
    <!-- Logo sur fond uni : bandeau en mobile, demi-écran en desktop -->
    <div
      class="bg-cream-light flex items-center justify-center py-10 md:p-16"
    >
      <!-- Le logo ramène à l'accueil (comme l'en-tête du site) -->
      <NuxtLink
        :to="localePath('/')"
        :aria-label="$t('login_page.back')"
        class="block w-28 md:w-full md:max-w-xs transition-opacity hover:opacity-80"
      >
        <img :src="logo" alt="Boticia" class="w-full" />
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
const { logo } = useSiteLogo();
</script>
