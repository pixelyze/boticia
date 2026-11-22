<template>
  <!-- ==========================================
       [PAGE-GUIDE] — Guide du tableau de bord, organisé comme un wiki :
       un sommaire par thème, un article à la fois, une recherche.
       L'article ouvert est dans l'adresse (?article=…) : on peut le
       partager, et le bouton « retour » du navigateur fonctionne.
       ========================================== -->
  <div class="flex-1 flex flex-col bg-white">
    <section class="py-6 md:py-8">
      <div class="px-4 md:px-10 max-w-6xl">
        <!-- En-tête + recherche -->
        <div class="mb-8 md:mb-10">
          <h1 class="text-2xl md:text-3xl font-bold">
            {{ t("guide.title") }}
          </h1>
          <p class="text-dark/50 mt-1">{{ t("guide.subtitle") }}</p>

          <label class="relative block mt-6 max-w-xl">
            <span class="sr-only">{{ t("guide.search_label") }}</span>
            <IconLucid
              name="Search"
              size="sm"
              class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              v-model="query"
              type="search"
              :placeholder="t('guide.search_placeholder')"
              class="w-full rounded-2xl border border-dark/15 bg-white pl-11
                     pr-4 py-3 text-base text-dark placeholder:text-gray-400
                     focus:outline-none focus:border-dark"
            />
          </label>
        </div>

        <div class="md:grid md:grid-cols-[15rem_1fr] md:gap-12">
          <!-- [SOMMAIRE] — Colonne de gauche, ordinateur uniquement -->
          <nav
            class="hidden md:block self-start sticky top-6 max-h-[calc(100vh-3rem)]
                   overflow-y-auto pr-2"
            :aria-label="t('guide.summary')"
          >
            <div
              v-for="cat in categories"
              :key="cat.key"
              class="mb-6"
            >
              <p
                class="flex items-center gap-2 text-xs font-semibold
                       uppercase tracking-wider text-gray-500 mb-2"
              >
                <IconLucid :name="cat.icon" size="xs" class="text-gray-500" />
                {{ t(`guide.cat_${cat.key}`) }}
              </p>
              <ul class="space-y-0.5">
                <li v-for="slug in cat.articles" :key="slug">
                  <NuxtLink
                    replace
                    :to="articleLink(slug)"
                    class="block rounded-xl px-3 py-1.5 text-sm transition-colors"
                    :class="
                      current === slug && !searching
                        ? 'bg-cream text-dark font-semibold'
                        : 'text-dark/70 hover:bg-cream/50 hover:text-dark'
                    "
                    :aria-current="current === slug ? 'page' : undefined"
                  >
                    {{ articles[slug].title }}
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </nav>

          <!-- [CONTENU] -->
          <div class="min-w-0">
            <!-- Résultats de recherche -->
            <div v-if="searching">
              <h2 class="text-lg font-bold mb-4">
                {{ t("guide.search_results") }}
              </h2>
              <p v-if="!results.length" class="text-dark/60">
                {{ t("guide.search_empty", { q: query.trim() }) }}
              </p>
              <ul v-else class="space-y-3">
                <li v-for="slug in results" :key="slug">
                  <NuxtLink
                    replace
                    :to="articleLink(slug)"
                    class="block rounded-2xl bg-cream/50 px-5 py-4
                           hover:bg-cream transition-colors"
                    @click="query = ''"
                  >
                    <span class="text-xs text-gray-500">
                      {{ t(`guide.cat_${categoryOf(slug).key}`) }}
                    </span>
                    <span class="block font-semibold text-dark">
                      {{ articles[slug].title }}
                    </span>
                    <span class="block text-sm text-dark/60 mt-0.5">
                      {{ articles[slug].summary }}
                    </span>
                  </NuxtLink>
                </li>
              </ul>
            </div>

            <!-- Article ouvert -->
            <article v-else-if="article" class="max-w-2xl">
              <!-- Retour au sommaire, téléphone uniquement -->
              <div class="md:hidden mb-4">
                <Button
                  variant="ghost"
                  icon="ArrowLeft"
                  :to="articleLink(null)"
                  replace
                  class="!px-0"
                >
                  {{ t("guide.summary") }}
                </Button>
              </div>

              <p class="text-xs font-semibold uppercase tracking-wider text-gray-500">
                {{ t(`guide.cat_${categoryOf(current).key}`) }}
              </p>
              <h2 class="text-2xl font-bold mt-1">{{ article.title }}</h2>
              <p class="text-lg text-dark/70 mt-3">{{ article.summary }}</p>

              <Button
                v-if="meta?.page"
                variant="default"
                right-icon="ArrowUpRight"
                :to="localePath(meta.page)"
                class="mt-5"
              >
                {{ t("guide.open_page") }}
              </Button>

              <!-- Widget : les 6 statuts -->
              <div v-if="current === 'statuts'" class="mt-8 space-y-3">
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
                    <p class="text-dark/60 text-sm mt-0.5">{{ status.desc }}</p>
                  </div>
                </div>
              </div>

              <!-- Widget : les 8 emails -->
              <div
                v-if="current === 'emails'"
                class="mt-8 overflow-x-auto rounded-2xl border border-dark/10"
              >
                <table class="w-full text-sm">
                  <thead>
                    <tr class="bg-cream/50">
                      <th class="text-left px-4 py-3 font-semibold text-dark/70">{{ t("guide.when") }}</th>
                      <th class="text-left px-4 py-3 font-semibold text-dark/70">{{ t("guide.recipient") }}</th>
                      <th class="text-left px-4 py-3 font-semibold text-dark/70">{{ t("guide.subject") }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(email, i) in emails"
                      :key="i"
                      class="border-t border-dark/5"
                    >
                      <td class="px-4 py-3 text-dark/80">{{ email.when }}</td>
                      <td class="px-4 py-3">
                        <span
                          class="text-xs px-2 py-0.5 rounded-full whitespace-nowrap"
                          :class="email.toYou ? 'bg-dark text-cream' : 'bg-dark/10 text-dark'"
                        >
                          {{ email.toYou ? t("guide.you") : t("guide.the_client") }}
                        </span>
                      </td>
                      <td class="px-4 py-3 text-dark/70 italic">{{ email.subject }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Blocs de l'article -->
              <div class="mt-8 space-y-5">
                <template v-for="(block, b) in article.blocks" :key="b">
                  <h3 v-if="block.h" class="text-lg font-bold pt-3">
                    {{ block.h }}
                  </h3>

                  <p v-else-if="block.p" class="text-dark/80 leading-relaxed">
                    {{ block.p }}
                  </p>

                  <ol v-else-if="block.steps" class="space-y-3">
                    <li
                      v-for="(item, i) in block.steps"
                      :key="i"
                      class="flex items-start gap-3"
                    >
                      <span
                        class="w-7 h-7 rounded-full bg-dark text-cream text-sm
                               font-bold flex items-center justify-center shrink-0"
                      >
                        {{ i + 1 }}
                      </span>
                      <span class="text-dark/80 pt-0.5 leading-relaxed">{{ item }}</span>
                    </li>
                  </ol>

                  <ul v-else-if="block.list" class="space-y-2">
                    <li
                      v-for="(item, i) in block.list"
                      :key="i"
                      class="flex items-start gap-3 text-dark/80 leading-relaxed"
                    >
                      <span class="w-1.5 h-1.5 rounded-full bg-dark shrink-0 mt-2.5" />
                      <span>{{ item }}</span>
                    </li>
                  </ul>

                  <div
                    v-else-if="block.tip"
                    class="flex items-start gap-3 rounded-2xl bg-cream/60 px-5 py-4"
                  >
                    <IconLucid name="Info" size="sm" class="text-dark mt-0.5 shrink-0" />
                    <p class="text-dark/80 text-sm leading-relaxed">
                      <span class="font-semibold text-dark">{{ t("guide.tip") }} :</span>
                      {{ block.tip }}
                    </p>
                  </div>
                </template>
              </div>

              <!-- Widget : le prompt à coller dans un chat IA -->
              <div
                v-if="current === 'collections-legendes'"
                class="mt-6 rounded-2xl border border-dark/15"
              >
                <div
                  class="flex items-center justify-between gap-4 px-5 py-3
                         border-b border-dark/10"
                >
                  <p class="text-sm font-semibold text-dark">
                    {{ t("guide.prompt_label") }}
                  </p>
                  <Button variant="default" class="!px-4 !py-1.5 text-sm" @click="copyPrompt">
                    {{ promptCopied ? t("guide.copied") : t("guide.copy") }}
                  </Button>
                </div>
                <p
                  class="px-5 py-4 text-sm text-dark/80 leading-relaxed
                         whitespace-pre-wrap"
                >{{ t("dashboard.photos_ai_prompt") }}</p>
              </div>

              <!-- Voir aussi -->
              <div v-if="meta?.see?.length" class="mt-10">
                <p class="text-sm font-semibold text-dark mb-3">
                  {{ t("guide.see_also") }}
                </p>
                <div class="flex flex-wrap gap-2">
                  <NuxtLink
                    replace
                    v-for="slug in meta.see.filter((x) => articles[x])"
                    :key="slug"
                    :to="articleLink(slug)"
                    class="rounded-full border border-dark/15 px-4 py-1.5 text-sm
                           text-dark hover:border-dark transition-colors"
                  >
                    {{ articles[slug].title }}
                  </NuxtLink>
                </div>
              </div>

              <!-- Article précédent / suivant -->
              <div
                class="mt-12 pt-6 border-t border-dark/10 grid grid-cols-2 gap-4"
              >
                <NuxtLink
                  replace
                  v-if="prevSlug"
                  :to="articleLink(prevSlug)"
                  class="group rounded-2xl px-4 py-3 hover:bg-cream/50 transition-colors"
                >
                  <span class="flex items-center gap-1 text-xs text-gray-500">
                    <IconLucid name="ChevronLeft" size="xs" class="text-gray-500" />
                    {{ t("guide.previous") }}
                  </span>
                  <span class="block text-sm font-semibold text-dark mt-0.5">
                    {{ articles[prevSlug].title }}
                  </span>
                </NuxtLink>
                <span v-else />
                <NuxtLink
                  replace
                  v-if="nextSlug"
                  :to="articleLink(nextSlug)"
                  class="group rounded-2xl px-4 py-3 text-right hover:bg-cream/50
                         transition-colors"
                >
                  <span class="flex items-center justify-end gap-1 text-xs text-gray-500">
                    {{ t("guide.next") }}
                    <IconLucid name="ChevronRight" size="xs" class="text-gray-500" />
                  </span>
                  <span class="block text-sm font-semibold text-dark mt-0.5">
                    {{ articles[nextSlug].title }}
                  </span>
                </NuxtLink>
              </div>
            </article>

            <!-- Accueil du guide : tous les articles, par thème -->
            <div v-else class="space-y-10">
              <div v-for="cat in categories" :key="cat.key">
                <h2 class="text-lg font-bold mb-4 flex items-center gap-2">
                  <IconLucid :name="cat.icon" size="sm" class="text-gray-500" />
                  {{ t(`guide.cat_${cat.key}`) }}
                </h2>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  <NuxtLink
                    replace
                    v-for="slug in cat.articles"
                    :key="slug"
                    :to="articleLink(slug)"
                    class="block rounded-2xl bg-cream/50 px-5 py-4
                           hover:bg-cream transition-colors"
                  >
                    <span class="block font-semibold text-dark">
                      {{ articles[slug].title }}
                    </span>
                    <span class="block text-sm text-dark/60 mt-0.5">
                      {{ articles[slug].summary }}
                    </span>
                  </NuxtLink>
                </div>
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

const { t, tm, rt } = useI18n();
const route = useRoute();
const localePath = useLocalePath();

const pageTitle = useState<string | null>("dashboard-page-title", () => null);
pageTitle.value = t("guide.title");

useHead({
  title: t("guide.title") + " - Boticia",
});

// Le sommaire : l'ordre ici est l'ordre de lecture (précédent / suivant).
// Les textes sont dans guide.articles.<slug> des fichiers de langue.
const CATEGORIES = [
  { key: "start", icon: "Home", articles: ["connexion", "tableau-de-bord"] },
  {
    key: "requests",
    icon: "Inbox",
    articles: [
      "parcours",
      "statuts",
      "formulaire",
      "rendez-vous",
      "moodboard",
      "devis",
      "reponses",
      "emails",
      "espace-client",
    ],
  },
  {
    key: "site",
    icon: "Globe",
    articles: [
      "photos",
      "photos-pages",
      "legendes",
      "collections-legendes",
      "avis",
      "personnalisation",
    ],
  },
];


// Page du tableau de bord liée à l'article, et articles « Voir aussi »
const META: Record<string, { page?: string; see?: string[] }> = {
  connexion: { see: ["tableau-de-bord", "espace-client"] },
  "tableau-de-bord": { page: "/dashboard", see: ["parcours", "rendez-vous"] },
  parcours: { page: "/dashboard/quotes", see: ["statuts", "emails"] },
  statuts: { page: "/dashboard/quotes", see: ["parcours"] },
  formulaire: { see: ["rendez-vous", "espace-client"] },
  "rendez-vous": { see: ["statuts"] },
  moodboard: { page: "/dashboard/quotes", see: ["devis", "espace-client"] },
  devis: { page: "/dashboard/quotes", see: ["reponses", "statuts"] },
  reponses: { page: "/dashboard/quotes", see: ["devis", "emails"] },
  emails: { see: ["parcours"] },
  "espace-client": { see: ["connexion", "moodboard"] },
  photos: { page: "/dashboard/galleries", see: ["photos-pages", "legendes"] },
  "photos-pages": {
    page: "/dashboard/galleries",
    see: ["photos", "legendes"],
  },
  legendes: {
    page: "/dashboard/galleries",
    see: ["collections-legendes", "photos"],
  },
  "collections-legendes": {
    page: "/dashboard/galleries",
    see: ["legendes", "photos"],
  },
  avis: { page: "/dashboard/avis" },
  personnalisation: {
    page: "/dashboard/personalisation",
    see: ["photos-pages"],
  },
};

type Block = {
  h?: string;
  p?: string;
  tip?: string;
  steps?: string[];
  list?: string[];
};
type Article = { title: string; summary: string; blocks: Block[] };

// Lit un message (texte, liste ou objet) et renvoie du texte simple.
// Un message compilé est une fonction ou un objet avec un « type » chiffré.
const isMessage = (m: object) =>
  typeof (m as { type?: unknown }).type === "number" ||
  typeof (m as { t?: unknown }).t === "number";

const resolve = (m: unknown): unknown => {
  if (typeof m === "string") return m;
  if (Array.isArray(m)) return m.map(resolve);
  if (m && typeof m === "object" && !isMessage(m)) {
    return Object.fromEntries(
      Object.entries(m as Record<string, unknown>).map(([k, v]) => [
        k,
        resolve(v),
      ]),
    );
  }
  return rt(m as Parameters<typeof rt>[0]);
};

const articles = computed(
  () => resolve(tm("guide.articles")) as Record<string, Article>,
);

// Seuls les articles présents dans les textes s'affichent : un article
// absent (fichier de langue pas encore rechargé) ne fait pas planter la page
const categories = computed(() =>
  CATEGORIES.map((c) => ({
    ...c,
    articles: c.articles.filter((slug) => articles.value[slug]),
  })),
);
const order = computed(() => categories.value.flatMap((c) => c.articles));

const current = computed(() => {
  const slug = route.query.article;
  return typeof slug === "string" && order.value.includes(slug) ? slug : null;
});

const article = computed(() =>
  current.value ? articles.value[current.value] : null,
);

const articleLink = (slug: string | null) =>
  slug ? `${route.path}?article=${slug}` : route.path;

const meta = computed(() =>
  current.value ? META[current.value] : undefined,
);

const categoryOf = (slug: string | null) =>
  CATEGORIES.find((c) => slug && c.articles.includes(slug)) ?? CATEGORIES[0];

const prevSlug = computed(() => {
  const i = current.value ? order.value.indexOf(current.value) : -1;
  return i > 0 ? order.value[i - 1] : null;
});
const nextSlug = computed(() => {
  const i = current.value ? order.value.indexOf(current.value) : -1;
  return i >= 0 && i < order.value.length - 1 ? order.value[i + 1] : null;
});

// Remonter en haut à chaque changement d'article
watch(current, () => {
  window.scrollTo({ top: 0 });
  promptCopied.value = false;
});

// Copie du prompt IA (article « collections-legendes »)
const promptCopied = ref(false);
const copyPrompt = async () => {
  promptCopied.value = await copyText(t("dashboard.photos_ai_prompt"));
};

// Recherche : sans accents ni majuscules, dans tout le texte de l'article
const query = ref("");
const normalize = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const searching = computed(() => query.value.trim().length >= 2);

const flatText = (a: Article) =>
  normalize(
    [
      a.title,
      a.summary,
      ...a.blocks.flatMap((b) => [
        b.h,
        b.p,
        b.tip,
        ...(b.steps ?? []),
        ...(b.list ?? []),
      ]),
    ]
      .filter(Boolean)
      .join(" "),
  );

const results = computed(() => {
  const words = normalize(query.value).split(/\s+/).filter(Boolean);
  return order.value.filter((slug) => {
    const text = flatText(articles.value[slug]);
    return words.every((w) => text.includes(w));
  });
});

// Statuts proposés sur la fiche (voir statusOptions dans quotes/[id].vue)
const statuses = computed(() => [
  { key: "new", dot: "bg-yellow-400", label: t("guide.status_new"), desc: t("guide.status_new_desc"), auto: true },
  { key: "contacted", dot: "bg-blue-400", label: t("guide.status_contacted"), desc: t("guide.status_contacted_desc"), auto: true },
  { key: "quote_sent", dot: "bg-orange-400", label: t("guide.status_quote"), desc: t("guide.status_quote_desc"), auto: true },
  { key: "signed", dot: "bg-green-400", label: t("guide.status_signed"), desc: t("guide.status_signed_desc"), auto: false },
  { key: "completed", dot: "bg-green-600", label: t("guide.status_completed"), desc: t("guide.status_completed_desc"), auto: false },
  { key: "cancelled", dot: "bg-red-400", label: t("guide.status_cancelled"), desc: t("guide.status_cancelled_desc"), auto: false },
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
  })),
);
</script>
