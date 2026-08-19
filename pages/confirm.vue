<template>
  <div class="min-h-screen bg-cream flex items-center justify-center px-6">
    <div class="text-center">
      <div class="text-4xl mb-4">{{ error ? '❌' : '⏳' }}</div>
      <h1 class="text-2xl font-bold text-dark mb-2">
        {{ error ? 'Erreur de connexion' : 'Connexion en cours...' }}
      </h1>
      <p v-if="error" class="text-dark/60 mb-6">{{ error }}</p>
      <Button v-if="error" variant="primary" :to="retryLink">
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
const route = useRoute();
const { locale } = useI18n();
const localePath = useLocalePath();

const error = ref("");

// Destination demandée avant la connexion (ex : la fiche devis du lien
// magique). Validée pour éviter toute redirection hors du site.
const redirectTarget = computed(() =>
  safeRedirectPath(route.query.redirect)
);

// Si le lien magique est expiré, on renvoie vers la connexion en gardant la
// destination : après login elle atterrit sur la fiche, pas sur l'accueil.
const retryLink = computed(() => {
  const login = localePath("/login");
  return redirectTarget.value
    ? `${login}?redirect=${encodeURIComponent(redirectTarget.value)}`
    : login;
});

async function redirectByRole(email: string) {
  try {
    const roleData = await $fetch<{
      role: string;
      quoteId?: string;
    }>("/api/user/role", {
      params: { email },
    });

    if (roleData.role === "admin") {
      await router.replace(
        redirectTarget.value || `/${locale.value}/dashboard`
      );
    } else if (roleData.role === "client") {
      await router.replace(`/${locale.value}/mon-projet`);
    } else {
      error.value =
        "Aucun projet trouvé pour cette adresse email.";
    }
  } catch {
    await router.replace(`/${locale.value}/dashboard`);
  }
}

/**
 * Consomme le jeton du lien magique.
 *
 * Le lien porte un `token_hash` plutôt que les jetons en fragment d'URL :
 * le client vient de @supabase/ssr, qui impose `flowType: 'pkce'` et fait
 * rejeter tout callback implicite par auth-js. verifyOtp() fonctionne quel
 * que soit le flux.
 */
async function consumeTokenHash(): Promise<boolean> {
  const tokenHash = route.query.token_hash;
  if (typeof tokenHash !== "string" || !tokenHash) return false;

  const type = route.query.type === "recovery" ? "recovery" : "magiclink";

  const { data, error: verifyError } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type,
  });

  if (verifyError || !data.session?.user) {
    console.error("verifyOtp failed:", verifyError);
    error.value =
      "Lien expiré ou invalide. Veuillez en demander un nouveau.";
    return true;
  }

  await redirectByRole(data.session.user.email || "");
  return true;
}

onMounted(async () => {
  try {
    if (await consumeTokenHash()) return;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          subscription.unsubscribe();
          await redirectByRole(session.user.email || "");
        }
      }
    );

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user) {
      subscription.unsubscribe();
      await redirectByRole(session.user.email || "");
      return;
    }

    setTimeout(() => {
      if (!error.value) {
        error.value =
          "Lien expiré ou invalide. Veuillez en demander un nouveau.";
      }
    }, 5000);
  } catch (err: any) {
    error.value = err.message || "Erreur inattendue";
  }
});
</script>
