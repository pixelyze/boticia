<template>
  <section class="py-20 md:py-28 bg-white">
    <div class="container mx-auto px-6">
      <div class="max-w-3xl mx-auto text-center">
        <span class="section-tagline">{{ $t('intro.tagline') }}</span>
        <h2 class="section-title-lg">{{ $t('intro.title') }}</h2>
        <p class="feature-description mt-6 max-w-2xl mx-auto">
          {{ $t('intro.description') }}
        </p>
        <div class="mt-10">
          <Button variant="ghost" rightIcon="MoveRight" :to="localePath('/creations')">
            {{ $t('intro.cta') }}
          </Button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const localePath = useLocalePath();
</script>
