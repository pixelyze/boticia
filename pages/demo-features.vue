<template>
  <div class="bg-white">
    <div class="container mx-auto px-6 py-16 text-center">
      <h1 class="font-heading text-4xl font-bold text-dark mb-2">Propositions Notre savoir-faire</h1>
      <p class="text-dark/50 text-sm">3 directions premium et élégantes</p>
    </div>

    <!-- ===================== PROPOSITION A ===================== -->
    <div class="mb-4 px-6">
      <p class="text-center text-xs uppercase tracking-[0.3em] text-dark/40 mb-4">Proposition A — Lignes horizontales éditorial</p>
    </div>

    <section class="py-20 md:py-28 bg-white">
      <div class="container mx-auto px-6">
        <div class="text-center mb-20">
          <span class="text-sm uppercase tracking-[0.3em] text-dark/60">Notre savoir-faire</span>
          <h2 class="font-heading text-2xl md:text-4xl font-bold mt-4 text-dark">L'art floral au service de vos émotions</h2>
        </div>

        <div class="max-w-5xl mx-auto divide-y divide-dark/8">
          <div class="grid grid-cols-1 md:grid-cols-12 gap-6 py-12 md:py-16 items-baseline">
            <div class="md:col-span-4">
              <h3 class="font-heading text-2xl text-dark">Fleurs françaises</h3>
            </div>
            <div class="md:col-span-8">
              <p class="text-dark/55 leading-relaxed">
                Nous privilégions les fleurs cultivées en France, en circuit court, pour une fraîcheur incomparable et un impact écologique réduit.
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-12 gap-6 py-12 md:py-16 items-baseline">
            <div class="md:col-span-4">
              <h3 class="font-heading text-2xl text-dark">Créations sur mesure</h3>
            </div>
            <div class="md:col-span-8">
              <p class="text-dark/55 leading-relaxed">
                Chaque composition est unique, pensée et réalisée à la main selon vos envies, votre thème et votre lieu de réception.
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-12 gap-6 py-12 md:py-16 items-baseline">
            <div class="md:col-span-4">
              <h3 class="font-heading text-2xl text-dark">Approche éco-responsable</h3>
            </div>
            <div class="md:col-span-8">
              <p class="text-dark/55 leading-relaxed">
                Des pratiques durables à chaque étape : fleurs de saison, zéro mousse florale synthétique, supports réutilisables.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===================== PROPOSITION B ===================== -->
    <div class="mt-20 mb-4 px-6">
      <p class="text-center text-xs uppercase tracking-[0.3em] text-dark/40 mb-4">Proposition B — Colonnes aérées sur fond crème</p>
    </div>

    <section class="py-20 md:py-28 bg-cream">
      <div class="container mx-auto px-6">
        <div class="text-center mb-20">
          <span class="text-sm uppercase tracking-[0.3em] text-dark/60">Notre savoir-faire</span>
          <h2 class="font-heading text-2xl md:text-4xl font-bold mt-4 text-dark">L'art floral au service de vos émotions</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-0 max-w-5xl mx-auto">
          <div class="px-10 py-14 text-center md:border-r border-dark/8">
            <IconLucid name="Flower2" size="lg" class="text-sage mx-auto mb-6" :stroke-width="1.2" />
            <h3 class="font-heading text-xl text-dark">Fleurs françaises</h3>
            <p class="text-dark/50 text-sm leading-relaxed mt-4 max-w-xs mx-auto">
              Nous privilégions les fleurs cultivées en France, en circuit court, pour une fraîcheur incomparable et un impact écologique réduit.
            </p>
          </div>

          <div class="px-10 py-14 text-center md:border-r border-dark/8">
            <IconLucid name="Palette" size="lg" class="text-sage mx-auto mb-6" :stroke-width="1.2" />
            <h3 class="font-heading text-xl text-dark">Créations sur mesure</h3>
            <p class="text-dark/50 text-sm leading-relaxed mt-4 max-w-xs mx-auto">
              Chaque composition est unique, pensée et réalisée à la main selon vos envies, votre thème et votre lieu de réception.
            </p>
          </div>

          <div class="px-10 py-14 text-center">
            <IconLucid name="Leaf" size="lg" class="text-sage mx-auto mb-6" :stroke-width="1.2" />
            <h3 class="font-heading text-xl text-dark">Approche éco-responsable</h3>
            <p class="text-dark/50 text-sm leading-relaxed mt-4 max-w-xs mx-auto">
              Des pratiques durables à chaque étape : fleurs de saison, zéro mousse florale synthétique, supports réutilisables.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===================== PROPOSITION C ===================== -->
    <div class="mt-20 mb-4 px-6">
      <p class="text-center text-xs uppercase tracking-[0.3em] text-dark/40 mb-4">Proposition C — Grande typo alternée</p>
    </div>

    <section class="py-20 md:py-28 bg-white">
      <div class="container mx-auto px-6">
        <div class="text-center mb-20">
          <span class="text-sm uppercase tracking-[0.3em] text-dark/60">Notre savoir-faire</span>
          <h2 class="font-heading text-2xl md:text-4xl font-bold mt-4 text-dark">L'art floral au service de vos émotions</h2>
        </div>

        <div class="max-w-4xl mx-auto space-y-24 md:space-y-28">
          <!-- Feature 1 — left -->
          <div class="max-w-xl">
            <span class="text-xs uppercase tracking-[0.2em] text-terracotta block mb-3">01</span>
            <h3 class="font-heading text-2xl md:text-3xl text-dark leading-snug">Fleurs françaises</h3>
            <p class="text-dark/50 text-base leading-relaxed mt-4">
              Nous privilégions les fleurs cultivées en France, en circuit court, pour une fraîcheur incomparable et un impact écologique réduit.
            </p>
          </div>

          <!-- Feature 2 — right on desktop -->
          <div class="max-w-xl md:ml-auto md:text-right">
            <span class="text-xs uppercase tracking-[0.2em] text-terracotta block mb-3">02</span>
            <h3 class="font-heading text-2xl md:text-3xl text-dark leading-snug">Créations sur mesure</h3>
            <p class="text-dark/50 text-base leading-relaxed mt-4">
              Chaque composition est unique, pensée et réalisée à la main selon vos envies, votre thème et votre lieu de réception.
            </p>
          </div>

          <!-- Feature 3 — left -->
          <div class="max-w-xl">
            <span class="text-xs uppercase tracking-[0.2em] text-terracotta block mb-3">03</span>
            <h3 class="font-heading text-2xl md:text-3xl text-dark leading-snug">Approche éco-responsable</h3>
            <p class="text-dark/50 text-base leading-relaxed mt-4">
              Des pratiques durables à chaque étape : fleurs de saison, zéro mousse florale synthétique, supports réutilisables.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'minimal',
});
</script>
