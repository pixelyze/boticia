<template>
  <!-- ==========================================
       [PAGE-CONNEXION-ADMIN] — Connexion admin par mot de passe, sans
       code par email. Réservée aux comptes admin : un autre compte est
       déconnecté aussitôt. Page non indexée (meta + en-tête X-Robots-Tag
       dans nuxt.config.ts) et absente du plan du site.
       ========================================== -->
  <AuthSplit>
    <p class="section-tagline">
      {{ $t("admin_login.eyebrow") }}
    </p>
    <h1 class="section-title-lg text-balance mb-10">
      {{ $t("admin_login.title") }}
    </h1>

    <form class="space-y-6" @submit.prevent="handleLogin">
      <Input
        v-model="email"
        type="email"
        name="email"
        :label="$t('admin_login.email_label')"
        variant="line"
        autocomplete="username"
        inputmode="email"
        autocapitalize="off"
        autocorrect="off"
        spellcheck="false"
        required
      />
      <Input
        v-model="password"
        type="password"
        name="password"
        :label="$t('admin_login.password_label')"
        variant="line"
        autocomplete="current-password"
        enterkeyhint="go"
        required
      />
      <Button
        type="submit"
        variant="cta"
        :loading="loading"
        class="w-full justify-center"
      >
        {{ $t("admin_login.submit") }}
      </Button>
    </form>

    <div v-if="error" class="mt-4" role="alert">
      <InfoNote variant="warning">{{ error }}</InfoNote>
    </div>
  </AuthSplit>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
  ssr: false,
});

const { t, locale } = useI18n();
const router = useRouter();
const route = useRoute();
const supabase = useSupabaseClient();

const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");

// Message neutre : ne dit jamais si c'est l'email ou le mot de passe
// qui est faux, ni si le compte existe.
const fail = () => {
  error.value = t("admin_login.error");
};

async function handleLogin() {
  if (loading.value) return;
  loading.value = true;
  error.value = "";

  try {
    const { data, error: signInError } =
      await supabase.auth.signInWithPassword({
        email: email.value.trim().toLowerCase(),
        password: password.value,
      });
    if (signInError || !data.session) return fail();

    // Seul un compte admin entre. Les autres sont déconnectés tout de suite.
    const { role } = await $fetch<{ role: string }>("/api/user/role");
    if (role !== "admin") {
      await supabase.auth.signOut();
      return fail();
    }

    password.value = "";
    await router.replace(
      safeRedirectPath(route.query.redirect) || `/${locale.value}/dashboard`
    );
  } catch (err) {
    console.error("Admin login error:", err);
    await supabase.auth.signOut().catch(() => {});
    fail();
  } finally {
    loading.value = false;
  }
}

useHead({
  title: `${t("admin_login.title")} - Boticia`,
  meta: [{ name: "robots", content: "noindex, nofollow" }],
});
</script>
