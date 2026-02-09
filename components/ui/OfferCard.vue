<template>
  <div
    class="border-2 border-black p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center max-w-md mx-auto bg-white"
  >
    <h2 class="text-2xl font-bold mb-4">
      {{ title }}
    </h2>
    <ul class="text-lg text-gray-700 mb-6 text-left list-disc list-inside">
      <li v-for="(feature, index) in features" :key="index">{{ feature }}</li>
    </ul>
    <div class="text-4xl font-extrabold mb-4">{{ price }}</div>
    <div class="flex justify-center mt-2 w-full">
      <Button variant="primary" class="w-full" @click="$emit('select')">
        {{ cta }}
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  features: string[];
  price: string;
  cta: string;
}>();

defineEmits<{
  (e: "select"): void;
}>();
</script>
