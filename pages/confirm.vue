<template>
  <AuthSplit>
    <!-- Erreur : lien expiré, déjà utilisé ou sans projet -->
    <template v-if="error">
      <div
        class="w-14 h-14 rounded-full bg-cream-light flex items-center justify-center mb-6"
      >
        <IconLucid name="AlertCircle" class="w-6 h-6 text-dark" />
      </div>
      <h1
        class="font-heading text-3xl md:text-4xl leading-tight text-balance text-dark mb-4"
      >
        {{ $t("confirm_page.error_title") }}
      </h1>
      <p class="text-dark/70 leading-relaxed mb-8">{{ error }}</p>
      <Button variant="primary" :to="retryLink" class="w-full justify-center">
        {{ $t("confirm_page.retry") }}
      </Button>
    </template>

    <!-- Connexion en cours -->
    <template v-else>
      <div
        class="w-14 h-14 rounded-full bg-cream-light flex items-center justify-center mb-6"
      >
        <IconLucid name="Loader2" class="w-6 h-6 text-dark animate-spin" />
      </div>
      <h1
        class="font-heading text-3xl md:text-4xl leading-tight text-balance text-dark mb-4"
      >
        {{ $t("confirm_page.loading_title") }}
      </h1>
      <p class="text-dark/70 leading-relaxed">
        {{ $t("confirm_page.loading_text") }}
      </p>
    </template>
  </AuthSplit>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
  ssr: false,
});

const supabase = useSupabaseClient();
const router = useRouter();
const route = useRoute();
const { t, locale } = useI18n();
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
      error.value = t("confirm_page.no_project");
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
    error.value = t("confirm_page.expired");
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
        error.value = t("confirm_page.expired");
      }
    }, 5000);
  } catch (err: any) {
    console.error("Confirm error:", err);
    error.value = t("confirm_page.unexpected");
  }
});
</script>
