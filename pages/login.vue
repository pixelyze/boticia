<template>
  <div class="min-h-screen bg-cream flex items-center justify-center px-6">
    <div class="max-w-md w-full">
      <!-- Logo -->
      <div class="text-center mb-8">
        <img
          src="/logo-boticia.png"
          alt="Boticia"
          class="h-32 mx-auto mb-6"
        />
        <h1 class="text-4xl font-bold text-dark mb-2">Mon Espace</h1>
        <p class="text-dark/60">
          Entrez votre adresse email pour recevoir un lien de connexion
        </p>
      </div>

      <Card>
        <!-- Magic Link Form -->
        <form v-if="!sent" @submit.prevent="handleLogin" class="space-y-4">
          <Input
            v-model="email"
            type="email"
            label="Adresse email"
            placeholder="votre@email.com"
            icon="Mail"
            required
          />

          <Button
            type="submit"
            variant="primary"
            :loading="loading"
            class="w-full"
          >
            Recevoir mon lien de connexion
          </Button>
        </form>

        <!-- Success Message -->
        <div v-else class="text-center py-4">
          <div class="text-4xl mb-4">📬</div>
          <h2 class="text-xl font-bold text-dark mb-2">Email envoyé !</h2>
          <p class="text-dark/60 text-sm mb-6">
            Un lien de connexion a été envoyé à
            <span class="font-bold text-dark">{{ email }}</span>.
            Vérifiez votre boîte de réception.
          </p>
          <Button
            variant="ghost"
            @click="sent = false"
          >
            Renvoyer un lien
          </Button>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="mt-4">
          <InfoNote variant="warning">
            {{ error }}
          </InfoNote>
        </div>
      </Card>

      <!-- Back to Home -->
      <div class="mt-6 text-center">
        <Button variant="ghost" icon="ArrowLeft" to="/">
          Retour à l'accueil
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
  ssr: false,
});

const supabase = useSupabaseClient();
const route = useRoute();
const { locale } = useI18n();

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
    const { error: signInError } = await supabase.auth.signInWithOtp({
      email: email.value,
      options: {
        emailRedirectTo: `${window.location.origin}/${locale.value}/confirm`,
      },
    });

    if (signInError) {
      console.error("Supabase OTP error:", signInError);
      error.value = signInError.message;
      return;
    }

    sent.value = true;
  } catch (err: any) {
    console.error("Login error:", err);
    error.value = err.message || "Erreur lors de l'envoi du lien";
  } finally {
    loading.value = false;
  }
};

useHead({
  title: "Mon Espace - Boticia",
});
</script>
