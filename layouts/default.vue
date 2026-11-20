<template>
  <div
    class="min-h-screen bg-white selection:bg-fuchsia-300 selection:text-fuchsia-900"
  >
    <Header />
    <main id="main-content">
      <slot />
    </main>
    <!-- v1 gardée de côté : <Footer /> -->
    <FooterV2 />
  </div>
</template>

<script setup>
</script>
