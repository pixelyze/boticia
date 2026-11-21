<template>
  <AuthSplit>
    <!-- Étape 1 : adresse email -->
    <template v-if="!sent">
      <p class="section-tagline">
        {{ $t("login_page.eyebrow") }}
      </p>
      <h1 class="section-title-lg text-balance mb-5">
        {{ $t("login_page.title") }}
      </h1>
      <p class="para mb-10">
        {{ $t("login_page.intro") }}
      </p>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <!-- Attributs mobiles : iOS/Android proposent l'adresse au-dessus du
             clavier (autocomplete), sans majuscule ni correction auto. -->
        <Input
          v-model="email"
          type="email"
          name="email"
          :label="$t('login_page.email_label')"
          :placeholder="$t('login_page.email_placeholder')"
          variant="line"
          autocomplete="email"
          inputmode="email"
          autocapitalize="off"
          autocorrect="off"
          spellcheck="false"
          enterkeyhint="go"
          required
        />
        <Button
          type="submit"
          variant="cta"
          :loading="loading"
          class="w-full justify-center"
        >
          {{ $t("login_page.submit") }}
        </Button>
      </form>
    </template>

    <!-- Étape 2 : saisie du code reçu par email -->
    <div v-else>
      <Button
        type="button"
        variant="ghost"
        icon="ArrowLeft"
        icon-only
        class="!w-10 !h-10 justify-center !border !border-dark/20 !text-dark
          hover:!border-dark hover:!bg-transparent mb-8"
        :aria-label="$t('login_page.back_to_email')"
        :title="$t('login_page.back_to_email')"
        @click="backToEmail"
      />
      <h1 class="section-title-lg !mt-0 text-balance mb-5">
        {{ $t("login_page.code_title") }}
      </h1>
      <p class="para">
        {{ $t("login_page.code_intro") }}
      </p>
      <p class="para font-semibold break-all mt-1 mb-10">{{ email }}</p>

      <form @submit.prevent="verifyCode" class="space-y-6">
        <!-- Pas de maxlength : un code collé avec espaces (« 123 456 »)
             serait coupé avant nettoyage. onCodeInput garde 6 chiffres. -->
        <Input
          :model-value="code"
          type="text"
          :placeholder="$t('login_page.code_placeholder')"
          :aria-label="$t('login_page.code_placeholder')"
          variant="line"
          inputmode="numeric"
          autocomplete="one-time-code"
          class="!h-14 text-lg tracking-[0.3em] placeholder:tracking-normal"
          :error="codeError"
          @update:model-value="onCodeInput"
        />
        <Button
          type="submit"
          variant="cta"
          :loading="verifying"
          :disabled="code.length !== 6"
          class="w-full justify-center"
        >
          {{ $t("login_page.code_submit") }}
        </Button>
        <Button
          type="button"
          variant="link"
          :loading="loading"
          class="!flex mx-auto w-fit"
          @click="resendCode"
        >
          {{ $t("login_page.code_resend") }}
        </Button>
      </form>
      <p v-if="resent" class="text-sm text-green-700 mt-3">
        {{ $t("login_page.code_resent") }}
      </p>
    </div>

    <!-- Error -->
    <div v-if="error" class="mt-4">
      <InfoNote variant="warning">{{ error }}</InfoNote>
    </div>

    <!-- CTA devis -->
    <template #footer>
      <div
        class="pt-6 border-t border-dark/20 flex flex-col items-start gap-3"
      >
        <p class="para-small">{{ $t("login_page.not_client") }}</p>
        <Button variant="link" :to="localePath('/devis')">
          {{ $t("login_page.quote_cta") }}
        </Button>
      </div>
    </template>
  </AuthSplit>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
  ssr: false,
});

const route = useRoute();
const { t, locale } = useI18n();
const localePath = useLocalePath();

const supabase = useSupabaseClient();
const { redirectByRole } = useAuthRedirect();

// State
const email = ref("");
const loading = ref(false);
const error = ref("");
const sent = ref(false);
const code = ref("");
const codeError = ref("");
const verifying = ref(false);
const resent = ref(false);

/**
 * Envoie l'email de connexion : un code à 6 chiffres, et le lien magique
 * en secours. L'envoi passe par le serveur : signInWithOtp() créait un
 * compte pour n'importe quelle adresse saisie ici. La destination demandée
 * (ex : une fiche devis) est transmise pour traverser le lien magique.
 */
async function requestCode(): Promise<boolean> {
  loading.value = true;
  error.value = "";

  try {
    await $fetch("/api/auth/request-login", {
      method: "POST",
      body: {
        email: email.value,
        redirect: safeRedirectPath(route.query.redirect) || undefined,
        locale: locale.value,
      },
    });
    return true;
  } catch (err: any) {
    console.error("Login error:", err);
    error.value = t("login_page.error");
    return false;
  } finally {
    loading.value = false;
  }
}

// Étape 1 : la réponse est la même que l'adresse soit connue ou non,
// on passe donc toujours à la saisie du code.
const handleLogin = async () => {
  if (await requestCode()) {
    code.value = "";
    codeError.value = "";
    sent.value = true;
  }
};

// Un nouveau code annule le précédent. En production, Supabase n'en
// renvoie pas un au même compte moins de 60 s après le précédent.
async function resendCode() {
  resent.value = false;
  code.value = "";
  codeError.value = "";
  resent.value = await requestCode();
}

// Retour à l'étape 1 avec un champ vide, pour saisir une autre adresse.
function backToEmail() {
  sent.value = false;
  email.value = "";
  resent.value = false;
  code.value = "";
  codeError.value = "";
}

// Chiffres seulement (le copier-coller peut apporter des espaces). La
// vérification attend le clic sur « Continuer » (ou Entrée).
function onCodeInput(value: string) {
  code.value = value.replace(/\D/g, "").slice(0, 6);
  codeError.value = "";
}

// Étape 2 : vérifie le code auprès de Supabase, puis redirige selon le rôle.
async function verifyCode() {
  if (code.value.length !== 6 || verifying.value) return;
  verifying.value = true;
  codeError.value = "";
  error.value = "";

  try {
    const { data, error: verifyError } = await supabase.auth.verifyOtp({
      email: email.value.trim().toLowerCase(),
      token: code.value,
      type: "email",
    });

    if (verifyError || !data.session) {
      codeError.value = t("login_page.code_invalid");
      return;
    }

    if (!(await redirectByRole())) {
      error.value = t("confirm_page.no_project");
    }
  } catch (err) {
    console.error("Code verification error:", err);
    codeError.value = t("login_page.code_invalid");
  } finally {
    verifying.value = false;
  }
}

useHead({
  title: `${t("nav.login")} - Boticia`,
  meta: [
    {
      key: "description",
      name: "description",
      content: t("seo.login_description"),
    },
  ],
});
</script>
