<template>
  <section class="bg-cream overflow-hidden min-h-screen flex items-center">
    <div class="container mx-auto px-6 pb-36">
      <div class="max-w-3xl mx-auto text-center">
        <!-- Logo -->
        <div class="flex justify-center mb-10">
          <img
            src="/logo-boticia.png"
            alt="Boticia"
            class="h-48 md:h-64 lg:h-72 w-auto"
          />
        </div>

        <!-- Title -->
        <h1 class="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-dark">
          {{ $t('hero.title') }}
        </h1>

        <!-- Subtitle -->
        <p class="text-lg md:text-xl text-dark/60 max-w-2xl mx-auto">
          {{ $t('hero.subtitle') }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
const localePath = useLocalePath();
</script>
