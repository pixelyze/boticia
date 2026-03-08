<template>
  <footer class="bg-white text-dark py-12">
    <div class="px-4 sm:px-10">
      <div class="bg-cream-light rounded-[2rem] py-12 sm:py-20 px-4 sm:px-6">
      <div class="max-w-2xl mx-auto text-center">
        <!-- Logo -->
        <NuxtLink v-if="!isHomePage" :to="localePath('/')" aria-label="Back to home">
          <img :src="logo" alt="Boticia" class="h-24 mx-auto mb-6" />
        </NuxtLink>
        <img v-else :src="logo" alt="Boticia" class="h-24 mx-auto mb-6" />

        <span class="font-heading text-2xl text-dark">Boticia</span>

        <!-- Description -->
        <p class="text-dark/80 text-base leading-relaxed max-w-sm mx-auto mt-4">
          {{ $t("footer.description") }}
        </p>

        <!-- Social links -->
        <nav aria-label="R\u00e9seaux sociaux" class="flex flex-wrap justify-center gap-4 sm:gap-8 mt-8 sm:mt-12">
          <a
            href="https://instagram.com/boticia_"
            target="_blank"
            rel="noopener noreferrer"
            class="text-dark/80 hover:text-dark text-base border-b border-dark/40 hover:border-dark/60 pb-0.5 transition-all duration-300"
          >Instagram</a>
          <a
            href="https://www.linkedin.com/in/la%C3%ABtitia-schaeffer-cr%C3%A9atrice-florale/"
            target="_blank"
            rel="noopener noreferrer"
            class="text-dark/80 hover:text-dark text-base border-b border-dark/40 hover:border-dark/60 pb-0.5 transition-all duration-300"
          >LinkedIn</a>
          <a
            href="https://www.facebook.com/BoticiaParis/"
            target="_blank"
            rel="noopener noreferrer"
            class="text-dark/80 hover:text-dark text-base border-b border-dark/40 hover:border-dark/60 pb-0.5 transition-all duration-300"
          >Facebook</a>
          <a
            href="https://fr.pinterest.com/Boticia_Paris/"
            target="_blank"
            rel="noopener noreferrer"
            class="text-dark/80 hover:text-dark text-base border-b border-dark/40 hover:border-dark/60 pb-0.5 transition-all duration-300"
          >Pinterest</a>
        </nav>

        <!-- Legal links -->
        <nav aria-label="Liens l\u00e9gaux" class="mt-10 sm:mt-16">
          <div class="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm sm:text-base">
            <NuxtLink
              v-if="!isAboutPage"
              :to="localePath('/about')"
              class="text-dark/70 hover:text-dark transition-colors duration-300"
            >
              {{ $t("footer.about_link") }}
            </NuxtLink>
            <span v-else class="text-dark/70">
              {{ $t("footer.about_link") }}
            </span>
            <NuxtLink
              v-if="!isFaqPage"
              :to="localePath('/faq')"
              class="text-dark/70 hover:text-dark transition-colors duration-300"
            >
              {{ $t("footer.faq_link") }}
            </NuxtLink>
            <span v-else class="text-dark/70">
              {{ $t("footer.faq_link") }}
            </span>
            <NuxtLink
              v-if="!isLegalPage"
              :to="localePath('/legal')"
              class="text-dark/70 hover:text-dark transition-colors duration-300"
            >
              {{ $t("footer.legal_link") }}
            </NuxtLink>
            <span v-else class="text-dark/70">
              {{ $t("footer.legal_link") }}
            </span>
          </div>
        </nav>
      </div>
      </div>

      <!-- Copyright outside colored block -->
      <p class="text-dark/50 text-sm text-center mt-6">
        {{ $t("footer.copyright") }}
      </p>
    </div>
  </footer>
</template>

<script setup>
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const localePath = useLocalePath();
const route = useRoute();
const { logo } = useSiteLogo();

const isHomePage = computed(() => route.path === '/' || route.path === localePath('/'));
const isAboutPage = computed(() => route.path.includes('about'));
const isFaqPage = computed(() => route.path.includes('faq'));
const isLegalPage = computed(() => route.path.includes('legal'));
</script>
