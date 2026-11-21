<template>
  <!-- [COMP-FOOTER-MINIMAL] — Pied de page minimaliste : demande de devis,
       espace client, tableau de bord. Marque, lignes du héros, copyright et
       mentions légales seulement : pas de liens de sortie (réseaux, pages). -->
  <footer class="bg-white text-dark py-12 font-body">
    <div class="px-4 sm:px-10">
      <div class="bg-cream-light rounded-[2rem] py-12 sm:py-16 px-4 sm:px-6">
      <div class="max-w-2xl mx-auto text-center">
        <span class="font-heading text-2xl text-dark uppercase">Boticia</span>

        <!-- Subtitle -->
        <p class="para mt-2">
          {{ $t("footer.subtitle") }}
        </p>

        <!-- Services : mêmes textes que le héros (hero.*), pour rester
             identiques si on les modifie -->
        <p class="section-tagline !block mt-5 leading-relaxed">
          {{ $t("hero.heading_trade") }}<span class="hidden md:inline">
            · </span
          ><br class="md:hidden" />{{ $t("hero.heading_places") }}
        </p>
        <p class="section-tagline !block mt-1">
          {{ $t("hero.line_1") }}
        </p>
      </div>
      </div>

      <!-- Copyright + legal link -->
      <p class="text-gray-500 text-sm text-center mt-6">
        {{ $t("footer.copyright") }}
        <span class="text-dark/20 mx-1">·</span>
        <NuxtLink
          v-if="!isLegalPage"
          :to="localePath('legal')"
          class="text-gray-500 hover:text-dark underline underline-offset-2 transition-colors duration-300"
        >
          {{ $t("footer.legal_link") }}
        </NuxtLink>
        <span v-else>{{ $t("footer.legal_link") }}</span>
      </p>
    </div>
  </footer>
</template>

<script setup>
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const localePath = useLocalePath();
const route = useRoute();

const isLegalPage = computed(() => route.path.includes('legal'));
</script>
