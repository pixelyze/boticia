<template>
  <section class="relative bg-black text-white overflow-hidden">
    <div class="container mx-auto px-6 py-24 md:py-32 lg:py-40">
      <div class="max-w-3xl mx-auto text-center">
        <!-- Tagline -->
        <p class="text-sm md:text-base uppercase tracking-[0.3em] text-gray-400 mb-6">
          {{ $t('hero.tagline') }}
        </p>

        <!-- Title -->
        <h1 class="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
          {{ $t('hero.title') }}
        </h1>

        <!-- Subtitle -->
        <p class="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
          {{ $t('hero.subtitle') }}
        </p>

        <!-- CTAs -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="default" rightIcon="MoveRight" :to="localePath('/dashboard')">
            {{ $t('hero.cta_primary') }}
          </Button>
          <Button variant="ghost" class="!text-white !bg-white/10 hover:!bg-white/20">
            {{ $t('hero.cta_secondary') }}
          </Button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const localePath = useLocalePath();
</script>
