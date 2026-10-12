<template>
  <div>
    <TimelineStep
      v-for="(step, i) in steps"
      :key="step.key"
      :anchor="`etape-${step.key}`"
      :icon="step.icon"
      :label="$t(step.label)"
      :description="step.description"
      :detail="step.detail"
      :completed="step.completed"
      :active="step.active"
      :last="i === steps.length - 1"
    >
      <!-- Le contenu de l'étape, quand il existe (fourni par la page) -->
      <template v-if="$slots[step.key]" #default>
        <slot :name="step.key" />
      </template>
    </TimelineStep>
  </div>
</template>

<script setup lang="ts">
import type { QuoteRequestStatus } from "~/server/utils/quotes-types";

/**
 * La frise est la navigation de l'espace client : chaque étape porte son
 * contenu (inspirations, moodboard, devis). Son état vient de la réalité
 * du projet, pas du seul statut : avant, l'étape devis restait grisée tant
 * que le moodboard était vide, même devis envoyé.
 */
const props = defineProps<{
  status: QuoteRequestStatus;
  inspirationsCount: number;
  moodboardReady: boolean;
  /** Statut du devis visible par la cliente (brouillons exclus). */
  proposalStatus: string | null;
  meetingDate?: string;
  meetingTime?: string;
}>();

const { t } = useI18n();

const STATUS_ORDER: QuoteRequestStatus[] = [
  "new",
  "contacted",
  "quote_sent",
  "signed",
  "completed",
];

const currentIndex = computed(() => STATUS_ORDER.indexOf(props.status));

const meetingDetail = computed(() => {
  if (!props.meetingDate) return undefined;
  const d = new Date(props.meetingDate);
  const dateStr = d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return props.meetingTime ? `${dateStr} — ${props.meetingTime}` : dateStr;
});

const accepted = computed(() => props.proposalStatus === "accepted");
const awaitingReply = computed(
  () =>
    props.proposalStatus === "pending" || props.proposalStatus === "viewed"
);
const revision = computed(
  () => props.proposalStatus === "revision_requested"
);

const proposalDescription = computed(() => {
  if (accepted.value) return t("client.timeline_proposal_accepted");
  if (revision.value) return t("client.timeline_proposal_revision");
  if (awaitingReply.value) return t("client.timeline_proposal_ready");
  return t("client.timeline_proposal_desc");
});

const steps = computed(() => [
  {
    key: "request",
    icon: "Send",
    label: "client.timeline_request",
    description: t("client.timeline_request_desc"),
    completed: true,
    active: false,
  },
  {
    key: "call",
    icon: "Phone",
    label: "client.timeline_call",
    description: t("client.timeline_call_desc"),
    detail: meetingDetail.value,
    completed: currentIndex.value >= 1,
    active: currentIndex.value === 0,
  },
  {
    key: "inspirations",
    icon: "ImagePlus",
    label: "client.timeline_inspirations",
    description:
      props.inspirationsCount > 0
        ? t("client.timeline_inspirations_count", {
            count: props.inspirationsCount,
          })
        : t("client.timeline_inspirations_desc"),
    completed: props.inspirationsCount > 0,
    active: false,
  },
  {
    key: "moodboard",
    icon: "Palette",
    label: "client.timeline_moodboard",
    description: props.moodboardReady
      ? t("client.timeline_moodboard_ready")
      : t("client.timeline_moodboard_preparing"),
    completed: props.moodboardReady,
    active:
      !props.moodboardReady &&
      currentIndex.value >= 1 &&
      !props.proposalStatus,
  },
  {
    key: "proposal",
    icon: "FileCheck",
    label: "client.timeline_proposal",
    description: proposalDescription.value,
    completed: accepted.value,
    active: awaitingReply.value || revision.value,
  },
  {
    key: "wedding",
    icon: "Heart",
    label: "client.timeline_wedding",
    description: t("client.timeline_wedding_desc"),
    completed: props.status === "completed",
    active: accepted.value && props.status !== "completed",
  },
]);
</script>
