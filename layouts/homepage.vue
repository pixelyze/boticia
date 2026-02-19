<template>
  <div class="min-h-screen selection:bg-fuchsia-300 selection:text-fuchsia-900 flex flex-col">
    <Header />
    <main class="flex-1">
      <slot />
    </main>
    <Footer class="flex-shrink-0" />
  </div>
</template>
