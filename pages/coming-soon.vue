<template>
  <div class="min-h-screen bg-cream-light flex flex-col items-center justify-center px-6 selection:bg-fuchsia-300 selection:text-fuchsia-900">
    <!-- Logo -->
    <img
      src="/logo-boticia.png"
      alt="Boticia"
      class="h-32 md:h-40 mb-8"
    />

    <!-- Title -->
    <h1 class="font-heading text-4xl md:text-5xl text-dark text-center mb-3">
      Boticia
    </h1>
    <p class="text-dark/40 text-lg md:text-xl text-center mb-10">
      Créatrice d'ambiance florale
    </p>

    <!-- Message -->
    <div class="max-w-md text-center">
      <p class="text-dark/60 text-base leading-relaxed mb-8">
        Notre nouveau site arrive bientôt.<br />
        En attendant, contactez-nous pour votre projet floral.
      </p>

      <!-- CTA -->
      <a
        href="mailto:laetitia@boticia.fr"
        class="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-dark text-cream text-sm font-semibold hover:bg-dark/90 transition-all"
      >
        laetitia@boticia.fr
      </a>

      <!-- Social -->
      <div class="flex justify-center gap-6 mt-10">
        <a
          href="https://instagram.com/boticia_"
          target="_blank"
          rel="noopener noreferrer"
          class="text-dark/40 hover:text-dark text-sm border-b border-dark/20 hover:border-dark/40 pb-0.5 transition-all"
        >
          Instagram
        </a>
        <a
          href="https://www.facebook.com/BoticiaParis/"
          target="_blank"
          rel="noopener noreferrer"
          class="text-dark/40 hover:text-dark text-sm border-b border-dark/20 hover:border-dark/40 pb-0.5 transition-all"
        >
          Facebook
        </a>
      </div>
    </div>

    <!-- Footer -->
    <p class="absolute bottom-6 text-dark/20 text-xs">
      © 2026 Boticia · Côte d'Azur
    </p>
  </div>
</template>

<script setup>
definePageMeta({ layout: false });

useHead({
  title: "Boticia · Bientôt disponible",
  meta: [
    { name: "description", content: "Boticia — Créatrice d'ambiance florale sur la Côte d'Azur. Notre nouveau site arrive bientôt." },
  ],
});
</script>
