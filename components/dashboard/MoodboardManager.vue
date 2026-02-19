<template>
  <div class="rounded-[1.5rem] bg-white p-5">
    <h2
      class="font-heading text-sm text-dark/50
        uppercase tracking-wider mb-4"
    >
      {{ $t("dashboard.moodboard_title") }}
    </h2>

    <!-- Florist note -->
    <div class="mb-4">
      <textarea
        :value="moodboardNote"
        @input="
          $emit(
            'update:moodboardNote',
            ($event.target as HTMLTextAreaElement).value
          )
        "
        :placeholder="
          $t('dashboard.moodboard_note_placeholder')
        "
        class="w-full h-20 px-4 py-3 rounded-xl border-2
          border-dark/5 bg-cream focus:outline-none
          focus:border-dark/30 transition-all resize-none
          text-sm"
      />
      <div class="mt-2">
        <Button
          icon="Save"
          :loading="savingNote"
          @click="$emit('saveNote')"
        >
          {{ $t("common.save") }}
        </Button>
      </div>
    </div>

    <!-- Upload zone -->
    <div class="mb-4">
      <div
        class="rounded-xl border-2 border-dashed
          border-dark/15 p-4 text-center cursor-pointer
          hover:border-dark/30 transition-all"
        @click="triggerUpload"
      >
        <div v-if="!uploading">
          <IconLucid
            name="Upload"
            size="sm"
            class="mx-auto text-dark/30 mb-1"
          />
          <p class="text-xs text-dark/40">
            {{ $t("dashboard.moodboard_upload") }}
          </p>
        </div>
        <div v-else>
          <IconLucid
            name="Loader2"
            size="sm"
            class="mx-auto text-dark/40 animate-spin"
          />
        </div>
      </div>
      <input
        ref="fileInput"
        type="file"
        accept="image/png,image/jpeg,image/webp,application/pdf"
        class="hidden"
        @change="handleUpload"
      />
    </div>

    <!-- Add link -->
    <div class="mb-4">
      <div
        v-if="showLinkForm"
        class="space-y-2"
      >
        <input
          v-model="linkUrl"
          type="url"
          placeholder="https://..."
          class="w-full px-4 py-2 rounded-xl border-2
            border-dark/5 bg-cream focus:outline-none
            focus:border-dark/30 transition-all text-sm"
        />
        <input
          v-model="linkTitle"
          type="text"
          :placeholder="
            $t('dashboard.moodboard_link_title')
          "
          class="w-full px-4 py-2 rounded-xl border-2
            border-dark/5 bg-cream focus:outline-none
            focus:border-dark/30 transition-all text-sm"
        />
        <div class="flex gap-2">
          <Button
            icon="Plus"
            :loading="addingLink"
            @click="handleAddLink"
          >
            {{ $t("common.confirm") }}
          </Button>
          <Button @click="showLinkForm = false">
            {{ $t("common.cancel") }}
          </Button>
        </div>
      </div>
      <Button
        v-else
        icon="Link"
        @click="showLinkForm = true"
      >
        {{ $t("dashboard.moodboard_add_link") }}
      </Button>
    </div>

    <!-- Items list -->
    <div
      v-if="items.length > 0"
      class="space-y-2"
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
      class="text-dark/30 text-sm text-center py-4"
    >
      {{ $t("dashboard.moodboard_empty") }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { MoodboardItem } from "~/server/utils/client-portal-types";

defineProps<{
  items: MoodboardItem[];
  moodboardNote: string;
  savingNote: boolean;
  uploading: boolean;
  addingLink: boolean;
}>();

const emit = defineEmits<{
  (e: "upload", file: File): void;
  (e: "addLink", url: string, title: string): void;
  (e: "deleteItem", id: string): void;
  (e: "saveNote"): void;
  (e: "update:moodboardNote", value: string): void;
}>();

const fileInput = ref<HTMLInputElement | null>(null);
const showLinkForm = ref(false);
const linkUrl = ref("");
const linkTitle = ref("");

const triggerUpload = () => {
  fileInput.value?.click();
};

const handleUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) {
    emit("upload", file);
    input.value = "";
  }
};

const handleAddLink = () => {
  if (!linkUrl.value) return;
  emit("addLink", linkUrl.value, linkTitle.value);
  linkUrl.value = "";
  linkTitle.value = "";
  showLinkForm.value = false;
};
</script>
