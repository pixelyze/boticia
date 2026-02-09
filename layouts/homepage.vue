<template>
  <div class="min-h-screen bg-white selection:bg-fuchsia-300 selection:text-fuchsia-900 flex flex-col">
    <main class="flex-1">
      <slot />
    </main>
    <Footer class="flex-shrink-0" />
  </div>
</template>
