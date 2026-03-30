<template>
  <section class="relative bg-dark overflow-hidden min-h-screen max-h-[900px]">
    <!-- Background image with parallax feel -->
    <div class="absolute inset-0">
      <img
        src="/bouquet_mariee_boticia._1.webp"
        alt="Boticia"
        fetchpriority="high"
        class="w-full h-full object-cover scale-110 hero-zoom"
      />
      <div class="absolute inset-0 bg-dark/55" />
    </div>

    <!-- Floating petals particles -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="petal petal-1" />
      <div class="petal petal-2" />
      <div class="petal petal-3" />
      <div class="petal petal-4" />
      <div class="petal petal-5" />
    </div>

    <!-- Content -->
    <div class="relative h-screen max-h-[900px] flex flex-col items-center justify-center px-6">
      <!-- Title (H1 for SEO, visually the main statement) -->
      <h1 class="text-center mb-6 overflow-hidden">
        <span class="block font-heading text-3xl md:text-5xl lg:text-6xl font-medium text-cream leading-tight hero-slide hero-slide-1">
          {{ $t('hero.title') }}
        </span>
      </h1>

      <!-- Decorative line -->
      <div class="w-12 h-[2px] bg-cream/30 mb-6 hero-fade hero-fade-1" />

      <!-- Subtitle -->
      <p class="max-w-lg mx-auto text-cream/80 text-center text-base md:text-lg leading-relaxed mb-10 hero-fade hero-fade-2">
        {{ $t('hero.subtitle') }}
      </p>

      <!-- CTAs -->
      <div class="flex flex-col sm:flex-row items-center gap-4 hero-fade hero-fade-3">
        <NuxtLink
          :to="localePath('/devis')"
          class="group inline-flex items-center gap-3 px-10 py-4 rounded-full bg-cream text-dark text-base font-semibold hover:bg-white transition-all hover:shadow-lg hover:shadow-cream/20"
        >
          {{ $t('weddings.cta') }}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </NuxtLink>
        <NuxtLink
          :to="localePath('/creations')"
          class="inline-flex items-center gap-2 text-base text-cream/80 hover:text-cream transition-colors"
        >
          <span class="border-b border-cream/20 hover:border-cream/50 pb-0.5">{{ $t('intro.cta') }}</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Scroll indicator -->
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 hero-fade hero-fade-4">
      <div class="flex flex-col items-center gap-2">
        <span class="text-cream/25 text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <div class="w-[1px] h-8 bg-gradient-to-b from-cream/30 to-transparent scroll-line" />
      </div>
    </div>
  </section>
</template>

<script setup>
const localePath = useLocalePath();
</script>

<style scoped>
/* Zoom in on load */
.hero-zoom {
  animation: zoomIn 8s ease-out forwards;
}
@keyframes zoomIn {
  from { transform: scale(1.15); }
  to { transform: scale(1.05); }
}

/* Fade in staggered */
.hero-fade {
  opacity: 0;
  transform: translateY(15px);
  animation: fadeUp 0.8s ease-out forwards;
}
.hero-fade-1 { animation-delay: 0.3s; }
.hero-fade-2 { animation-delay: 0.5s; }
.hero-fade-3 { animation-delay: 0.7s; }
.hero-fade-4 { animation-delay: 0.9s; }
.hero-fade-5 { animation-delay: 1.2s; }

@keyframes fadeUp {
  to { opacity: 1; transform: translateY(0); }
}

/* Title slide up */
.hero-slide {
  opacity: 0;
  transform: translateY(100%);
  animation: slideUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.hero-slide-1 { animation-delay: 0.2s; }

@keyframes slideUp {
  to { opacity: 1; transform: translateY(0); }
}

/* Floating petals */
.petal {
  position: absolute;
  width: 8px;
  height: 8px;
  background: rgba(250, 248, 245, 0.1);
  border-radius: 50% 0 50% 0;
  animation: floatPetal linear infinite;
}
.petal-1 { left: 10%; top: -10%; animation-duration: 12s; animation-delay: 0s; width: 6px; height: 6px; }
.petal-2 { left: 30%; top: -10%; animation-duration: 15s; animation-delay: 2s; width: 10px; height: 10px; }
.petal-3 { left: 55%; top: -10%; animation-duration: 11s; animation-delay: 4s; width: 7px; height: 7px; }
.petal-4 { left: 75%; top: -10%; animation-duration: 14s; animation-delay: 1s; width: 9px; height: 9px; }
.petal-5 { left: 90%; top: -10%; animation-duration: 13s; animation-delay: 3s; width: 5px; height: 5px; }

@keyframes floatPetal {
  0% {
    transform: translateY(-10vh) rotate(0deg);
    opacity: 0;
  }
  10% { opacity: 0.6; }
  90% { opacity: 0.3; }
  100% {
    transform: translateY(110vh) rotate(360deg);
    opacity: 0;
  }
}

/* Scroll line pulse */
.scroll-line {
  animation: scrollPulse 2s ease-in-out infinite;
}
@keyframes scrollPulse {
  0%, 100% { opacity: 0.3; transform: scaleY(1); }
  50% { opacity: 0.7; transform: scaleY(1.3); }
}
</style>
