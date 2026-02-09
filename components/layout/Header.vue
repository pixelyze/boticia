<template>
  <header class="container mx-auto px-4 py-16">
    <div class="flex justify-between items-center mb-8">
      <!-- Dashboard link -->
      <Button
        variant="ghost"
        icon="User"
        :to="localePath('/dashboard')"
      >
        <span class="hidden sm:inline">{{ t("common.my_space") }}</span>
      </Button>
      <!-- Language selector -->
      <div class="languages">
        <LanguageSelector />
      </div>
    </div>
    <div class="flex flex-col justify-center items-center">
      <img
        src="~/assets/img/logo.svg"
        alt="Logo"
        class="w-full max-w-md md:max-w-lg lg:max-w-xl"
      />
      <p class="mt-4 text-lg md:text-xl font-medium text-gray-700">
        {{ t("app.tagline") }}
      </p>
    </div>
  </header>
</template>

<script setup>
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const localePath = useLocalePath();
</script>
