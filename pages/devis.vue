<template>
  <div>
    <!-- Success state -->
    <template v-if="submitted">
      <section class="py-20 md:py-28 bg-white">
        <div class="container mx-auto px-6 max-w-2xl text-center">
          <div
            class="w-20 h-20 mx-auto mb-8 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center"
          >
            <IconLucid name="Check" size="lg" class="text-green-600" />
          </div>

          <h1 class="section-title-lg">
            {{ t("quote_form.success_title") }}
          </h1>
          <p class="text-dark/60 text-lg md:text-xl mt-4">
            {{ t("quote_form.success_message") }}
          </p>

          <!-- Process steps -->
          <div
            class="mt-14 rounded-[2rem] border-2 border-dark/10 bg-cream/50 px-8 md:px-12 py-10 text-left"
          >
            <div class="space-y-6">
              <div
                v-for="(step, i) in successSteps"
                :key="i"
                class="flex items-center gap-5"
              >
                <span
                  class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-heading shrink-0"
                  :class="
                    i === 0
                      ? 'bg-terracotta/15 text-terracotta font-bold'
                      : 'bg-dark/5 text-dark/40'
                  "
                >
                  {{ i + 1 }}
                </span>
                <span class="text-dark/70 text-lg">{{ step }}</span>
              </div>
            </div>
          </div>

          <div class="mt-12">
            <Button variant="primary" :to="localePath('/')">
              {{ t("common.back_to_home") }}
            </Button>
          </div>
        </div>
      </section>
    </template>

    <!-- Form -->
    <template v-else>
      <!-- Hero -->
      <section class="pt-10 pb-12 bg-white">
        <div class="container mx-auto px-6 text-center">
          <span class="section-tagline">
            {{ t("quote_form.tagline") }}
          </span>
          <h1 class="section-title-lg">
            {{ t("quote_form.title") }}
          </h1>
          <p class="text-dark/60 text-lg md:text-xl mt-4 max-w-xl mx-auto">
            {{ t("quote_form.subtitle") }}
          </p>
        </div>
      </section>

      <form class="bg-white" @submit.prevent="handleSubmit">
        <!-- Section 1: General info -->
        <section class="py-16 md:py-20">
          <div class="container mx-auto px-6">
            <h2 class="font-heading text-2xl md:text-3xl text-dark mb-12">
              {{ t("quote_form.section_info") }}
            </h2>

            <div class="space-y-8">
              <!-- Partner names -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm uppercase tracking-[0.15em] text-dark/50 mb-3">
                    {{ t("quote_form.partner1_label") }}
                  </label>
                  <input
                    v-model="form.partner1_name"
                    type="text"
                    :placeholder="t('quote_form.partner1_placeholder')"
                    class="w-full h-14 px-5 rounded-2xl border-2 bg-cream/30 focus:bg-white focus:outline-none transition-all"
                    :class="
                      errors.partner1_name
                        ? 'border-red-400'
                        : 'border-dark/10 focus:border-dark/30'
                    "
                  />
                  <p
                    v-if="errors.partner1_name"
                    class="mt-2 text-sm text-red-500"
                  >
                    {{ errors.partner1_name }}
                  </p>
                </div>
                <div>
                  <label class="block text-sm uppercase tracking-[0.15em] text-dark/50 mb-3">
                    {{ t("quote_form.partner2_label") }}
                  </label>
                  <input
                    v-model="form.partner2_name"
                    type="text"
                    :placeholder="t('quote_form.partner2_placeholder')"
                    class="w-full h-14 px-5 rounded-2xl border-2 bg-cream/30 focus:bg-white focus:outline-none transition-all"
                    :class="
                      errors.partner2_name
                        ? 'border-red-400'
                        : 'border-dark/10 focus:border-dark/30'
                    "
                  />
                  <p
                    v-if="errors.partner2_name"
                    class="mt-2 text-sm text-red-500"
                  >
                    {{ errors.partner2_name }}
                  </p>
                </div>
              </div>

              <!-- Email + phone -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm uppercase tracking-[0.15em] text-dark/50 mb-3">
                    {{ t("quote_form.email_label") }}
                  </label>
                  <input
                    v-model="form.email"
                    type="email"
                    :placeholder="t('quote_form.email_placeholder')"
                    class="w-full h-14 px-5 rounded-2xl border-2 bg-cream/30 focus:bg-white focus:outline-none transition-all"
                    :class="
                      errors.email
                        ? 'border-red-400'
                        : 'border-dark/10 focus:border-dark/30'
                    "
                  />
                  <p
                    v-if="errors.email"
                    class="mt-2 text-sm text-red-500"
                  >
                    {{ errors.email }}
                  </p>
                </div>
                <div>
                  <label class="block text-sm uppercase tracking-[0.15em] text-dark/50 mb-3">
                    {{ t("quote_form.phone_label") }}
                  </label>
                  <input
                    v-model="form.phone"
                    type="tel"
                    :placeholder="t('quote_form.phone_placeholder')"
                    class="w-full h-14 px-5 rounded-2xl border-2 border-dark/10 bg-cream/30 focus:bg-white focus:border-dark/30 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <!-- Date + venue -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm uppercase tracking-[0.15em] text-dark/50 mb-3">
                    {{ t("quote_form.date_label") }}
                  </label>
                  <input
                    v-model="form.wedding_date"
                    type="date"
                    :min="minDate"
                    class="w-full h-14 px-5 rounded-2xl border-2 border-dark/10 bg-cream/30 focus:bg-white focus:border-dark/30 focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label class="block text-sm uppercase tracking-[0.15em] text-dark/50 mb-3">
                    {{ t("quote_form.venue_label") }}
                  </label>
                  <input
                    v-model="form.venue"
                    type="text"
                    :placeholder="t('quote_form.venue_placeholder')"
                    class="w-full h-14 px-5 rounded-2xl border-2 border-dark/10 bg-cream/30 focus:bg-white focus:border-dark/30 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <!-- Budget — radio cards -->
              <div>
                <label class="block text-sm uppercase tracking-[0.15em] text-dark/50 mb-4">
                  {{ t("quote_form.budget_label") }}
                </label>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button
                    v-for="opt in budgetOptions"
                    :key="opt.value"
                    type="button"
                    class="h-14 px-6 rounded-2xl border-2 font-medium transition-all duration-200"
                    :class="
                      form.budget === opt.value
                        ? 'bg-dark text-cream border-dark'
                        : 'bg-cream/30 text-dark/60 border-dark/10 hover:border-dark/30 hover:text-dark'
                    "
                    @click="form.budget = form.budget === opt.value ? '' : opt.value"
                  >
                    {{ opt.label }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Separator -->
        <div class="container mx-auto px-6">
          <div class="h-px bg-dark/10"></div>
        </div>

        <!-- Section 2: Floral needs — checkbox cards -->
        <section class="py-16 md:py-20">
          <div class="container mx-auto px-6">
            <h2 class="font-heading text-2xl md:text-3xl text-dark mb-12">
              {{ t("quote_form.section_floral") }}
            </h2>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <button
                v-for="need in floralNeeds"
                :key="need"
                type="button"
                class="group flex items-center gap-4 px-6 py-5 rounded-[1.25rem] border-2 text-left transition-all duration-200"
                :class="
                  selectedNeeds.has(need)
                    ? 'bg-dark border-dark'
                    : 'bg-white border-dark/10 hover:border-dark/30'
                "
                @click="toggleNeed(need)"
              >
                <!-- Checkbox indicator -->
                <span
                  class="w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all duration-200"
                  :class="
                    selectedNeeds.has(need)
                      ? 'bg-cream border-cream'
                      : 'border-dark/20 group-hover:border-dark/40'
                  "
                >
                  <IconLucid
                    v-if="selectedNeeds.has(need)"
                    name="Check"
                    size="xs"
                    class="text-dark"
                  />
                </span>

                <span
                  class="font-medium transition-colors duration-200"
                  :class="
                    selectedNeeds.has(need)
                      ? 'text-cream'
                      : 'text-dark/70 group-hover:text-dark'
                  "
                >
                  {{ t(`quote_form.need_${need}`) }}
                </span>
              </button>
            </div>

            <p
              v-if="errors.floral_needs"
              class="mt-4 text-sm text-red-500"
            >
              {{ errors.floral_needs }}
            </p>
          </div>
        </section>

        <!-- Submit -->
        <section class="pb-20 md:pb-28">
          <div class="container mx-auto px-6 text-center">
            <p
              v-if="errors.generic"
              class="mb-6 text-sm text-red-500"
            >
              {{ errors.generic }}
            </p>
            <Button
              variant="primary"
              icon="Send"
              :loading="loading"
              @click="handleSubmit"
            >
              {{ t("quote_form.submit") }}
            </Button>
          </div>
        </section>
      </form>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { useI18n } from "vue-i18n";
import type { FloralNeedKey } from "~/server/utils/quotes-types";

definePageMeta({
  layout: "default",
});

const { t, locale } = useI18n();
const localePath = useLocalePath();

useHead({
  title: t("quote_form.page_title") + " - Boticia",
});

// Form state
const form = reactive({
  partner1_name: "",
  partner2_name: "",
  email: "",
  phone: "",
  wedding_date: "",
  venue: "",
  budget: "",
});

const selectedNeeds = ref<Set<FloralNeedKey>>(new Set());
const loading = ref(false);
const submitted = ref(false);

const errors = reactive({
  partner1_name: "",
  partner2_name: "",
  email: "",
  floral_needs: "",
  generic: "",
});

// Min date = today
const minDate = computed(() => {
  const d = new Date();
  return d.toISOString().split("T")[0];
});

// Budget options
const budgetOptions = computed(() => [
  { label: t("quote_form.budget_lt_2500"), value: "lt_2500" },
  { label: t("quote_form.budget_lt_4000"), value: "lt_4000" },
  { label: t("quote_form.budget_lt_10000"), value: "lt_10000" },
]);

// Floral needs
const floralNeeds: FloralNeedKey[] = [
  "bridal_bouquet",
  "bridesmaid_bouquet",
  "boutonnieres",
  "ceremony_arch",
  "ceremony_aisle",
  "table_centerpieces",
  "table_runner",
  "welcome_sign",
  "cocktail_decor",
  "cake_flowers",
  "hair_flowers",
  "venue_entrance",
];

const toggleNeed = (key: FloralNeedKey) => {
  if (selectedNeeds.value.has(key)) {
    selectedNeeds.value.delete(key);
  } else {
    selectedNeeds.value.add(key);
  }
  errors.floral_needs = "";
};

// Success steps
const successSteps = computed(() => [
  t("quote_form.success_step_1"),
  t("quote_form.success_step_2"),
  t("quote_form.success_step_3"),
  t("quote_form.success_step_4"),
  t("quote_form.success_step_5"),
]);

// Validation
const validate = (): boolean => {
  let valid = true;

  errors.partner1_name = "";
  errors.partner2_name = "";
  errors.email = "";
  errors.floral_needs = "";
  errors.generic = "";

  if (!form.partner1_name.trim()) {
    errors.partner1_name = t("quote_form.error_partner1");
    valid = false;
  }

  if (!form.partner2_name.trim()) {
    errors.partner2_name = t("quote_form.error_partner2");
    valid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.email.trim() || !emailRegex.test(form.email)) {
    errors.email = t("quote_form.error_email");
    valid = false;
  }

  if (selectedNeeds.value.size === 0) {
    errors.floral_needs = t("quote_form.error_needs");
    valid = false;
  }

  return valid;
};

// Submit
const handleSubmit = async () => {
  if (!validate()) return;

  loading.value = true;
  errors.generic = "";

  try {
    await $fetch("/api/quotes", {
      method: "POST",
      body: {
        partner1_name: form.partner1_name.trim(),
        partner2_name: form.partner2_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        wedding_date: form.wedding_date || undefined,
        venue: form.venue.trim() || undefined,
        budget: form.budget || undefined,
        floral_needs: Array.from(selectedNeeds.value),
        locale: locale.value,
      },
    });

    submitted.value = true;
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch {
    errors.generic = t("quote_form.error_generic");
  } finally {
    loading.value = false;
  }
};
</script>
