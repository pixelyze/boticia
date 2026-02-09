<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Header -->
    <header class="container mx-auto px-4 py-8">
      <div class="flex justify-center">
        <NuxtLink to="/" aria-label="Back to home">
          <img
            src="~/assets/img/logo.svg"
            alt="Logo"
            class="w-48 md:w-64 transition-transform duration-200 hover:scale-[1.02]"
          />
        </NuxtLink>
      </div>
    </header>

    <!-- Main content -->
    <main class="flex-1 flex items-center justify-center px-4 py-16">
      <div class="text-center max-w-2xl">
        <!-- Error code -->
        <div class="relative inline-block mb-8">
          <div
            class="text-[120px] md:text-[180px] font-bold leading-none tracking-tighter text-black select-none"
          >
            {{ error?.statusCode || 404 }}
          </div>
          <div
            class="absolute inset-0 text-[120px] md:text-[180px] font-bold leading-none tracking-tighter text-gray-300 -z-10 translate-x-2 translate-y-2"
          >
            {{ error?.statusCode || 404 }}
          </div>
        </div>

        <!-- Error message -->
        <h1 class="text-2xl md:text-4xl font-bold mb-4 text-black">
          {{ errorTitle }}
        </h1>
        <p class="text-lg md:text-xl text-gray-700 mb-12 max-w-md mx-auto">
          {{ errorMessage }}
        </p>

        <!-- CTA -->
        <div
          class="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            @click="handleError"
            class="px-8 py-4 font-medium border-2 transition-all flex items-center gap-3 bg-black text-white hover:bg-gray-800 border-black shadow-[4px_4px_0px_0px_rgba(107,114,128,1)] hover:shadow-[2px_2px_0px_0px_rgba(107,114,128,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            {{ t("common.back_to_home") }}
          </button>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="container mx-auto px-4 py-8 text-center">
      <p class="text-sm text-gray-500">
        &copy; {{ new Date().getFullYear() }} My App
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
      return "Page not found";
    case 500:
      return "Server error";
    case 403:
      return "Access denied";
    default:
      return "An error occurred";
  }
});

const errorMessage = computed(() => {
  switch (props.error?.statusCode) {
    case 404:
      return "The page you're looking for doesn't exist.";
    case 500:
      return "Our server is having a rough time. Please try again in a moment.";
    case 403:
      return "You don't have permission to access this resource.";
    default:
      return props.error?.message || "Something went wrong.";
  }
});

const handleError = () => {
  clearError({ redirect: "/" });
};
</script>
