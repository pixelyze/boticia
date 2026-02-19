<template>
  <div class="rounded-[1.5rem] border-2 border-dark/10 p-6">
    <!-- Header -->
    <div class="flex items-start justify-between mb-4">
      <div>
        <h3 class="font-heading text-lg font-medium text-dark">
          {{ proposal.title }}
        </h3>
        <p
          v-if="proposal.description"
          class="text-sm text-dark/60 mt-1"
        >
          {{ proposal.description }}
        </p>
      </div>
      <Tag :variant="statusVariant">
        {{ $t(`client.proposal_status_${proposal.status}`) }}
      </Tag>
    </div>

    <!-- Amount -->
    <div
      v-if="proposal.total_amount_cents"
      class="flex items-center gap-3 mb-4"
    >
      <div
        class="w-9 h-9 rounded-full bg-cream flex items-center
          justify-center shrink-0"
      >
        <IconLucid
          name="BadgeEuro"
          size="sm"
          class="text-dark/40"
        />
      </div>
      <span class="text-dark font-medium text-lg">
        {{ formatAmount(proposal.total_amount_cents) }}
      </span>
    </div>

    <!-- PDF download -->
    <div
      v-if="proposal.public_url"
      class="flex items-center gap-3 mb-4"
    >
      <div
        class="w-9 h-9 rounded-full bg-cream flex items-center
          justify-center shrink-0"
      >
        <IconLucid
          name="FileText"
          size="sm"
          class="text-dark/40"
        />
      </div>
      <a
        :href="proposal.public_url"
        target="_blank"
        rel="noopener"
        class="text-dark underline hover:text-dark/70
          transition-colors"
      >
        {{ proposal.original_filename || $t("client.proposal_download_pdf") }}
      </a>
    </div>

    <!-- Client comment if revision requested -->
    <div
      v-if="
        proposal.status === 'revision_requested' &&
        proposal.client_comment
      "
      class="rounded-xl bg-cream p-4 mt-4"
    >
      <p class="text-sm text-dark/50 mb-1">
        {{ $t("client.proposal_your_comment") }}
      </p>
      <p class="text-sm text-dark">
        {{ proposal.client_comment }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProjectProposal } from "~/server/utils/client-portal-types";

const props = defineProps<{
  proposal: ProjectProposal;
}>();

const statusVariant = computed(() => {
  const map: Record<string, string> = {
    pending: "warning",
    viewed: "info",
    accepted: "success",
    revision_requested: "error",
    draft: "default",
  };
  return (map[props.proposal.status] || "default") as any;
});

const formatAmount = (cents: number) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
};
</script>
