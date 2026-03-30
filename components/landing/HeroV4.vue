<template>
  <section class="bg-cream-light overflow-hidden min-h-screen max-h-[900px] -mt-32 flex items-center">
    <div class="w-full grid grid-cols-1 md:grid-cols-2 min-h-screen max-h-[900px]">
      <!-- Left: Text -->
      <div class="flex items-center justify-center px-8 md:px-16 lg:px-24 py-32 md:py-0 order-2 md:order-1">
        <div class="max-w-md">
          <p class="text-xs uppercase tracking-[0.4em] text-dark/35 mb-6">
            {{ $t('app.tagline') }}
          </p>
          <h1 class="font-heading text-4xl md:text-5xl lg:text-6xl font-medium text-dark leading-[1.1] mb-6">
            {{ $t('hero.title') }}
          </h1>
          <p class="text-dark/50 text-base md:text-lg leading-relaxed mb-10 max-w-sm">
            {{ $t('hero.subtitle') }}
          </p>
          <div class="flex items-center gap-4">
            <NuxtLink
              :to="localePath('/devis')"
              class="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-dark text-cream text-sm font-semibold hover:bg-dark/85 transition-all"
            >
              {{ $t('weddings.cta') }}
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </NuxtLink>
            <NuxtLink
              :to="localePath('/creations')"
              class="text-sm font-semibold text-dark/50 hover:text-dark border-b border-dark/20 hover:border-dark/40 pb-0.5 transition-all"
            >
              {{ $t('intro.cta') }}
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Right: Image -->
      <div class="relative order-1 md:order-2 h-[50vh] md:h-auto">
        <img
          src="/bouquet_mariee_boticia._1.webp"
          alt="Boticia"
          fetchpriority="high"
          class="absolute inset-0 w-full h-full object-cover"
        />
        <!-- Organic overlay shape on left edge -->
        <div class="hidden md:block absolute inset-y-0 left-0 w-24">
          <svg viewBox="0 0 100 900" preserveAspectRatio="none" class="h-full w-full">
            <path d="M100 0 C 60 150, 80 300, 40 450 C 0 600, 70 750, 100 900 L 0 900 L 0 0 Z" fill="#EDE9E3" />
          </svg>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const localePath = useLocalePath();
</script>
