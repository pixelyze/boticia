<template>
  <div>
    <h2
      class="font-heading text-sm text-dark/80
        uppercase tracking-wider mb-4"
    >
      {{ $t("dashboard.moodboard_title") }}
    </h2>

    <!-- Note for the couple -->
    <div class="mb-4">
      <label
        class="text-xs font-medium text-dark/60 mb-1.5 block"
      >
        {{ $t("dashboard.moodboard_note_label") }}
      </label>
      <div class="flex items-end gap-2">
        <textarea
          :value="note"
          @input="$emit('update:note', ($event.target as HTMLTextAreaElement).value)"
          :placeholder="$t('dashboard.moodboard_note_placeholder')"
          rows="2"
          class="flex-1 min-w-0 px-4 py-3 rounded-xl border-2
            border-dark/5 bg-cream text-sm resize-none
            focus:outline-none focus:border-dark/30
            transition-all"
        />
        <button
          @click="$emit('saveNote')"
          :disabled="savingNote"
          class="w-10 h-10 rounded-xl bg-dark text-cream
            flex items-center justify-center shrink-0
            hover:bg-dark/80 active:bg-dark/70
            transition-all disabled:opacity-30"
        >
          <IconLucid
            :name="savingNote ? 'Loader2' : 'Check'"
            size="xs"
            :class="savingNote ? 'animate-spin' : ''"
          />
        </button>
      </div>
    </div>

    <!-- Error message -->
    <p
      v-if="errorMsg"
      class="text-red-600 text-xs mb-2 px-1"
    >
      {{ errorMsg }}
    </p>

    <!-- Items list -->
    <div
      v-if="items.length > 0"
      class="space-y-2 mb-3"
    >
      <MoodboardItemRow
        v-for="item in items"
        :key="item.id"
        :item="item"
        @delete="$emit('deleteItem', $event)"
      />
    </div>
    <p
      v-else
      class="text-dark/60 text-sm text-center py-3"
    >
      {{ $t("dashboard.moodboard_empty") }}
    </p>

    <!-- Upload button -->
    <button
      class="w-full flex items-center justify-center gap-2
        py-3 rounded-xl border-2 border-dashed
        border-gray-200 text-dark/60
        hover:border-dark/30 hover:text-dark/80
        active:bg-cream transition-all"
      :class="uploading ? 'pointer-events-none opacity-60' : ''"
      @click="triggerUpload"
    >
      <IconLucid
        :name="uploading ? 'Loader2' : 'Plus'"
        size="xs"
        :class="uploading ? 'animate-spin' : ''"
      />
      <span class="text-sm">
        {{
          uploading
            ? $t("common.loading")
            : $t("dashboard.moodboard_add_file")
        }}
      </span>
    </button>
    <p class="text-[10px] text-dark/40 text-center mt-1.5">
      {{ $t("dashboard.moodboard_max_size") }}
    </p>

    <input
      ref="fileInput"
      type="file"
      accept="image/png,image/jpeg,image/webp,application/pdf"
      class="hidden"
      @change="handleUpload"
    />
  </div>
</template>

<script setup lang="ts">
import type { MoodboardItem } from "~/server/utils/client-portal-types";

const { t } = useI18n();

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 Mo

defineProps<{
  items: MoodboardItem[];
  uploading: boolean;
  note: string;
  savingNote: boolean;
}>();

const emit = defineEmits<{
  (e: "upload", file: File): void;
  (e: "deleteItem", id: string): void;
  (e: "update:note", value: string): void;
  (e: "saveNote"): void;
}>();

const fileInput = ref<HTMLInputElement | null>(null);
const errorMsg = ref("");

const triggerUpload = () => {
  fileInput.value?.click();
};

const validateAndEmit = (file: File) => {
  errorMsg.value = "";
  if (file.size > MAX_FILE_SIZE) {
    errorMsg.value = t("dashboard.moodboard_file_too_large");
    return;
  }
  emit("upload", file);
};

const handleUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) {
    validateAndEmit(file);
    input.value = "";
  }
};
</script>
