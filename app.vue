<template>
  <div
    class="min-h-screen bg-white selection:bg-fuchsia-300 selection:text-fuchsia-900"
  >
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
// Initialize site theme (loads from CMS config and applies CSS variable)
useSiteTheme();
</script>
