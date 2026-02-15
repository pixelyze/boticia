<template>
  <div class="min-h-screen bg-cream flex items-center justify-center px-6">
    <div class="text-center">
      <div class="text-4xl mb-4">{{ error ? '❌' : '⏳' }}</div>
      <h1 class="text-2xl font-bold text-dark mb-2">
        {{ error ? 'Erreur de connexion' : 'Connexion en cours...' }}
      </h1>
      <p v-if="error" class="text-dark/60 mb-6">{{ error }}</p>
      <Button v-if="error" variant="primary" to="/login">
        Réessayer
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
  ssr: false,
});

const supabase = useSupabaseClient();
const router = useRouter();
const { locale } = useI18n();

const error = ref("");

onMounted(async () => {
  try {
    // Écouter l'événement de connexion (gère le hash #access_token=...)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        subscription.unsubscribe();
        await router.replace(`/${locale.value}/dashboard`);
      }
    });

    // Vérifier si déjà connecté (session existante)
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user) {
      subscription.unsubscribe();
      await router.replace(`/${locale.value}/dashboard`);
      return;
    }

    // Timeout après 5 secondes
    setTimeout(() => {
      if (!error.value) {
        error.value = "Lien expiré ou invalide. Veuillez en demander un nouveau.";
      }
    }, 5000);
  } catch (err: any) {
    error.value = err.message || "Erreur inattendue";
  }
});
</script>
