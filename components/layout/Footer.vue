<template>
  <footer class="bg-cream text-dark py-24">
    <div class="container mx-auto px-6">
      <div class="max-w-2xl mx-auto text-center">
        <!-- Logo -->
        <NuxtLink v-if="!isHomePage" :to="localePath('/')" aria-label="Back to home">
          <img src="/logo-boticia.png" alt="Boticia" class="h-24 mx-auto mb-6" />
        </NuxtLink>
        <img v-else src="/logo-boticia.png" alt="Boticia" class="h-24 mx-auto mb-6" />

        <span class="font-heading text-2xl text-dark">Boticia</span>

        <!-- Description -->
        <p class="text-dark/60 text-base leading-relaxed max-w-sm mx-auto mt-4">
          {{ $t("footer.description") }}
        </p>

        <!-- Social links -->
        <div class="flex justify-center gap-8 mt-12">
          <a
            href="https://instagram.com/boticia_"
            target="_blank"
            rel="noopener noreferrer"
            class="text-dark/60 hover:text-dark text-base border-b border-dark/30 hover:border-dark/50 pb-0.5 transition-all duration-300"
          >Instagram</a>
          <a
            href="https://www.linkedin.com/in/la%C3%ABtitia-schaeffer-cr%C3%A9atrice-florale/"
            target="_blank"
            rel="noopener noreferrer"
            class="text-dark/60 hover:text-dark text-base border-b border-dark/30 hover:border-dark/50 pb-0.5 transition-all duration-300"
          >LinkedIn</a>
          <a
            href="https://www.facebook.com/BoticiaParis/"
            target="_blank"
            rel="noopener noreferrer"
            class="text-dark/60 hover:text-dark text-base border-b border-dark/30 hover:border-dark/50 pb-0.5 transition-all duration-300"
          >Facebook</a>
          <a
            href="https://fr.pinterest.com/Boticia_Paris/"
            target="_blank"
            rel="noopener noreferrer"
            class="text-dark/60 hover:text-dark text-base border-b border-dark/30 hover:border-dark/50 pb-0.5 transition-all duration-300"
          >Pinterest</a>
        </div>

        <!-- Legal & Copyright -->
        <div class="mt-16 space-y-2">
          <div class="flex justify-center gap-6 text-base">
            <NuxtLink
              v-if="!isLegalPage"
              :to="localePath('/legal')"
              class="text-dark/50 hover:text-dark transition-colors duration-300"
            >
              {{ $t("footer.legal_link") }}
            </NuxtLink>
            <span v-else class="text-dark/60">
              {{ $t("footer.legal_link") }}
            </span>
            <NuxtLink
              v-if="!isTermsPage"
              :to="localePath('/terms')"
              class="text-dark/50 hover:text-dark transition-colors duration-300"
            >
              {{ $t("footer.terms_link") }}
            </NuxtLink>
            <span v-else class="text-dark/60">
              {{ $t("footer.terms_link") }}
            </span>
          </div>
          <p class="text-dark/40 text-base">
            {{ $t("footer.copyright") }}
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const localePath = useLocalePath();
const route = useRoute();

const isHomePage = computed(() => route.path === '/' || route.path === localePath('/'));
const isLegalPage = computed(() => route.path.includes('legal'));
const isTermsPage = computed(() => route.path.includes('terms'));
</script>
