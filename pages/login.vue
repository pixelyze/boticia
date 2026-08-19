<template>
  <div class="min-h-screen md:h-screen grid grid-cols-1 md:grid-cols-2 md:overflow-hidden">

    <!-- Colonne gauche (desktop uniquement) -->
    <div class="hidden md:flex bg-cream-light flex-col items-center justify-center px-10 py-16 text-center">
      <img src="/logo-boticia.png" alt="Boticia" class="h-28 mb-8" />
      <h1 class="font-heading text-4xl text-dark mb-4">Mon Espace</h1>
      <p class="text-gray-500 text-sm leading-relaxed max-w-xs">
        L'espace réservé aux clientes Boticia — suivez l'avancement de votre projet floral en toute simplicité.
      </p>
      <div class="mt-10">
        <Button variant="ghost" icon="ArrowLeft" to="/">
          Retour à l'accueil
        </Button>
      </div>
    </div>

    <!-- Colonne droite -->
    <div class="bg-white flex flex-col items-center justify-center px-8 py-16 min-h-screen md:min-h-0">
      <div class="w-full max-w-sm">

        <!-- Logo mobile uniquement -->
        <div class="md:hidden text-center mb-8">
          <img src="/logo-boticia.png" alt="Boticia" class="h-20 mx-auto mb-4" />
          <h1 class="font-heading text-3xl text-dark">Mon Espace</h1>
        </div>

        <h2 class="font-heading text-xl md:text-3xl text-dark mb-2">Ravie de vous retrouver</h2>
        <p class="text-gray-500 text-sm mb-8 leading-relaxed">
          Utilisez l'adresse email de votre demande de devis pour recevoir un lien de connexion.
        </p>

        <!-- Magic Link Form -->
        <form v-if="!sent" @submit.prevent="handleLogin" class="space-y-4">
          <Input
            v-model="email"
            type="email"
            label="Adresse email"
            placeholder="votre@email.com"
            icon="Mail"
            variant="soft"
            required
          />
          <Button type="submit" variant="primary" :loading="loading" class="w-full">
            Recevoir le lien
          </Button>
        </form>

        <!-- Success -->
        <div v-else class="text-center py-4">
          <div class="text-4xl mb-4">📬</div>
          <h2 class="font-heading text-2xl text-dark mb-2">Vérifiez votre boîte mail</h2>
          <p class="text-gray-500 text-sm mb-6">
            Si <span class="font-semibold text-dark">{{ email }}</span>
            correspond à un compte Boticia, vous recevrez un lien de
            connexion dans quelques instants.
          </p>
          <Button variant="ghost" @click="sent = false">Renvoyer un lien</Button>
        </div>

        <!-- Error -->
        <div v-if="error" class="mt-4">
          <InfoNote variant="warning">{{ error }}</InfoNote>
        </div>

        <!-- CTA devis -->
        <p class="mt-8 text-center text-gray-400 text-sm">
          Pas encore cliente ?
          <NuxtLink :to="localePath('/devis')" class="text-gray-600 underline underline-offset-2 hover:text-dark transition-colors">
            Faire une demande de devis
          </NuxtLink>
        </p>

        <!-- Retour accueil mobile -->
        <div class="md:hidden mt-6 text-center">
          <Button variant="ghost" icon="ArrowLeft" to="/">
            Retour à l'accueil
          </Button>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
  ssr: false,
});

const route = useRoute();
const { t, locale } = useI18n();
const localePath = useLocalePath();

// State
const email = ref("");
const loading = ref(false);
const error = ref("");
const sent = ref(false);

// Magic Link Login
const handleLogin = async () => {
  loading.value = true;
  error.value = "";

  try {
    // L'envoi passe par le serveur : signInWithOtp() créait un compte pour
    // n'importe quelle adresse saisie ici. La destination demandée (ex : une
    // fiche devis) est transmise pour traverser le lien magique.
    await $fetch("/api/auth/request-login", {
      method: "POST",
      body: {
        email: email.value,
        redirect: safeRedirectPath(route.query.redirect) || undefined,
        locale: locale.value,
      },
    });

    sent.value = true;
  } catch (err: any) {
    console.error("Login error:", err);
    error.value = "Erreur lors de l'envoi du lien";
  } finally {
    loading.value = false;
  }
};

useHead({
  title: "Mon Espace - Boticia",
  meta: [
    {
      key: "description",
      name: "description",
      content: t("seo.login_description"),
    },
  ],
});
</script>
