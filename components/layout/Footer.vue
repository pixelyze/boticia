<template>
  <footer class="bg-black text-white py-16 relative overflow-hidden">
    <div class="container mx-auto px-4">
      <!-- Logo and description -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div
          class="md:col-span-8 md:col-start-1 flex flex-col md:flex-row items-center md:items-center gap-6"
        >
          <div class="shrink-0 flex items-center">
            <NuxtLink v-if="!isHomePage" :to="localePath('/')" aria-label="Back to home">
              <img
                src="~/assets/img/logo-dark.svg"
                alt="Logo"
                class="h-16"
              />
            </NuxtLink>
            <img
              v-else
              src="~/assets/img/logo-dark.svg"
              alt="Logo"
              class="h-16"
            />
          </div>

          <p
            class="text-gray-300 text-md md:text-lg font-light tracking-wide leading-relaxed border-l-2 border-gray-600 pl-4 max-w-md"
          >
            {{ $t("footer.description") }}
          </p>
        </div>

        <!-- Social links -->
        <div
          class="md:col-span-4 flex justify-center md:justify-end items-start mt-8 md:mt-0"
        >
          <div class="flex items-center space-x-3 group">
            <a
              href="https://twitter.com/yourhandle"
              target="_blank"
              rel="noopener noreferrer"
              class="text-gray-400 hover:text-white transition-all duration-300 font-medium tracking-wider uppercase text-sm flex items-center"
            >
              <span class="border-b border-gray-700 hover:border-white pb-1"
                >Twitter</span
              >
              <span
                class="ml-2 transform group-hover:translate-x-1 transition-transform duration-200"
                >&rarr;</span
              >
            </a>
          </div>
        </div>
      </div>

      <!-- Copyright -->
      <div
        class="mt-8 md:mt-12 flex flex-col md:flex-row justify-between items-center"
      >
        <div class="hidden md:block w-1/3 h-px bg-gray-600"></div>
        <p
          class="text-gray-400 text-xs tracking-widest uppercase py-2 font-medium"
        >
          {{ $t("footer.copyright") }}
        </p>
        <div class="hidden md:block w-1/3 h-px bg-gray-600"></div>
      </div>
      <!-- Legal links -->
      <div class="mt-8 md:mt-12 text-center">
        <p class="text-gray-400 text-sm font-light max-w-2xl mx-auto">
          {{ $t("footer.privacy") }}
        </p>
        <div class="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 mt-4">
          <NuxtLink
            v-if="!isLegalPage"
            :to="localePath('/legal')"
            class="text-gray-500 text-xs uppercase tracking-widest hover:text-white transition-colors duration-300"
          >
            {{ $t("footer.legal_link") }}
          </NuxtLink>
          <span v-else class="text-gray-300 text-xs uppercase tracking-widest">
            {{ $t("footer.legal_link") }}
          </span>
          <span class="hidden md:inline text-gray-600">&bull;</span>
          <NuxtLink
            v-if="!isTermsPage"
            :to="localePath('/terms')"
            class="text-gray-500 text-xs uppercase tracking-widest hover:text-white transition-colors duration-300"
          >
            {{ $t("footer.terms_link") }}
          </NuxtLink>
          <span v-else class="text-gray-300 text-xs uppercase tracking-widest">
            {{ $t("footer.terms_link") }}
          </span>
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
