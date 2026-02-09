<template>
  <nav aria-label="Breadcrumb" class="container mx-auto px-6 py-4">
    <ol class="flex items-center gap-2 text-sm text-gray-600">
      <li v-for="(item, index) in items" :key="item.path" class="flex items-center gap-2">
        <span v-if="index > 0" class="text-gray-400">/</span>

        <NuxtLink
          v-if="index < items.length - 1"
          :to="item.path"
          class="hover:text-black hover:underline transition-colors"
        >
          {{ item.label }}
        </NuxtLink>
        <span v-else class="text-black font-medium" aria-current="page">
          {{ item.label }}
        </span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { useHead } from '#imports';

interface BreadcrumbItem {
  label: string;
  path: string;
}

const props = defineProps<{
  items: BreadcrumbItem[];
}>();

const config = useRuntimeConfig();

const structuredData = computed(() => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": props.items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.label,
    "item": `${config.public.siteUrl}${item.path}`
  }))
}));

useHead({
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify(structuredData.value)
    }
  ]
});
</script>
