<template>
  <section class="bg-black text-white">
    <div class="container mx-auto px-6 py-16 md:py-24">
      <div class="max-w-3xl mx-auto text-center">
        <blockquote>
          <p class="text-2xl md:text-3xl lg:text-4xl font-light italic leading-relaxed">
            <span class="text-gray-500">&laquo;&nbsp;</span>{{ quote }}<span class="text-gray-500">&nbsp;&raquo;</span>
          </p>
          <footer class="mt-8">
            <cite class="not-italic text-gray-400 text-lg">
              — {{ author }}
            </cite>
          </footer>
        </blockquote>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  quote: string;
  author: string;
}>();
</script>
