<template>
  <div>
    <!-- Floating button -->
    <button
      @click="modalOpen = true"
      class="fixed bottom-6 left-6 z-40 flex items-center gap-2 rounded-full bg-dark text-white px-4 py-3 shadow-lg hover:bg-gray-800 transition-all"
    >
      <IconLucid name="MessageSquarePlus" size="sm" />
      <span class="text-sm font-medium">{{ $t("feedback.button") }}</span>
    </button>

    <!-- Modal -->
    <BaseModal
      :isOpen="modalOpen"
      :title="$t('feedback.title')"
      :showCloseButton="true"
      :closeButtonText="$t('common.close')"
      @close="handleClose"
    >
      <!-- Success state -->
      <div v-if="success" class="flex flex-col items-center gap-4 py-8">
        <div
          class="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center"
        >
          <IconLucid name="Check" size="md" class="text-green-600" />
        </div>
        <p class="text-dark font-medium text-center">
          {{ $t("feedback.success") }}
        </p>
      </div>

      <!-- Form -->
      <template v-else>
        <!-- Type selector -->
        <div class="flex gap-2">
          <button
            v-for="t in types"
            :key="t.value"
            @click="selectedType = t.value"
            class="px-4 py-2 rounded-full text-sm font-medium border-2 transition-all"
            :class="
              selectedType === t.value
                ? 'border-dark bg-dark text-white'
                : 'border-gray-200 text-gray-600 hover:border-gray-300'
            "
          >
            {{ t.label }}
          </button>
        </div>

        <!-- Message textarea -->
        <textarea
          v-model="message"
          :placeholder="$t('feedback.message_placeholder')"
          rows="5"
          class="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm text-dark placeholder-gray-400 focus:border-dark focus:outline-none resize-none transition-colors"
        />

        <!-- Error -->
        <p v-if="errorMsg" class="text-red-500 text-sm">
          {{ errorMsg }}
        </p>

        <!-- Submit -->
        <Button
          variant="primary"
          :disabled="!selectedType || !message.trim() || loading"
          @click="submit"
        >
          <template v-if="loading">
            <IconLucid name="Loader2" size="sm" class="animate-spin" />
          </template>
          <template v-else>
            <IconLucid name="Send" size="sm" />
            {{ $t("feedback.submit") }}
          </template>
        </Button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
const { adminFetch } = useAdminFetch();

const modalOpen = ref(false);
const selectedType = ref<string>("");
const message = ref("");
const loading = ref(false);
const success = ref(false);
const errorMsg = ref("");

const types = computed(() => [
  { value: "bug", label: t("feedback.type_bug") },
  { value: "suggestion", label: t("feedback.type_suggestion") },
  { value: "question", label: t("feedback.type_question") },
]);

function handleClose() {
  modalOpen.value = false;
  // Reset after animation
  setTimeout(() => {
    if (!modalOpen.value) {
      resetForm();
    }
  }, 300);
}

function resetForm() {
  selectedType.value = "";
  message.value = "";
  loading.value = false;
  success.value = false;
  errorMsg.value = "";
}

async function submit() {
  if (!selectedType.value || !message.value.trim()) return;

  loading.value = true;
  errorMsg.value = "";

  try {
    await adminFetch("/api/feedback", {
      method: "POST",
      body: {
        type: selectedType.value,
        message: message.value.trim(),
      },
    });
    success.value = true;
  } catch (err: any) {
    console.error("[FEEDBACK] Submit error:", err);
    errorMsg.value = t("feedback.error");
  } finally {
    loading.value = false;
  }
}
</script>
