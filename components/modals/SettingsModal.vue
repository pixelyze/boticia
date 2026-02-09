<template>
  <BaseModal
    :isOpen="isOpen"
    :title="$t('dashboard.settings')"
    :subtitle="userEmail"
    :showCloseButton="false"
    @close="$emit('cancel')"
  >
    <div class="space-y-6">
      <p class="text-gray-600">
        {{ $t('dashboard.settings_description') }}
      </p>
    </div>

    <!-- Close button -->
    <div class="flex justify-center pt-6 border-t border-gray-200">
      <Button variant="default" @click="$emit('cancel')" class="w-full sm:w-auto">
        {{ $t("common.close") }}
      </Button>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
defineProps<{
  isOpen: boolean;
  userEmail?: string;
}>();

defineEmits<{
  (e: "cancel"): void;
}>();
</script>
