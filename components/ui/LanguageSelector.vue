<template>
  <div class="language-selector">
    <!-- Bouton principal -->
    <Button
      variant="ghost"
      right-icon="ChevronDown"
      :class="variant === 'light' ? '!text-white hover:!text-white' : ''"
      @click="toggleModal"
    >
      {{ currentLocaleCode }}
    </Button>

    <!-- Modale de sélection de langue -->
    <LanguageSelectorModal
      :isOpen="isModalOpen"
      @cancel="isModalOpen = false"
      @language-changed="handleLanguageChanged"
    />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { ref, computed } from "vue";

defineProps<{
  variant?: "default" | "light";
}>();

const { locale } = useI18n();
const isModalOpen = ref(false);

// Récupérer les locales depuis la configuration
const availableLocales = computed(() => {
  return [
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "ja", name: "日本語", flag: "🇯🇵" },
  ];
});

// Code de la locale actuelle (en majuscules)
const currentLocaleCode = computed(() => {
  return locale.value.toUpperCase();
});

function toggleModal() {
  isModalOpen.value = true;
}

function handleLanguageChanged(newLocale: string) {
  console.log("Language changed in parent:", newLocale);
  isModalOpen.value = false;
}
</script>
