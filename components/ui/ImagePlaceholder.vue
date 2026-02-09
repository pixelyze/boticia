<template>
  <div class="bg-gray-200 flex items-center justify-center" :class="{ 'absolute inset-0': absolute }">
    <img src="~/assets/img/logo.svg" alt="" class="h-10 w-auto opacity-20" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  absolute?: boolean;
}>();
</script>
