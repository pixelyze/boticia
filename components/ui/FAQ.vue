<template>
  <div class="space-y-0">
    <div
      v-for="(item, index) in faqItems"
      :key="index"
      class="border-b border-dark/20"
      :class="index === 0 ? 'border-t' : ''"
    >
      <button
        @click="toggleItem(index)"
        class="w-full text-left py-6 flex justify-between items-center group"
      >
        <span class="font-heading text-dark text-xl font-normal pr-8 group-hover:text-dark transition-colors duration-300">
          {{ item.question }}
        </span>
        <IconLucid
          :name="activeIndex === index ? 'Minus' : 'Plus'"
          size="sm"
          class="text-dark flex-shrink-0"
          :strokeWidth="1.25"
        />
      </button>
      <div
        v-show="activeIndex === index"
        class="pb-6"
      >
        <p class="para max-w-3xl">
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
