<template>
  <section class="py-20 md:py-28 bg-white overflow-hidden">
    <div class="container mx-auto px-6 mb-12">
      <div class="text-center">
        <span class="section-tagline">{{ $t('testimonials.tagline') }}</span>
        <h2 class="section-title-lg">{{ $t('testimonials.title') }}</h2>
      </div>
    </div>

    <!-- Marquee pleine largeur -->
    <div class="relative">
      <!-- Masques dégradés gauche/droite -->
      <div class="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-white to-transparent sm:w-32" />
      <div class="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-white to-transparent sm:w-32" />

      <!-- Track défilant — dupliqué pour boucle infinie -->
      <div class="flex w-max animate-marquee gap-5 hover:[animation-play-state:paused]">
        <template v-for="loop in 2" :key="loop">
          <blockquote
            v-for="(item, index) in testimonials"
            :key="`${loop}-${index}`"
            class="flex w-[320px] shrink-0 flex-col justify-between rounded-2xl border border-dark/10 bg-cream/30 p-7 sm:w-[380px]"
          >
            <p class="leading-relaxed text-dark/70 italic">
              « {{ item.text }} »
            </p>
            <footer class="mt-6 flex items-center gap-3 border-t border-dark/10 pt-4">
              <div class="flex h-9 w-9 items-center justify-center rounded-full bg-dark text-sm font-medium text-white shrink-0">
                {{ item.name.charAt(0) }}
              </div>
              <div>
                <p class="text-sm font-medium text-dark">{{ item.name }}</p>
                <p v-if="item.location" class="text-xs text-dark/50">{{ item.location }}</p>
              </div>
            </footer>
          </blockquote>
        </template>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const testimonials = computed(() => [
  {
    text: t("testimonials.items.0.text"),
    name: t("testimonials.items.0.name"),
    location: t("testimonials.items.0.location"),
  },
  {
    text: t("testimonials.items.1.text"),
    name: t("testimonials.items.1.name"),
    location: t("testimonials.items.1.location"),
  },
  {
    text: t("testimonials.items.2.text"),
    name: t("testimonials.items.2.name"),
    location: t("testimonials.items.2.location"),
  },
  {
    text: t("testimonials.items.3.text"),
    name: t("testimonials.items.3.name"),
    location: t("testimonials.items.3.location"),
  },
  {
    text: t("testimonials.items.4.text"),
    name: t("testimonials.items.4.name"),
    location: t("testimonials.items.4.location"),
  },
]);
</script>
