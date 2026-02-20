<template>
  <div
    class="min-h-screen bg-cream-light selection:bg-fuchsia-300
           selection:text-fuchsia-900 flex flex-col"
  >
    <!-- Header -->
    <header class="pt-8 pb-4">
      <div class="text-center">
        <NuxtLink
          to="/"
          class="font-heading font-medium text-3xl
                 tracking-tight text-dark inline-block"
        >
          Boticia
        </NuxtLink>
      </div>
    </header>

    <!-- Main -->
    <main class="flex-1 flex items-center justify-center px-6">
      <div class="text-center max-w-lg">
        <!-- Error code -->
        <span class="section-tagline">
          {{ t("errors.generic") }}
        </span>
        <p
          class="font-heading text-[7rem] md:text-[9rem]
                 leading-none text-terracotta/20 mt-2"
        >
          {{ error?.statusCode || 404 }}
        </p>

        <!-- Title -->
        <h1 class="section-title-lg mt-4">
          {{ errorTitle }}
        </h1>

        <!-- Description -->
        <p class="feature-description mt-4 max-w-sm mx-auto">
          {{ errorMessage }}
        </p>

        <!-- CTA -->
        <div class="mt-10">
          <Button
            variant="primary"
            icon="ArrowLeft"
            @click="handleError"
          >
            {{ t("common.back_to_home") }}
          </Button>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="py-8 text-center">
      <p class="text-sm text-dark/40">
        &copy; {{ new Date().getFullYear() }} Boticia
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n();

interface NuxtError {
  statusCode?: number;
  message?: string;
  statusMessage?: string;
}

const props = defineProps<{
  error: NuxtError;
}>();

const errorTitle = computed(() => {
  switch (props.error?.statusCode) {
    case 404:
      return t("errors.not_found");
    case 500:
      return t("errors.server");
    case 403:
      return t("errors.forbidden");
    default:
      return t("errors.generic");
  }
});

const errorMessage = computed(() => {
  switch (props.error?.statusCode) {
    case 404:
      return t("errors.not_found_desc");
    case 500:
      return t("errors.server_desc");
    case 403:
      return t("errors.forbidden_desc");
    default:
      return t("errors.generic_desc");
  }
});

const handleError = () => {
  clearError({ redirect: "/" });
};
</script>
