<template>
  <div class="flex-1 flex flex-col bg-white">
    <section class="pt-4 pb-12 md:pt-6 md:pb-16">
      <div class="px-4 md:px-10">
        <!-- Pas de cadre englobant : cartes, bandeau et frise ont chacun
             le leur (un cadre de plus ne faisait qu'empiler les bordures). -->
        <div>
          <!-- Loading -->
          <div v-if="loading" class="py-16 text-center">
            <IconLucid
              name="Loader2"
              size="lg"
              class="animate-spin mx-auto text-gray-300"
            />
            <p class="text-dark/40 mt-4">
              {{ t("common.loading") }}
            </p>
          </div>

          <template v-else-if="project">
            <!-- Welcome -->
            <div class="mb-10">
              <h1
                class="text-2xl md:text-3xl font-bold
                  text-dark mb-2"
              >
                {{
                  t("client.project_title", {
                    couple: project.quote.partner2_name
                      ? `${project.quote.partner1_name} & ${project.quote.partner2_name}`
                      : project.quote.partner1_name,
                  })
                }}
              </h1>
              <p class="text-dark/50">
                {{ t("client.project_subtitle") }}
              </p>
            </div>

            <!-- Récapitulatif de la demande (mobile first) : une carte
                 compacte, le détail de ce que la cliente a renseigné dans
                 le formulaire s'ouvre par le bas. -->
            <div
              class="rounded-[1.5rem] border-2 border-dark/10 p-5 mb-6
                flex flex-col gap-4 md:flex-row md:items-center
                md:justify-between"
            >
              <div>
                <p class="text-xs text-dark/40 uppercase tracking-wider mb-1">
                  {{ t("client.request_title") }}
                </p>
                <p class="font-medium text-dark">
                  {{ requestSummary }}
                </p>
              </div>
              <Button
                type="button"
                icon="FileText"
                class="w-full md:w-auto justify-center shrink-0"
                @click="showRequest = true"
              >
                {{ t("client.request_open") }}
              </Button>
            </div>
            <BaseModal
              :isOpen="showRequest"
              :title="t('client.request_title')"
              :closeButtonText="t('common.close')"
              @close="showRequest = false"
            >
              <RequestInfoCards :infos="requestInfos" />
            </BaseModal>

            <!-- Prochaine étape : ce qui est attendu, et de qui -->
            <div
              class="rounded-[1.5rem] bg-cream p-6 mb-6 flex flex-col
                gap-4 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p
                  class="text-xs text-gray-600 uppercase tracking-wider
                    mb-1"
                >
                  {{ t("client.next_step") }}
                </p>
                <p class="font-heading text-lg text-dark">
                  {{ t(nextStep.message) }}
                </p>
              </div>
              <Button
                v-if="nextStep.action && nextStep.step"
                type="button"
                variant="primary"
                class="shrink-0"
                @click="goToStep(nextStep.step)"
              >
                {{ t(nextStep.action) }}
              </Button>
            </div>

            <!-- Timeline : la navigation de l'espace client. Sans cadre :
                 ses étapes contiennent déjà leurs propres cartes. -->
            <div class="mt-4 mb-10">
              <h2
                class="font-heading text-sm text-gray-600
                  uppercase tracking-wider mb-6"
              >
                {{ t("client.project_timeline") }}
              </h2>
              <ProjectTimeline
                :status="project.quote.status"
                :inspirationsCount="inspirationsCount"
                :moodboardReady="moodboardReady"
                :proposalStatus="proposal?.status || null"
                :meetingDate="project.quote.meeting_date"
                :meetingTime="project.quote.meeting_time"
              >
                <template #inspirations>
                  <StepInspirations
                    @count="inspirationsCount = $event"
                  />
                </template>
                <template v-if="moodboardReady" #moodboard>
                  <StepMoodboard />
                </template>
                <template v-if="proposal" #proposal>
                  <StepProposal
                    :proposal="proposal"
                    :accepting="accepting"
                    :requesting="requesting"
                    :messages="proposalMessages"
                    @accept="handleAccept"
                    @revision="handleRevision"
                  />
                </template>
              </ProjectTimeline>
            </div>
          </template>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import type { ProjectProposal } from "~/server/utils/client-portal-types";

definePageMeta({
  ssr: false,
  layout: "client",
  middleware: ["auth-client"],
});

const { t } = useI18n();
const localePath = useLocalePath();
const user = useSupabaseUser();
const router = useRouter();
const route = useRoute();
const { clientFetch } = useClientFetch();

useHead({
  title: t("client.page_title") + " - Boticia",
});

watch(
  user,
  (val) => {
    if (val === null) {
      router.push(localePath("/login"));
    }
  },
  { immediate: true }
);

const loading = ref(true);
const project = ref<any>(null);
const proposal = ref<ProjectProposal | null>(null);
// Ses messages « Écrire à Laëtitia » sur la version affichée.
const proposalMessages = ref<{ text: string; created_at: string }[]>([]);
const inspirationsCount = ref(0);
const accepting = ref(false);
const requesting = ref(false);
const showRequest = ref(false);

const moodboardReady = computed(
  () => (project.value?.counts.moodboard || 0) > 0
);

/**
 * Les infos de la demande, selon le type de prestation (mêmes questions
 * que le formulaire de devis). Les prestations ferment la grille et
 * prennent la place restante sur la dernière ligne.
 */
const requestInfos = computed(() => {
  const q = project.value?.quote;
  if (!q) return [];
  const tbd = t("client.project_tbd");
  const infos: {
    icon: string;
    label: string;
    value?: string;
    list?: string[];
    span?: string;
  }[] = [];

  const dateLabel: Record<string, string> = {
    mariage: "client.project_date",
    evenement: "quote_form.date_label_evenement",
    atelier: "quote_form.date_label_atelier",
  };
  infos.push({
    icon: "Calendar",
    label: t(dateLabel[q.service_type] || "client.project_date"),
    value: q.wedding_date ? formatDate(q.wedding_date) : tbd,
  });

  if (q.service_type === "evenement" && q.event_type) {
    infos.push({
      icon: "PartyPopper",
      label: t("quote_form.event_type_label"),
      value: q.event_type,
    });
  }
  if (q.service_type !== "atelier") {
    infos.push({
      icon: "Target",
      label: t(
        q.service_type === "mariage"
          ? "client.project_venue"
          : "quote_form.venue_label"
      ),
      value: q.venue || tbd,
    });
  }
  if (q.service_type === "atelier" && q.guest_count) {
    infos.push({
      icon: "Users",
      label: t("quote_form.guest_count_label"),
      value: String(q.guest_count),
    });
  }
  if (q.budget) {
    infos.push({
      icon: "BadgeEuro",
      label: t("quote_form.budget_label"),
      value: t(`quote_form.budget_${q.budget}`),
    });
  }
  if (q.meeting_date) {
    infos.push({
      icon: "Phone",
      label: t("client.project_meeting"),
      value: q.meeting_time
        ? t("client.project_meeting_at", {
            date: formatDate(q.meeting_date),
            time: q.meeting_time,
          })
        : formatDate(q.meeting_date),
    });
  }

  // Atelier : le formulaire demande le type d'atelier, pas des
  // prestations (floral_needs reste vide).
  const services = q.floral_needs?.length
    ? q.floral_needs.map((need: string) => t(`quote_form.need_${need}`))
    : q.workshop_type
      ? [t(`quote_form.workshop_${q.workshop_type}`)]
      : [tbd];
  const spans = ["md:col-span-3", "md:col-span-2", ""];
  infos.push({
    icon: "Flower2",
    label: t(
      q.service_type === "atelier"
        ? "quote_form.workshop_type_label"
        : "client.project_services"
    ),
    list: services,
    span: spans[infos.length % 3],
  });

  return infos;
});

// Résumé de la carte mobile : type de prestation et date.
const requestSummary = computed(() => {
  const q = project.value?.quote;
  if (!q) return "";
  const parts = [t(`quote_form.service_type_${q.service_type}`)];
  if (q.wedding_date) parts.push(formatDate(q.wedding_date));
  return parts.join(" · ");
});

/**
 * Le bandeau dit la prochaine chose qui se passe — et si c'est à la
 * cliente d'agir, le bouton ouvre l'étape concernée dans la frise.
 */
const nextStep = computed<{
  message: string;
  step?: string;
  action?: string;
}>(() => {
  const status = proposal.value?.status;
  if (status === "pending" || status === "viewed") {
    return {
      message: "client.next_proposal",
      step: "proposal",
      action: "client.next_proposal_action",
    };
  }
  if (status === "revision_requested") {
    return { message: "client.next_revision" };
  }
  if (status === "accepted") {
    return { message: "client.next_accepted" };
  }
  if (moodboardReady.value) {
    return {
      message: "client.next_moodboard",
      step: "moodboard",
      action: "client.next_moodboard_action",
    };
  }
  if (project.value?.quote.status === "new") {
    return { message: "client.next_call" };
  }
  return {
    message: "client.next_moodboard_preparing",
    step: "inspirations",
    action: "client.next_inspirations_action",
  };
});

// Anciennes adresses des onglets (liens des emails) → étape de la frise
const STEP_FROM_QUERY: Record<string, string> = {
  devis: "proposal",
  moodboard: "moodboard",
  inspirations: "inspirations",
};

const goToStep = async (key: string) => {
  await nextTick();
  document
    .getElementById(`etape-${key}`)
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
};

const handleAccept = async () => {
  accepting.value = true;
  try {
    const res = await clientFetch<{
      success: boolean;
      data: ProjectProposal;
    }>("/api/client/proposal", {
      method: "PATCH",
      body: { action: "accept" },
    });
    proposal.value = res.data;
  } catch (err) {
    console.error("Error accepting:", err);
  } finally {
    accepting.value = false;
  }
};

const handleRevision = async (comment: string) => {
  requesting.value = true;
  try {
    const res = await clientFetch<{
      success: boolean;
      data: ProjectProposal;
      messages: { text: string; created_at: string }[];
    }>("/api/client/proposal", {
      method: "PATCH",
      body: { action: "revision", comment },
    });
    proposal.value = res.data;
    proposalMessages.value = res.messages || [];
  } catch (err) {
    console.error("Error requesting revision:", err);
  } finally {
    requesting.value = false;
  }
};

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

onMounted(async () => {
  try {
    // /api/client/proposal exclut les brouillons, contrairement au
    // latestProposal du projet : c'est lui qui fait foi pour la cliente.
    const [projectRes, proposalRes] = await Promise.all([
      clientFetch<{ success: boolean; data: any }>("/api/client/project"),
      clientFetch<{
        success: boolean;
        data: ProjectProposal | null;
        messages?: { text: string; created_at: string }[];
      }>("/api/client/proposal"),
    ]);
    project.value = projectRes.data;
    proposal.value = proposalRes.data;
    proposalMessages.value = proposalRes.messages || [];
    inspirationsCount.value = projectRes.data?.counts.inspirations || 0;
  } catch (err) {
    console.error("Error loading project:", err);
  } finally {
    loading.value = false;
  }

  const fromQuery = STEP_FROM_QUERY[String(route.query.etape || "")];
  if (fromQuery) {
    goToStep(fromQuery);
  }
});
</script>
