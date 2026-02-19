<template>
  <div
    class="relative rounded-[1.5rem] border-2 border-dashed
      p-8 text-center transition-all cursor-pointer"
    :class="
      dragOver
        ? 'border-dark bg-cream'
        : 'border-dark/20 hover:border-dark/40'
    "
    @click="triggerUpload"
    @dragover.prevent="dragOver = true"
    @dragleave="dragOver = false"
    @drop.prevent="handleDrop"
  >
    <div v-if="!uploading">
      <IconLucid
        name="CloudUpload"
        size="lg"
        class="mx-auto text-dark/30 mb-3"
      />
      <p class="font-heading font-medium text-dark/60">
        {{ $t("client.inspirations_upload_title") }}
      </p>
      <p class="text-sm text-dark/40 mt-1">
        {{ $t("client.inspirations_upload_hint") }}
      </p>
    </div>
    <div v-else class="py-4">
      <IconLucid
        name="Loader2"
        size="lg"
        class="mx-auto text-dark/40 animate-spin mb-3"
      />
      <p class="text-dark/40 text-sm">
        {{ $t("common.loading") }}...
      </p>
    </div>
    <input
      ref="fileInput"
      type="file"
      accept="image/png,image/jpeg,image/webp,image/heic"
      multiple
      class="hidden"
      @change="handleFiles"
    />
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: "upload", files: File[]): void;
}>();

defineProps<{
  uploading: boolean;
}>();

const fileInput = ref<HTMLInputElement | null>(null);
const dragOver = ref(false);

const triggerUpload = () => {
  fileInput.value?.click();
};

const handleFiles = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files?.length) {
    emit("upload", Array.from(input.files));
    input.value = "";
  }
};

const handleDrop = (event: DragEvent) => {
  dragOver.value = false;
  const files = event.dataTransfer?.files;
  if (files?.length) {
    emit("upload", Array.from(files));
  }
};
</script>
