<template>
  <section class="bg-cream overflow-hidden min-h-screen flex items-center">
    <div class="container mx-auto px-6 pb-36">
      <div class="max-w-3xl mx-auto text-center">
        <!-- Logo -->
        <div class="flex justify-center mb-10">
          <img
            src="/logo-boticia.png"
            alt="Boticia"
            class="h-48 md:h-64 lg:h-72 w-auto"
          />
        </div>

        <!-- Tagline -->
        <p class="hero-tagline mb-4">
          {{ $t('hero.tagline') }}
        </p>

        <!-- Title -->
        <h1 class="hero-title mb-6">
          {{ $t('hero.title') }}
        </h1>

        <!-- Subtitle -->
        <p class="hero-tagline max-w-2xl mx-auto">
          {{ $t('hero.subtitle') }}
        </p>
      </div>
    </div>
  </section>
</template>
