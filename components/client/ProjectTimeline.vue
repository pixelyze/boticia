<template>
  <div>
    <TimelineStep
      v-for="(step, i) in steps"
      :key="step.key"
      :icon="step.icon"
      :label="$t(step.label)"
      :description="$t(step.description)"
      :completed="step.completed"
      :active="step.active"
      :last="i === steps.length - 1"
    />
  </div>
</template>

<script setup lang="ts">
import type { QuoteRequestStatus } from "~/server/utils/quotes-types";

const props = defineProps<{
  status: QuoteRequestStatus;
  hasMoodboard: boolean;
  hasProposalAccepted: boolean;
}>();

const STATUS_ORDER: QuoteRequestStatus[] = [
  "new",
  "contacted",
  "quote_sent",
  "signed",
  "completed",
];

const currentIndex = computed(() =>
  STATUS_ORDER.indexOf(props.status)
);

const steps = computed(() => [
  {
    key: "request",
    icon: "Send",
    label: "client.timeline_request",
    description: "client.timeline_request_desc",
    completed: true,
    active: false,
  },
  {
    key: "call",
    icon: "Phone",
    label: "client.timeline_call",
    description: "client.timeline_call_desc",
    completed: currentIndex.value >= 1,
    active: currentIndex.value === 0,
  },
  {
    key: "moodboard",
    icon: "Palette",
    label: "client.timeline_moodboard",
    description: "client.timeline_moodboard_desc",
    completed: props.hasMoodboard,
    active: currentIndex.value >= 1 && !props.hasMoodboard,
  },
  {
    key: "proposal",
    icon: "FileCheck",
    label: "client.timeline_proposal",
    description: "client.timeline_proposal_desc",
    completed: props.hasProposalAccepted,
    active: props.hasMoodboard && !props.hasProposalAccepted,
  },
  {
    key: "wedding",
    icon: "Heart",
    label: "client.timeline_wedding",
    description: "client.timeline_wedding_desc",
    completed: props.status === "completed",
    active: props.hasProposalAccepted && props.status !== "completed",
  },
]);
</script>
