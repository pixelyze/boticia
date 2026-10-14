<template>
  <AuthSplit>
    <!-- Magic Link Form -->
    <template v-if="!sent">
      <p class="text-xs uppercase tracking-widest text-dark/60 mb-4">
        {{ $t("login_page.eyebrow") }}
      </p>
      <h1
        class="font-heading text-3xl md:text-4xl leading-tight text-balance text-dark mb-4"
      >
        {{ $t("login_page.title") }}
      </h1>
      <p class="text-dark/70 leading-relaxed mb-8">
        {{ $t("login_page.intro") }}
      </p>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <Input
          v-model="email"
          type="email"
          :label="$t('login_page.email_label')"
          :placeholder="$t('login_page.email_placeholder')"
          icon="Mail"
          variant="soft"
          required
        />
        <Button
          type="submit"
          variant="primary"
          :loading="loading"
          class="w-full justify-center"
        >
          {{ $t("login_page.submit") }}
        </Button>
      </form>
    </template>

    <!-- Success -->
    <div v-else>
      <div
        class="w-14 h-14 rounded-full bg-cream-light flex items-center justify-center mb-6"
      >
        <IconLucid name="MailCheck" class="w-6 h-6 text-dark" />
      </div>
      <h1
        class="font-heading text-3xl md:text-4xl leading-tight text-balance text-dark mb-4"
      >
        {{ $t("login_page.sent_title") }}
      </h1>
      <i18n-t
        keypath="login_page.sent_message"
        tag="p"
        class="text-dark/70 leading-relaxed mb-8"
      >
        <template #email>
          <span class="font-semibold text-dark break-all">{{ email }}</span>
        </template>
      </i18n-t>
      <Button
        variant="default"
        class="w-full justify-center"
        @click="sent = false"
      >
        {{ $t("login_page.resend") }}
      </Button>
    </div>

    <!-- Error -->
    <div v-if="error" class="mt-4">
      <InfoNote variant="warning">{{ error }}</InfoNote>
    </div>

    <!-- CTA devis -->
    <template #footer>
      <p
        class="pt-6 border-t border-dark/10 text-sm text-dark/60"
      >
        {{ $t("login_page.not_client") }}
        <Button
          variant="ghost"
          :to="localePath('/devis')"
          class="!p-0 !font-normal text-sm underline underline-offset-4 decoration-dark/30 hover:decoration-dark hover:!bg-transparent"
        >
          {{ $t("login_page.quote_cta") }}
        </Button>
      </p>
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
    error.value = t("login_page.error");
  } finally {
    loading.value = false;
  }
};

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
