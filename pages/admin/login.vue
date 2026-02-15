<template>
  <div class="min-h-screen bg-cream flex items-center justify-center px-6">
    <Card class="max-w-md w-full">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-dark mb-2">Admin CMS</h1>
        <p class="text-dark/60">Connectez-vous pour accéder au CMS</p>
      </div>

      <!-- Email Login Form -->
      <form @submit.prevent="handleEmailLogin" class="space-y-4">
        <Input
          v-model="email"
          type="email"
          label="Email"
          placeholder="admin@boticia.com"
          icon="Mail"
          required
        />

        <Input
          v-model="password"
          type="password"
          label="Mot de passe"
          placeholder="••••••••"
          required
        />

        <Button
          type="submit"
          variant="primary"
          :loading="loading"
          class="w-full"
        >
          Se connecter
        </Button>
      </form>

      <!-- Error Message -->
      <div v-if="error" class="mt-4">
        <InfoNote variant="warning">
          {{ error }}
        </InfoNote>
      </div>

      <!-- Magic Link Option -->
      <div class="mt-6 pt-6 border-t-2 border-dark/10">
        <p class="text-sm text-dark/60 text-center mb-4">
          Ou connectez-vous par lien magique
        </p>

        <form @submit.prevent="handleMagicLink" class="space-y-4">
          <Input
            v-model="magicEmail"
            type="email"
            placeholder="votre@email.com"
            icon="Mail"
            required
          />

          <Button
            type="submit"
            variant="ghost"
            :loading="magicLoading"
            class="w-full"
          >
            Envoyer un lien magique
          </Button>
        </form>

        <div v-if="magicSent" class="mt-4">
          <InfoNote variant="success">
            Lien magique envoyé ! Vérifiez votre email.
          </InfoNote>
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
  ssr: false,
});

const supabase = useSupabaseClient();
const route = useRoute();
const router = useRouter();

// State
const email = ref("");
const password = ref("");
const magicEmail = ref("");
const loading = ref(false);
const magicLoading = ref(false);
const error = ref("");
const magicSent = ref(false);

// Email/Password Login
const handleEmailLogin = async () => {
  loading.value = true;
  error.value = "";

  try {
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });

    if (signInError) {
      error.value = signInError.message;
      return;
    }

    if (data.user) {
      // Redirect to requested page or CMS home
      const redirectTo = (route.query.redirect as string) || "/admin/cms";
      await router.push(redirectTo);
    }
  } catch (err: any) {
    error.value = err.message || "Erreur de connexion";
  } finally {
    loading.value = false;
  }
};

// Magic Link Login
const handleMagicLink = async () => {
  magicLoading.value = true;
  error.value = "";
  magicSent.value = false;

  try {
    const redirectTo = (route.query.redirect as string) || "/admin/cms";
    const { error: magicError } = await supabase.auth.signInWithOtp({
      email: magicEmail.value,
      options: {
        emailRedirectTo: `${window.location.origin}${redirectTo}`,
      },
    });

    if (magicError) {
      error.value = magicError.message;
      return;
    }

    magicSent.value = true;
  } catch (err: any) {
    error.value = err.message || "Erreur lors de l'envoi du lien magique";
  } finally {
    magicLoading.value = false;
  }
};

useHead({
  title: "Admin Login - CMS",
});
</script>
