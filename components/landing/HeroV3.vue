<template>
  <section class="relative h-screen max-h-[900px] -mt-32 overflow-hidden">
    <!-- Background photo -->
    <img
      src="/bouquet_mariee_boticia._1.webp"
      alt="Boticia"
      fetchpriority="high"
      class="absolute inset-0 w-full h-full object-cover"
    />

    <!-- Overlay -->
    <div class="absolute inset-0 bg-dark/40" />

    <!-- Content -->
    <div class="relative h-full flex items-center justify-center">
      <div class="text-center px-6">
        <!-- Small tagline -->
        <p class="text-cream/60 text-xs md:text-sm uppercase tracking-[0.4em] mb-6">
          Créatrice d'ambiance florale
        </p>

        <!-- Title -->
        <h1 class="font-heading text-5xl md:text-7xl lg:text-8xl font-medium text-cream leading-none mb-6">
          Boticia
        </h1>

        <!-- Subtitle -->
        <p class="max-w-lg mx-auto text-cream/70 text-base md:text-lg leading-relaxed mb-10">
          {{ $t('hero.subtitle') }}
        </p>

        <!-- CTA -->
        <a
          :href="localePath('/devis')"
          class="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-cream text-dark text-sm font-semibold hover:bg-white transition-all"
        >
          {{ $t('weddings.cta') }}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </a>
      </div>
    </div>

    <!-- Scroll indicator -->
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2">
      <div class="w-6 h-10 rounded-full border-2 border-cream/30 flex items-start justify-center pt-2">
        <div class="w-1 h-2 rounded-full bg-cream/50 animate-bounce" />
      </div>
    </div>
  </section>
</template>

<script setup>
const localePath = useLocalePath();
</script>
