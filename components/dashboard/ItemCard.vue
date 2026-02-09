<template>
  <Card variant="standard" class="!p-8 md:!p-10">
    <!-- Status badge -->
    <div class="flex items-center gap-2 mb-6">
      <Tag :variant="statusVariant" :icon="statusIcon">
        {{ statusLabel }}
      </Tag>
    </div>

    <!-- Title -->
    <h3 class="card-title mb-1">{{ title }}</h3>
    <p class="text-gray-500 mb-4">{{ subtitle }}</p>

    <!-- Details -->
    <div class="space-y-2 text-gray-600 mb-6">
      <p v-if="date">
        <span class="font-medium">{{ $t('dashboard.date') }}:</span> {{ date }}
      </p>
      <p v-if="amount">
        <span class="font-medium">{{ $t('dashboard.amount') }}:</span> {{ amount }}
      </p>
    </div>

    <!-- Actions slot -->
    <slot name="actions" />
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  title: string;
  subtitle?: string;
  status: string;
  statusLabel: string;
  date?: string;
  amount?: string;
}>();

const statusVariant = computed(() => {
  switch (props.status) {
    case 'completed': return 'success';
    case 'active': return 'info';
    case 'pending': return 'warning';
    case 'cancelled': return 'error';
    default: return 'default';
  }
});

const statusIcon = computed(() => {
  switch (props.status) {
    case 'completed': return 'Check';
    case 'active': return 'Calendar';
    case 'pending': return 'Clock';
    case 'cancelled': return 'X';
    default: return 'Info';
  }
});
</script>
