<template>
  <div class="container mx-auto px-6 py-16 max-w-3xl">
    <h1 class="page-title">{{ t("legal.title") }}</h1>
    <p class="page-subtitle mb-12">
      {{ t("legal.subtitle") }}
    </p>

    <div class="space-y-10">
      <!-- Éditeur -->
      <section>
        <h2 class="section-title">
          {{ t("legal.editor_title") }}
        </h2>
        <div class="body-text space-y-1">
          <p>{{ t("legal.editor_name") }}</p>
          <p>{{ t("legal.editor_status") }}</p>
          <p>{{ t("legal.editor_address") }}</p>
          <p>{{ t("legal.editor_email") }}</p>
          <p>{{ t("legal.editor_director") }}</p>
        </div>
      </section>

      <!-- Hébergeur -->
      <section>
        <h2 class="section-title">
          {{ t("legal.host_title") }}
        </h2>
        <div class="body-text space-y-1">
          <p>{{ t("legal.host_name") }}</p>
          <p>{{ t("legal.host_address") }}</p>
          <p>{{ t("legal.host_url") }}</p>
        </div>
      </section>

      <!-- Propriété intellectuelle -->
      <section>
        <h2 class="section-title">
          {{ t("legal.ip_title") }}
        </h2>
        <p class="body-text">{{ t("legal.ip_text") }}</p>
      </section>

      <!-- Données personnelles -->
      <section>
        <h2 class="section-title">
          {{ t("legal.data_title") }}
        </h2>
        <p class="body-text">{{ t("legal.data_text") }}</p>
        <p class="body-text mt-4">
          {{ t("legal.data_rights") }}
        </p>
      </section>

      <!-- Cookies -->
      <section>
        <h2 class="section-title">
          {{ t("legal.cookies_title") }}
        </h2>
        <p class="body-text">
          {{ t("legal.cookies_text") }}
        </p>
      </section>

      <!-- Responsabilité -->
      <section>
        <h2 class="section-title">
          {{ t("legal.liability_title") }}
        </h2>
        <p class="body-text">
          {{ t("legal.liability_text") }}
        </p>
      </section>

      <!-- Droit applicable -->
      <section>
        <h2 class="section-title">
          {{ t("legal.law_title") }}
        </h2>
        <p class="body-text">{{ t("legal.law_text") }}</p>
      </section>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";

const { t } = useI18n();

definePageMeta({
  layout: "homepage",
  pageTransition: false,
});

useHead({
  title: t("legal.title") + " - Boticia",
  meta: [
    {
      key: "description",
      name: "description",
      content: t("seo.legal_description"),
    },
  ],
});
</script>
