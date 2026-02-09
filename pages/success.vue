<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <main class="flex-1 flex items-center justify-center px-4 py-16">
      <div class="text-center max-w-2xl">
        <!-- Success icon -->
        <div class="mb-8 flex justify-center">
          <div class="w-24 h-24 bg-black flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(107,114,128,1)]">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
        </div>

        <!-- Message -->
        <h1 class="text-3xl md:text-4xl font-bold mb-4 text-black">
          {{ t("success.title") }}
        </h1>
        <p class="text-lg md:text-xl text-gray-700 mb-8 max-w-md mx-auto">
          {{ t("success.message") }}
        </p>

        <!-- Order details -->
        <div
          v-if="sessionData"
          class="bg-white border-2 border-black p-6 mb-8 text-left shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        >
          <h2 class="font-bold text-lg mb-4">{{ t("success.order_details") }}</h2>
          <div class="space-y-2 text-gray-700">
            <p>
              <span class="font-medium">{{ t("success.amount") }}:</span>
              {{ formatAmount(sessionData.amount_total) }}
            </p>
            <p v-if="sessionData.customer_email">
              <span class="font-medium">{{ t("success.email") }}:</span>
              {{ sessionData.customer_email }}
            </p>
          </div>
        </div>

        <!-- Info -->
        <div class="bg-gray-100 p-6 mb-8 text-left">
          <p class="text-gray-700">
            <span class="font-medium">{{ t("success.next_steps") }}:</span>
            {{ t("success.next_steps_description") }}
          </p>
        </div>

        <!-- CTA -->
        <Button variant="primary" icon="ArrowLeft" :to="localePath('/')">
          {{ t("common.back_to_home") }}
        </Button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";

definePageMeta({
  layout: 'minimal',
});

const { t } = useI18n();
const route = useRoute();
const localePath = useLocalePath();

interface SessionData {
  amount_total: number;
  customer_email: string | null;
  payment_status: string;
  metadata?: Record<string, any>;
}

const sessionData = ref<SessionData | null>(null);

onMounted(async () => {
  const sessionId = route.query.session_id as string;
  if (sessionId) {
    try {
      const response = await $fetch<SessionData>(
        `/api/stripe/session?session_id=${sessionId}`
      );
      sessionData.value = response;
    } catch (error) {
      console.error("Error retrieving session:", error);
    }
  }
});

const formatAmount = (amount: number) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount / 100);
};
</script>
