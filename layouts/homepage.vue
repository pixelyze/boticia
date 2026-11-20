<template>
  <div
    class="min-h-screen selection:bg-fuchsia-300 selection:text-fuchsia-900 flex flex-col font-body"
  >
    <Header />
    <!-- Sous l'en-tête fixe : 92 px sur mobile (pas de ligne des langues),
         128 px dès md. HeroSection compense avec la même valeur négative. -->
    <main id="main-content" class="flex-1 pt-[92px] md:pt-32">
      <slot />
    </main>
    <!-- v1 gardée de côté : <Footer /> -->
    <FooterV2 class="flex-shrink-0" />

    <!-- Sticky mobile CTA -->
    <Transition
      enter-active-class="transition-transform duration-300 ease-out"
      enter-from-class="translate-y-full"
      enter-to-class="translate-y-0"
      leave-active-class="transition-transform duration-200 ease-in"
      leave-from-class="translate-y-0"
      leave-to-class="translate-y-full"
    >
      <div
        v-if="showCta"
        class="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        style="padding-bottom: env(safe-area-inset-bottom, 0px)"
      >
        <!-- Barre pleine largeur, angles droits, bouton éditorial -->
        <div class="bg-dark px-6 py-2">
          <Button
            variant="cta"
            :to="localePath('/devis')"
            class="w-full justify-center !py-3"
          >
            {{ $t("nav.quote") }}
          </Button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
const localePath = useLocalePath();
const { show: showCta } = useMobileCta();
</script>
