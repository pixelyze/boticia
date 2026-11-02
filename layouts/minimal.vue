<template>
  <!-- overflow-x-clip : rien ne doit dépasser en largeur, sinon Safari iOS
       dézoome toute la page (blanc à droite). « clip » et non « hidden »
       pour garder l'en-tête collant (sticky). -->
  <div class="min-h-screen flex flex-col bg-white overflow-x-clip selection:bg-fuchsia-300 selection:text-fuchsia-900">
    <!-- Top bar pill -->
    <header class="bg-transparent pt-4 pb-4 sticky top-0 z-50">
      <!-- Mobile : mêmes marges que l'en-tête principal (16 px), bouton
           retour collé au bord de la pastille. Desktop inchangé. -->
      <div class="px-4 md:px-10">
        <div class="rounded-full bg-cream-light px-2 py-2 md:px-8 md:py-4 flex items-center justify-between">
          <NuxtLink :to="localePath('/')" class="w-10 h-10 rounded-full bg-cream-dark flex items-center justify-center text-gray-500 hover:text-gray-600 transition-all">
            <IconLucid name="ArrowLeft" size="sm" />
          </NuxtLink>
          <span class="font-heading font-medium text-xl tracking-tight text-dark uppercase">
            Boticia
          </span>
          <div class="w-10"></div>
        </div>
      </div>
    </header>
    <main id="main-content" class="flex-1">
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script setup>
const localePath = useLocalePath();
</script>
