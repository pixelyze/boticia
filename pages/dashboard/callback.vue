<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-6">
    <div class="max-w-md w-full">
      <!-- Error state -->
      <div v-if="error" class="text-center">
        <StatusIcon type="error" class="mb-8" />
        <h1 class="text-3xl md:text-4xl font-bold mb-4">{{ t("auth.callback_error_title") }}</h1>
        <p class="text-lg md:text-xl text-gray-700 mb-8">{{ error }}</p>
        <Button variant="primary" :to="localePath('/dashboard')" rightIcon="MoveRight">
          {{ t("auth.try_again") }}
        </Button>
      </div>

      <!-- Loading state -->
      <div v-else class="text-center">
        <div class="flex justify-center mb-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            class="animate-spin text-gray-600"
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        </div>
        <h2 class="text-3xl md:text-4xl font-bold mb-4">{{ t("auth.callback_loading") }}</h2>
        <p class="text-lg md:text-xl text-gray-700">{{ t("auth.callback_loading_message") }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";

definePageMeta({
  ssr: false,
  layout: 'minimal'
});

const { t } = useI18n();
const router = useRouter();
const localePath = useLocalePath();

const { getClient } = useSupabase();

const error = ref("");

onMounted(async () => {
  try {
    const supabase = getClient();
    if (!supabase) {
      error.value = t("auth.callback_error_message");
      return;
    }

    const hash = window.location.hash;

    if (hash && hash.includes("access_token")) {
      const { data, error: authError } = await supabase.auth.getSession();

      if (authError) {
        error.value = t("auth.callback_error_message");
        return;
      }

      if (data.session) {
        router.replace(localePath("/dashboard"));
        return;
      }
    }

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

      if (exchangeError) {
        error.value = t("auth.callback_error_message");
        return;
      }

      if (data.session) {
        router.replace(localePath("/dashboard"));
        return;
      }
    }

    const { data: sessionData } = await supabase.auth.getSession();
    if (sessionData.session) {
      router.replace(localePath("/dashboard"));
    } else {
      error.value = t("auth.callback_error_message");
    }
  } catch (err) {
    console.error("Callback error:", err);
    error.value = t("auth.callback_error_message");
  }
});

useHead({
  title: t("auth.callback_page_title"),
});
</script>
