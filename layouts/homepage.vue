<template>
  <div class="min-h-screen selection:bg-fuchsia-300 selection:text-fuchsia-900 flex flex-col">
    <Header />
    <main id="main-content" class="flex-1">
      <slot />
    </main>
    <Footer class="flex-shrink-0" />

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
        <div class="bg-dark text-cream rounded-t-2xl px-6 py-3 border-t-2 border-dark/10">
          <NuxtLink
            :to="localePath('/devis')"
            class="block w-full text-center text-sm font-semibold uppercase tracking-[0.15em] py-2"
          >
            {{ $t("nav.quote") }}
          </NuxtLink>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
const localePath = useLocalePath();
const { show: showCta } = useMobileCta();
</script>
