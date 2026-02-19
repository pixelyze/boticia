<template>
  <section class="relative w-full overflow-hidden px-10">
    <!-- Mobile: stacked layout -->
    <div class="md:hidden">
      <div class="relative h-[70vh] rounded-[2rem] overflow-hidden">
        <img
          src="/bouquet_mariee_boticia._1.webp"
          alt="Bouquet de mariée Boticia"
          class="absolute inset-0 w-full h-full object-cover"
        />
        <div
          class="absolute inset-0 bg-gradient-to-t from-dark/70 via-dark/20 to-transparent"
        />
        <div class="absolute bottom-0 inset-x-0 p-8 pb-12">
          <blockquote>
            <p
              class="text-2xl font-heading font-light italic leading-snug text-white"
            >
              {{ quote }}
            </p>
            <footer class="mt-6">
              <cite class="not-italic text-cream/70 text-sm tracking-widest uppercase">
                — {{ author }}
              </cite>
            </footer>
          </blockquote>
        </div>
      </div>
    </div>

    <!-- Desktop: editorial split layout -->
    <div class="hidden md:grid md:grid-cols-2 min-h-[85vh] rounded-[2rem] overflow-hidden border-2 border-dark/10">
      <!-- Image side -->
      <div class="relative overflow-hidden">
        <img
          src="/bouquet_mariee_boticia._1.webp"
          alt="Bouquet de mariée Boticia"
          class="absolute inset-0 w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-[1.5s] ease-out"
        />
      </div>

      <!-- Quote side -->
      <div
        class="relative flex items-center bg-cream-light"
      >
        <div class="px-12 lg:px-20 xl:px-28 py-16 max-w-xl">
          <blockquote>
            <p
              class="text-3xl lg:text-4xl xl:text-5xl font-heading font-light italic leading-snug text-dark/85"
            >
              {{ quote }}
            </p>
            <footer class="mt-10">
              <cite
                class="not-italic text-dark/50 text-sm tracking-[0.2em] uppercase"
              >
                — {{ author }}
              </cite>
            </footer>
          </blockquote>
        </div>
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
