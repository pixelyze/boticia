<template>
  <div class="flex-1 flex flex-col bg-gray-50">
    <!-- Breadcrumb (hidden on login page) -->
    <div v-if="isAuthenticated && currentUser" class="bg-gray-50 border-b border-gray-200">
      <Breadcrumb :items="breadcrumbItems" />
    </div>

    <!-- Loading -->
    <div v-if="isCheckingAuth" class="py-12 md:py-16">
      <div class="container mx-auto px-6">
        <div class="max-w-4xl mx-auto animate-pulse">
          <div class="h-7 bg-gray-200 rounded w-48 mb-2"></div>
          <div class="h-4 bg-gray-100 rounded w-32 mb-8"></div>
          <div class="space-y-4">
            <div class="h-32 bg-gray-200 rounded"></div>
            <div class="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Authenticated dashboard -->
    <template v-else-if="isAuthenticated && currentUser">
      <section class="py-12 md:py-16">
        <div class="container mx-auto px-6">
          <div class="max-w-2xl mx-auto">
            <!-- Welcome -->
            <div class="mb-8">
              <h1 class="text-2xl md:text-3xl font-bold">
                {{ greeting }}, {{ userDisplayName }}
              </h1>
              <p class="text-gray-600 mt-1">{{ currentUser.email }}</p>
            </div>

            <!-- Items list -->
            <div v-if="isLoadingItems" class="text-center py-8">
              <p class="text-gray-500">{{ t("dashboard.loading") }}...</p>
            </div>

            <div v-else-if="items.length === 0" class="text-center py-16">
              <StatusIcon type="info" class="mx-auto mb-6" />
              <h2 class="text-xl font-bold mb-2">{{ t("dashboard.empty_title") }}</h2>
              <p class="text-gray-600 mb-8">{{ t("dashboard.empty_message") }}</p>
              <Button variant="primary" :to="localePath('/')">
                {{ t("dashboard.browse") }}
              </Button>
            </div>

            <div v-else class="space-y-6">
              <ItemCard
                v-for="item in items"
                :key="item.id"
                :title="item.title"
                :status="item.status"
                :status-label="t(`dashboard.status_${item.status}`)"
                :amount="formatAmount(item.amount_cents)"
                :date="formatDate(item.created_at)"
              />
            </div>

            <!-- Sign out & back -->
            <div class="mt-12 flex items-center justify-between">
              <Button variant="ghost" icon="ArrowLeft" :to="localePath('/')">
                {{ t("common.back_to_home") }}
              </Button>
              <Button variant="ghost" icon="LogOut" @click="handleSignOut">
                {{ t("dashboard.sign_out") }}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </template>

    <!-- Login form -->
    <template v-else>
      <div class="flex-1 flex items-center justify-center px-6 py-12">
        <div class="max-w-md w-full">
          <!-- Magic link sent -->
          <div v-if="magicLinkSent" class="text-center">
            <StatusIcon type="success" class="mb-8" />
            <h1 class="form-title mb-4">{{ t("auth.magic_link_sent_title") }}</h1>
            <p class="text-lg md:text-xl text-gray-700 mb-8">
              {{ t("auth.magic_link_sent_message", { email: submittedEmail }) }}
            </p>
            <div class="p-4 bg-gray-100 border-l-4 border-black text-left">
              <p class="text-sm text-gray-700">
                {{ t("auth.magic_link_hint") }}
              </p>
            </div>
          </div>

          <!-- Email form -->
          <div v-else>
            <h1 class="form-title mb-8">{{ t("auth.form_title") }}</h1>

            <form @submit.prevent="handleSubmit">
              <Input
                v-model="email"
                type="email"
                :label="t('auth.email_label')"
                :placeholder="t('auth.email_placeholder')"
                :error="error"
                required
                @input="error = ''"
              />

              <InfoNote class="mt-4 mb-6">
                {{ t("auth.email_hint") }}
              </InfoNote>

              <Button
                type="submit"
                variant="primary"
                :loading="isSubmitting"
                rightIcon="MoveRight"
                class="w-full"
                :disabled="!email.trim()"
              >
                {{ t("auth.send_magic_link") }}
              </Button>
            </form>
          </div>

          <!-- Back -->
          <div class="mt-8">
            <Button variant="ghost" icon="ArrowLeft" :to="localePath('/')">
              {{ t("common.back_to_home") }}
            </Button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";

interface AuthUser {
  id: string;
  email?: string;
}

definePageMeta({
  ssr: false,
  layout: 'dashboard'
});

const { t, locale } = useI18n();
const localePath = useLocalePath();

const breadcrumbItems = computed(() => [
  { label: t("common.home"), path: "/" },
  { label: t("dashboard.breadcrumb"), path: "/dashboard" },
]);

// Auth state
const isCheckingAuth = ref(true);
const isAuthenticated = ref(false);
const currentUser = ref<AuthUser | null>(null);
const { getClient: getSupabase } = useSupabase();

// Items
const items = ref<any[]>([]);
const isLoadingItems = ref(false);

// Greeting
const greeting = computed(() => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return t("dashboard.greeting_morning");
  if (hour >= 12 && hour < 18) return t("dashboard.greeting_afternoon");
  return t("dashboard.greeting_evening");
});

const userFirstName = ref<string | null>(null);

const userDisplayName = computed(() => {
  if (userFirstName.value) return userFirstName.value;
  if (!currentUser.value?.email) return "";
  const emailPart = currentUser.value.email.split("@")[0];
  return emailPart.charAt(0).toUpperCase() + emailPart.slice(1);
});

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const formatAmount = (cents: number): string => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
};

// Load items
const loadItems = async () => {
  if (!currentUser.value?.email) return;

  isLoadingItems.value = true;
  try {
    const response = await $fetch<{ items: any[] }>(
      `/api/user/items?email=${encodeURIComponent(currentUser.value.email)}`
    );
    items.value = response.items || [];
  } catch (err) {
    console.error("Error loading items:", err);
    items.value = [];
  } finally {
    isLoadingItems.value = false;
  }
};

// Check auth on mount
onMounted(async () => {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      isCheckingAuth.value = false;
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();

    if (session?.user) {
      isAuthenticated.value = true;
      currentUser.value = session.user;

      try {
        const roleResponse = await $fetch<{ isAdmin: boolean; fullName: string | null }>(
          `/api/user/role?email=${encodeURIComponent(session.user.email || '')}`
        );
        if (roleResponse.fullName) {
          userFirstName.value = roleResponse.fullName.split(' ')[0];
        }
      } catch (err) {
        console.error("Error checking role:", err);
      }

      await loadItems();
    }
  } catch (err) {
    console.error("Error checking auth:", err);
  } finally {
    isCheckingAuth.value = false;
  }
});

// Login form state
const email = ref("");
const error = ref("");
const isSubmitting = ref(false);
const magicLinkSent = ref(false);
const submittedEmail = ref("");

const handleSubmit = async () => {
  const emailValue = email.value.trim().toLowerCase();

  if (!emailValue) {
    error.value = t("auth.email_required");
    return;
  }

  isSubmitting.value = true;
  error.value = "";

  try {
    const supabase = getSupabase();
    if (!supabase) {
      error.value = t("auth.magic_link_error");
      return;
    }

    const redirectUrl = `${window.location.origin}/${locale.value}/dashboard/callback`;

    const { error: authError } = await supabase.auth.signInWithOtp({
      email: emailValue,
      options: {
        emailRedirectTo: redirectUrl,
        shouldCreateUser: false,
      },
    });

    if (authError) {
      if (authError.message.includes("Signups not allowed") || authError.status === 400) {
        error.value = t("auth.email_not_found");
      } else {
        error.value = t("auth.magic_link_error");
      }
      return;
    }

    submittedEmail.value = emailValue;
    magicLinkSent.value = true;
  } catch (err) {
    console.error("Error:", err);
    error.value = t("auth.magic_link_error");
  } finally {
    isSubmitting.value = false;
  }
};

// Sign out
const handleSignOut = async () => {
  const supabase = getSupabase();
  if (!supabase) return;

  await supabase.auth.signOut();
  isAuthenticated.value = false;
  currentUser.value = null;
  items.value = [];
};

useHead({
  title: t("dashboard.page_title"),
});
</script>
