<template>
  <div class="bg-white">
    <div class="container mx-auto px-6 py-16 text-center">
      <h1 class="font-heading text-4xl font-bold text-dark mb-2">Variantes Footer</h1>
      <p class="text-dark/50 text-sm">3 variations du footer centré minimal</p>
    </div>

    <!-- ===================== VARIANTE A ===================== -->
    <div class="mb-4 px-6">
      <p class="text-center text-xs uppercase tracking-[0.3em] text-dark/40 mb-4">Variante A — Avec séparateurs entre réseaux</p>
    </div>

    <footer class="bg-cream text-dark py-20">
      <div class="container mx-auto px-6">
        <div class="max-w-2xl mx-auto text-center">
          <img src="/logo-boticia.png" alt="Boticia" class="h-20 mx-auto mb-8" />

          <p class="text-dark/60 text-base leading-relaxed max-w-md mx-auto">
            Atelier de design floral par Laëtitia Schaeffer. Fleurs françaises, créations sur mesure et approche éco-responsable.
          </p>

          <!-- Social links with dots -->
          <div class="flex justify-center items-center gap-4 mt-10">
            <a href="#" class="text-dark/50 hover:text-dark text-sm transition-colors duration-300">Instagram</a>
            <span class="text-dark/20">&bull;</span>
            <a href="#" class="text-dark/50 hover:text-dark text-sm transition-colors duration-300">LinkedIn</a>
            <span class="text-dark/20">&bull;</span>
            <a href="#" class="text-dark/50 hover:text-dark text-sm transition-colors duration-300">Facebook</a>
            <span class="text-dark/20">&bull;</span>
            <a href="#" class="text-dark/50 hover:text-dark text-sm transition-colors duration-300">Pinterest</a>
          </div>

          <!-- Full width separator -->
          <div class="h-px bg-dark/10 mt-12 mb-8"></div>

          <!-- Bottom row: legal left, copyright right -->
          <div class="flex flex-col md:flex-row justify-between items-center text-sm">
            <div class="flex gap-4">
              <span class="text-dark/35">Mentions légales</span>
              <span class="text-dark/20">&bull;</span>
              <span class="text-dark/35">Conditions générales</span>
            </div>
            <p class="text-dark/30 mt-2 md:mt-0">&copy; 2026 Boticia</p>
          </div>
        </div>
      </div>
    </footer>

    <!-- ===================== VARIANTE B ===================== -->
    <div class="mt-20 mb-4 px-6">
      <p class="text-center text-xs uppercase tracking-[0.3em] text-dark/40 mb-4">Variante B — Ultra-aéré avec nom en Playfair</p>
    </div>

    <footer class="bg-cream text-dark py-24">
      <div class="container mx-auto px-6">
        <div class="max-w-2xl mx-auto text-center">
          <img src="/logo-boticia.png" alt="Boticia" class="h-24 mx-auto mb-6" />

          <span class="font-heading text-2xl text-dark">Boticia</span>

          <p class="text-dark/50 text-sm leading-relaxed max-w-sm mx-auto mt-4">
            Atelier de design floral par Laëtitia Schaeffer. Fleurs françaises, créations sur mesure et approche éco-responsable.
          </p>

          <!-- Social links as underlined -->
          <div class="flex justify-center gap-8 mt-12">
            <a href="#" class="text-dark/45 hover:text-dark text-sm border-b border-dark/20 hover:border-dark/50 pb-0.5 transition-all duration-300">Instagram</a>
            <a href="#" class="text-dark/45 hover:text-dark text-sm border-b border-dark/20 hover:border-dark/50 pb-0.5 transition-all duration-300">LinkedIn</a>
            <a href="#" class="text-dark/45 hover:text-dark text-sm border-b border-dark/20 hover:border-dark/50 pb-0.5 transition-all duration-300">Facebook</a>
            <a href="#" class="text-dark/45 hover:text-dark text-sm border-b border-dark/20 hover:border-dark/50 pb-0.5 transition-all duration-300">Pinterest</a>
          </div>

          <div class="mt-16 space-y-2">
            <div class="flex justify-center gap-6 text-dark/35 text-sm">
              <span>Mentions légales</span>
              <span>Conditions générales</span>
            </div>
            <p class="text-dark/25 text-sm">&copy; 2026 Boticia. Tous droits réservés.</p>
          </div>
        </div>
      </div>
    </footer>

    <!-- ===================== VARIANTE C ===================== -->
    <div class="mt-20 mb-4 px-6">
      <p class="text-center text-xs uppercase tracking-[0.3em] text-dark/40 mb-4">Variante C — Compact & structuré</p>
    </div>

    <footer class="bg-cream text-dark">
      <div class="border-t border-dark/10">
        <div class="container mx-auto px-6 py-16">
          <div class="max-w-3xl mx-auto">
            <!-- Top: logo + description centered -->
            <div class="text-center">
              <img src="/logo-boticia.png" alt="Boticia" class="h-16 mx-auto mb-6" />
              <p class="text-dark/55 text-sm leading-relaxed max-w-md mx-auto">
                Atelier de design floral par Laëtitia Schaeffer. Fleurs françaises, créations sur mesure et approche éco-responsable.
              </p>
            </div>

            <!-- Middle: social links in a row -->
            <div class="flex justify-center gap-6 mt-8">
              <a href="#" class="text-dark/40 hover:text-dark text-xs uppercase tracking-[0.15em] transition-colors duration-300">Instagram</a>
              <a href="#" class="text-dark/40 hover:text-dark text-xs uppercase tracking-[0.15em] transition-colors duration-300">LinkedIn</a>
              <a href="#" class="text-dark/40 hover:text-dark text-xs uppercase tracking-[0.15em] transition-colors duration-300">Facebook</a>
              <a href="#" class="text-dark/40 hover:text-dark text-xs uppercase tracking-[0.15em] transition-colors duration-300">Pinterest</a>
            </div>

            <!-- Bottom bar -->
            <div class="flex flex-col md:flex-row justify-between items-center mt-10 pt-6 border-t border-dark/8">
              <p class="text-dark/30 text-xs">&copy; 2026 Boticia. Tous droits réservés.</p>
              <div class="flex gap-4 mt-2 md:mt-0">
                <span class="text-dark/30 hover:text-dark/60 text-xs transition-colors duration-300 cursor-pointer">Mentions légales</span>
                <span class="text-dark/30 hover:text-dark/60 text-xs transition-colors duration-300 cursor-pointer">Conditions générales</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'minimal',
});
</script>
