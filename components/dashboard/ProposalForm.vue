<template>
  <div class="space-y-4">
    <input
      v-model="title"
      type="text"
      :placeholder="$t('dashboard.proposal_title_placeholder')"
      class="w-full px-4 py-3 rounded-xl border-2
        border-dark/5 bg-cream focus:outline-none
        focus:border-dark/30 transition-all"
    />
    <textarea
      v-model="description"
      :placeholder="
        $t('dashboard.proposal_desc_placeholder')
      "
      class="w-full h-20 px-4 py-3 rounded-xl border-2
        border-dark/5 bg-cream focus:outline-none
        focus:border-dark/30 transition-all resize-none"
    />
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label
          class="text-xs text-dark/50 block mb-1"
        >
          {{ $t("dashboard.proposal_amount") }} (€)
        </label>
        <input
          v-model.number="amount"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          class="w-full px-4 py-3 rounded-xl border-2
            border-dark/5 bg-cream focus:outline-none
            focus:border-dark/30 transition-all"
        />
      </div>
      <div>
        <label
          class="text-xs text-dark/50 block mb-1"
        >
          {{ $t("dashboard.proposal_status") }}
        </label>
        <select
          v-model="status"
          class="w-full px-4 py-3 rounded-xl border-2
            border-dark/5 bg-cream focus:outline-none
            focus:border-dark/30 transition-all"
        >
          <option value="draft">
            {{ $t("dashboard.proposal_status_draft") }}
          </option>
          <option value="pending">
            {{ $t("dashboard.proposal_status_pending") }}
          </option>
        </select>
      </div>
    </div>
    <!-- File upload -->
    <div>
      <label class="text-xs text-dark/50 block mb-1">
        PDF
      </label>
      <input
        ref="fileInput"
        type="file"
        accept="application/pdf,image/png,image/jpeg"
        class="text-sm text-dark/60"
        @change="handleFile"
      />
    </div>
    <div class="flex gap-2">
      <Button
        variant="primary"
        icon="Plus"
        :loading="submitting"
        @click="handleSubmit"
      >
        {{ $t("dashboard.proposal_create") }}
      </Button>
      <Button @click="$emit('cancel')">
        {{ $t("common.cancel") }}
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (
    e: "submit",
    data: {
      title: string;
      description: string;
      amount: number;
      status: string;
      file: File | null;
    }
  ): void;
  (e: "cancel"): void;
}>();

defineProps<{
  submitting: boolean;
}>();

const title = ref("");
const description = ref("");
const amount = ref(0);
const status = ref("draft");
const file = ref<File | null>(null);

const handleFile = (event: Event) => {
  const input = event.target as HTMLInputElement;
  file.value = input.files?.[0] || null;
};

const handleSubmit = () => {
  if (!title.value) return;
  emit("submit", {
    title: title.value,
    description: description.value,
    amount: amount.value,
    status: status.value,
    file: file.value,
  });
};
</script>
