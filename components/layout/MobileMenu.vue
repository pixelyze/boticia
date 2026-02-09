<template>
  <div>
    <!-- Menu button -->
    <Button
      variant="default"
      @click="isOpen = true"
    >
      {{ $t('common.menu') }}
    </Button>

    <!-- Menu modal -->
    <BaseModal
      :is-open="isOpen"
      :title="$t('common.menu')"
      :show-close-button="false"
      @close="isOpen = false"
    >
      <div class="space-y-6">
        <!-- CTAs -->
        <div class="space-y-3">
          <Button
            variant="primary"
            class="w-full"
            :to="localePath('/')"
            @click="isOpen = false"
          >
            {{ $t('common.home') }}
          </Button>

          <Button
            variant="default"
            icon="User"
            class="w-full"
            :to="localePath('/dashboard')"
            @click="isOpen = false"
          >
            {{ $t('common.my_space') }}
          </Button>
        </div>

        <!-- Separator -->
        <div class="border-t border-gray-200"></div>

        <!-- Language selection -->
        <div>
          <p class="text-sm text-gray-500 mb-2">{{ $t('common.language') }}</p>
          <div class="flex gap-2">
            <button
              v-for="lang in availableLocales"
              :key="lang.code"
              class="flex-1 py-3 px-4 border-2 font-medium transition-all"
              :class="locale === lang.code
                ? 'border-black bg-black text-white'
                : 'border-gray-200 hover:border-gray-400'"
              @click="switchLanguage(lang.code)"
            >
              {{ lang.flag }} {{ lang.name }}
            </button>
          </div>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();
const localePath = useLocalePath();
const switchLocalePath = useSwitchLocalePath();
const router = useRouter();

const isOpen = ref(false);

const availableLocales = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
];

const switchLanguage = (code: string) => {
  const path = switchLocalePath(code);
  router.push(path);
  isOpen.value = false;
};
</script>
