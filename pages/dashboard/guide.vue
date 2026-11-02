<template>
  <div class="flex-1 flex flex-col bg-white">
    <section class="py-6 md:py-8">
      <div class="px-4 md:px-10 max-w-4xl">
        <!-- Header -->
        <div class="mb-10">
          <h1 class="text-2xl md:text-3xl font-bold">
            {{ t("guide.title") }}
          </h1>
          <p class="text-dark/40 mt-1">
            {{ t("guide.subtitle") }}
          </p>
        </div>

        <!-- Statuts -->
        <div class="mb-12">
          <h2 class="text-xl font-bold mb-6 flex items-center gap-2">
            <IconLucid name="Flag" size="sm" class="text-gray-500" />
            {{ t("guide.pipeline_title") }}
          </h2>
          <div class="space-y-3">
            <div
              v-for="status in statuses"
              :key="status.key"
              class="flex items-start gap-4 rounded-2xl bg-cream/50 px-5 py-4"
            >
              <span
                class="w-3 h-3 rounded-full shrink-0 mt-1.5"
                :class="status.dot"
              />
              <div class="flex-1 min-w-0">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="font-semibold text-dark">{{ status.label }}</span>
                  <span
                    class="text-xs px-2 py-0.5 rounded-full"
                    :class="status.auto ? 'bg-dark text-cream' : 'bg-dark/10 text-dark'"
                  >
                    {{ status.auto ? t("guide.auto") : t("guide.manual") }}
                  </span>
                </div>
                <p class="text-dark/50 text-sm mt-0.5">{{ status.desc }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Étapes -->
        <div class="space-y-10">
          <div
            v-for="(step, i) in steps"
            :key="i"
          >
            <div class="flex items-center gap-3 mb-4">
              <div class="w-8 h-8 rounded-full bg-dark flex items-center justify-center shrink-0">
                <span class="text-cream text-sm font-bold">{{ i + 1 }}</span>
              </div>
              <h2 class="text-lg font-bold">{{ step.title }}</h2>
            </div>

            <div class="ml-11 space-y-3">
              <!-- À faire -->
              <div class="flex items-start gap-2">
                <IconLucid name="MousePointerClick" size="xs" class="text-gray-400 mt-0.5 shrink-0" />
                <p class="text-dark/70 text-sm">
                  <span class="font-semibold text-dark">{{ t("guide.action") }} :</span>
                  {{ step.action }}
                </p>
              </div>

              <!-- Ce qui se passe -->
              <div class="flex items-start gap-2">
                <IconLucid name="Zap" size="xs" class="text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <span class="font-semibold text-dark text-sm">{{ t("guide.what_happens") }} :</span>
                  <ul class="mt-1 space-y-1">
                    <li
                      v-for="(item, j) in step.happens"
                      :key="j"
                      class="text-dark/60 text-sm flex items-start gap-2"
                    >
                      <span class="text-dark/30 mt-0.5">·</span>
                      <span>{{ item }}</span>
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Emails envoyés à cette étape -->
              <div
                v-if="step.emails.length"
                class="flex items-start gap-2 bg-cream/60 rounded-xl px-4 py-3"
              >
                <IconLucid name="Mail" size="xs" class="text-dark mt-0.5 shrink-0" />
                <div class="min-w-0">
                  <span class="font-semibold text-dark text-sm">{{ t("guide.emails_sent") }}</span>
                  <p
                    v-for="(email, j) in step.emails"
                    :key="j"
                    class="text-dark/70 text-sm mt-0.5"
                  >
                    {{ t("guide.to") }} {{ email.to }} : <em>{{ email.subject }}</em>
                  </p>
                </div>
              </div>

              <!-- Côté cliente -->
              <div
                v-if="step.clientSees"
                class="flex items-start gap-2"
              >
                <IconLucid name="Eye" size="xs" class="text-gray-400 mt-0.5 shrink-0" />
                <p class="text-dark/60 text-sm">
                  <span class="font-semibold text-dark">{{ t("guide.client_sees") }} :</span>
                  {{ step.clientSees }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Récapitulatif des emails -->
        <div class="mt-12">
          <h2 class="text-xl font-bold mb-2 flex items-center gap-2">
            <IconLucid name="Mail" size="sm" class="text-gray-500" />
            {{ t("guide.emails_title") }}
          </h2>
          <p class="text-sm text-dark/50 mb-4">{{ t("guide.emails_note") }}</p>
          <div class="overflow-x-auto rounded-2xl border border-dark/10">
            <table class="w-full text-sm">
              <thead>
                <tr class="bg-cream/50">
                  <th class="text-left px-4 py-3 font-semibold text-dark/60">{{ t("guide.when") }}</th>
                  <th class="text-left px-4 py-3 font-semibold text-dark/60">{{ t("guide.recipient") }}</th>
                  <th class="text-left px-4 py-3 font-semibold text-dark/60">{{ t("guide.subject") }}</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(email, i) in emails"
                  :key="i"
                  class="border-t border-dark/5"
                >
                  <td class="px-4 py-3 text-dark/70">{{ email.when }}</td>
                  <td class="px-4 py-3">
                    <span
                      class="text-xs px-2 py-0.5 rounded-full whitespace-nowrap"
                      :class="email.toYou ? 'bg-dark text-cream' : 'bg-dark/10 text-dark'"
                    >
                      {{ email.toYou ? t("guide.you") : t("guide.the_client") }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-dark/60 italic">{{ email.subject }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Les autres pages -->
        <div class="mt-12 mb-8">
          <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
            <IconLucid name="LayoutGrid" size="sm" class="text-gray-500" />
            {{ t("guide.pages_title") }}
          </h2>
          <div class="space-y-3">
            <div
              v-for="page in pages"
              :key="page.key"
              class="flex items-start gap-4 rounded-2xl bg-cream/50 px-5 py-4"
            >
              <IconLucid :name="page.icon" size="sm" class="text-dark mt-0.5 shrink-0" />
              <div>
                <span class="font-semibold text-dark">{{ page.title }}</span>
                <p class="text-dark/50 text-sm mt-0.5">{{ page.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  ssr: false,
  layout: "dashboard",
  middleware: ["auth-admin"],
  pageTransition: false,
  layoutTransition: false,
});

const { t } = useI18n();

const pageTitle = useState<string | null>("dashboard-page-title", () => null);
pageTitle.value = t("guide.title");

useHead({
  title: t("guide.title") + " - Boticia",
});

// Statuts proposés sur la fiche (voir statusOptions dans quotes/[id].vue)
// et ce qui les fait changer.
const statuses = computed(() => [
  { key: "new", dot: "bg-yellow-400", label: t("guide.status_new"), desc: t("guide.status_new_desc"), auto: true },
  { key: "contacted", dot: "bg-blue-400", label: t("guide.status_contacted"), desc: t("guide.status_contacted_desc"), auto: true },
  { key: "quote_sent", dot: "bg-orange-400", label: t("guide.status_quote"), desc: t("guide.status_quote_desc"), auto: true },
  { key: "signed", dot: "bg-green-400", label: t("guide.status_signed"), desc: t("guide.status_signed_desc"), auto: false },
  { key: "completed", dot: "bg-green-600", label: t("guide.status_completed"), desc: t("guide.status_completed_desc"), auto: false },
  { key: "cancelled", dot: "bg-red-400", label: t("guide.status_cancelled"), desc: t("guide.status_cancelled_desc"), auto: false },
]);

const toYou = () => t("guide.you").toLowerCase();
const toClient = () => t("guide.the_client").toLowerCase();

const steps = computed(() => [
  {
    title: t("guide.step1_title"),
    action: t("guide.step1_action"),
    happens: [t("guide.step1_h1"), t("guide.step1_h2"), t("guide.step1_h3")],
    emails: [
      { to: toYou(), subject: t("guide.email1_subject") },
      { to: toClient(), subject: t("guide.email2_subject") },
    ],
    clientSees: t("guide.step1_client"),
  },
  {
    title: t("guide.step2_title"),
    action: t("guide.step2_action"),
    happens: [t("guide.step2_h1"), t("guide.step2_h2")],
    emails: [],
    clientSees: null,
  },
  {
    title: t("guide.step3_title"),
    action: t("guide.step3_action"),
    happens: [t("guide.step3_h1"), t("guide.step3_h2"), t("guide.step3_h3")],
    emails: [{ to: toClient(), subject: t("guide.email4_subject") }],
    clientSees: t("guide.step3_client"),
  },
  {
    title: t("guide.step4_title"),
    action: t("guide.step4_action"),
    happens: [t("guide.step4_h1"), t("guide.step4_h2")],
    emails: [{ to: toClient(), subject: t("guide.email5_subject") }],
    clientSees: t("guide.step4_client"),
  },
  {
    title: t("guide.step5_title"),
    action: t("guide.step5_action"),
    happens: [t("guide.step5_h1"), t("guide.step5_h2")],
    emails: [
      { to: toYou(), subject: t("guide.email6_subject") },
      { to: toYou(), subject: t("guide.email7_subject") },
    ],
    clientSees: t("guide.step5_client"),
  },
  {
    title: t("guide.step6_title"),
    action: t("guide.step6_action"),
    happens: [t("guide.step6_h1"), t("guide.step6_h2"), t("guide.step6_h3")],
    emails: [{ to: toYou(), subject: t("guide.email8_subject") }],
    clientSees: null,
  },
  {
    title: t("guide.step7_title"),
    action: t("guide.step7_action"),
    happens: [t("guide.step7_h1")],
    emails: [],
    clientSees: null,
  },
]);

// Les 8 emails automatiques (server/utils/email.ts)
const emails = computed(() =>
  [
    { n: 1, toYou: true },
    { n: 2, toYou: false },
    { n: 3, toYou: false },
    { n: 4, toYou: false },
    { n: 5, toYou: false },
    { n: 6, toYou: true },
    { n: 7, toYou: true },
    { n: 8, toYou: true },
  ].map(({ n, toYou }) => ({
    when: t(`guide.email${n}_when`),
    subject: t(`guide.email${n}_subject`),
    toYou,
  }))
);

const pages = computed(() => [
  { key: "galleries", icon: "Images", title: t("guide.pages_galleries"), desc: t("guide.pages_galleries_desc") },
  { key: "reviews", icon: "MessageSquareQuote", title: t("guide.pages_reviews"), desc: t("guide.pages_reviews_desc") },
  { key: "settings", icon: "Settings", title: t("guide.pages_settings"), desc: t("guide.pages_settings_desc") },
]);
</script>
