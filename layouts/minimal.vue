<template>
  <div class="min-h-screen flex flex-col bg-white selection:bg-fuchsia-300 selection:text-fuchsia-900">
    <!-- Top bar with centered logo -->
    <header class="bg-dark py-4">
      <div class="container mx-auto px-4">
        <div class="flex justify-center">
          <NuxtLink :to="localePath('/')" aria-label="Back to home">
            <img
              src="/logo-boticia.png"
              alt="Logo"
              class="h-12 md:h-16 w-auto"
            />
          </NuxtLink>
        </div>
      </div>
    </header>
    <main class="flex-1">
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script setup>
const localePath = useLocalePath();
</script>
