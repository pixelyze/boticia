<template>
  <section class="bg-cream overflow-hidden min-h-screen flex items-start">
    <div class="container mx-auto px-6 pt-4 md:pt-8">
      <div class="max-w-3xl mx-auto text-center">
        <!-- Logo -->
        <div class="flex justify-center mb-10">
          <img
            :src="logo"
            alt="Boticia"
            class="h-48 md:h-64 lg:h-72 w-auto"
          />
        </div>

        <!-- Title -->
        <h1 class="hero-title mb-10">
          {{ $t('hero.title') }}
        </h1>

        <!-- Subtitle -->
        <p class="max-w-2xl mx-auto font-heading text-base md:text-lg tracking-wide text-terracotta italic">
          {{ $t('hero.subtitle') }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
const { logo } = useSiteLogo();
</script>
