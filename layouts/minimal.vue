<template>
  <div class="min-h-screen flex flex-col bg-white selection:bg-fuchsia-300 selection:text-fuchsia-900">
    <!-- Top bar pill -->
    <header class="bg-transparent pt-4 pb-4 sticky top-0 z-50">
      <div class="px-10">
        <div class="rounded-full border-2 border-dark/10 bg-cream px-8 py-4 flex items-center justify-between">
          <NuxtLink :to="localePath('/')" class="w-10 h-10 rounded-full border-2 border-dark/10 flex items-center justify-center text-dark/30 hover:text-dark/60 hover:border-dark/30 transition-all">
            <IconLucid name="ArrowLeft" size="sm" />
          </NuxtLink>
          <span class="font-heading font-medium text-xl tracking-tight text-dark">
            Boticia
          </span>
          <div class="w-10"></div>
        </div>
      </div>
    </header>
    <main class="flex-1">
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script setup>
const localePath = useLocalePath();
</script>
