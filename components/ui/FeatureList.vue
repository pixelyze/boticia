<template>
  <ul class="space-y-2 text-gray-700">
    <li v-for="(item, index) in items" :key="index" class="flex items-center gap-3">
      <IconLucid :name="icon" size="md" class="text-black flex-shrink-0" />
      <span>{{ item }}</span>
    </li>
  </ul>
</template>

<script setup lang="ts">

withDefaults(defineProps<{
  items: string[];
  icon?: string;
}>(), {
  icon: "CircleCheck"
});
</script>
