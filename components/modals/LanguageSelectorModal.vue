<template>
  <BaseModal
    :isOpen="isOpen"
    :title="$t('language.select_language')"
    :showCloseButton="false"
    @close="$emit('cancel')"
  >
    <div class="grid gap-4">
      <button
        v-for="loc in availableLocales"
        :key="loc.code"
        @click="switchLocale(loc.code as 'fr' | 'en' | 'ja')"
        :class="[
          'w-full py-4 px-6 text-left hover:bg-gray-100 flex items-center gap-4 border-2 transition-all',
          locale === loc.code
            ? 'bg-gray-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-black text-black font-medium'
            : 'border-gray-200 text-gray-600',
        ]"
      >
        <div class="text-2xl">{{ loc.flag }}</div>
        <div class="flex-1">
          <div class="text-lg font-semibold">{{ loc.name }}</div>
          <div class="text-sm text-gray-500">
            {{ loc.nativeName }}
          </div>
        </div>
        <IconLucid
          v-if="locale === loc.code"
          name="Check"
          size="md"
          :strokeWidth="2"
          class="text-green-600 ml-auto"
        />
      </button>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const { locale, setLocale } = useI18n();
const route = useRoute();

defineProps<{ isOpen: boolean }>();

const emit = defineEmits<{
  (e: "cancel"): void;
  (e: "language-changed", locale: string): void;
}>();

const availableLocales = computed(() => [
  { code: "fr", name: "Français", nativeName: "Langue française", flag: "🇫🇷" },
  { code: "en", name: "English", nativeName: "English language", flag: "🇬🇧" },
  { code: "ja", name: "日本語", nativeName: "Japanese language", flag: "🇯🇵" },
]);

type LocaleCode = "fr" | "en" | "ja";

async function switchLocale(newLocale: LocaleCode) {
  emit("cancel");
  emit("language-changed", newLocale);
  await setLocale(newLocale);
  const currentPath = route.path.replace(/^\/[^\/]+/, "") || "/";
  await navigateTo(`/${newLocale}${currentPath}`);
}
</script>
