<template>
  <section class="bg-cream-light overflow-hidden h-screen max-h-[900px] flex items-center -mt-32">
    <div class="container mx-auto px-6">
      <div class="max-w-3xl mx-auto text-center">
        <!-- Logo -->
        <div class="flex justify-center mb-6 md:mb-10">
          <img
            :src="logo"
            alt="Boticia"
            class="h-36 md:h-64 lg:h-72 w-auto"
          />
        </div>

        <!-- Title -->
        <h1 class="hero-title mb-6 md:mb-10">
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
