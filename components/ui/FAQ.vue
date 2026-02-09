<template>
  <div class="faq-container">
    <div v-for="(item, index) in faqItems" :key="index" class="faq-item mb-6">
      <button
        @click="toggleItem(index)"
        class="faq-question w-full text-left px-6 py-4 border-2 border-black bg-white flex justify-between items-center transition-all relative"
        :class="[
          activeIndex === index
            ? 'shadow-none translate-x-[4px] translate-y-[4px]'
            : 'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]',
        ]"
      >
        <span class="font-bold text-lg pr-8">{{ item.question }}</span>
        <div class="absolute right-6">
          <IconLucid
            :name="activeIndex === index ? 'ChevronUp' : 'ChevronDown'"
            size="md"
            :strokeWidth="2.5"
          />
        </div>
      </button>
      <div
        v-show="activeIndex === index"
        class="faq-answer text-lg px-6 py-4 mt-2 bg-gray-50"
      >
        <p class="text-gray-700">{{ item.answer }}</p>
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

<style scoped>
.faq-question {
  transition: all 0.2s ease-in-out;
}

.faq-answer {
  line-height: 1.6;
}
</style>
