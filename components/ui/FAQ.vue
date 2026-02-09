<template>
  <div class="space-y-0">
    <div
      v-for="(item, index) in faqItems"
      :key="index"
      class="border-b border-dark/10"
      :class="index === 0 ? 'border-t' : ''"
    >
      <button
        @click="toggleItem(index)"
        class="w-full text-left py-6 flex justify-between items-center group"
      >
        <span class="font-heading text-dark/80 text-base md:text-lg font-normal pr-8 group-hover:text-dark transition-colors duration-300">
          {{ item.question }}
        </span>
        <IconLucid
          :name="activeIndex === index ? 'Minus' : 'Plus'"
          size="sm"
          class="text-dark/30 group-hover:text-dark/60 transition-all duration-300 flex-shrink-0"
          :strokeWidth="1.5"
        />
      </button>
      <div
        v-show="activeIndex === index"
        class="pb-6"
      >
        <p class="text-dark/55 text-sm md:text-base leading-relaxed max-w-3xl">
          {{ item.answer }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
});

const activeIndex = ref(null);

const faqItems = computed(() => props.items || []);

const toggleItem = (index) => {
  if (activeIndex.value === index) {
    activeIndex.value = null;
  } else {
    activeIndex.value = index;
  }
};
</script>
