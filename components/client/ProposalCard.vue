<template>
  <div class="rounded-[1.5rem] border-2 border-dark/10 p-6">
    <!-- En-tête : le titre (nom du PDF) et son statut à gauche, le bouton
         pour ouvrir le PDF à droite. Libellé court sur mobile. -->
    <div class="flex items-start justify-between gap-3 mb-4">
      <div class="min-w-0">
        <h3 class="font-heading text-lg font-medium text-dark leading-snug">
          {{ proposal.title }}
        </h3>
        <div class="flex flex-wrap items-center gap-2 mt-1.5">
          <!-- « En attente » / « Consultée » parlent à Laëtitia, pas à la
               cliente : l'étiquette ne dit que ce qui la concerne -->
          <Tag
            v-if="['revision_requested', 'accepted'].includes(proposal.status)"
            :variant="statusVariant"
          >
            {{ $t(`client.proposal_status_${proposal.status}`) }}
          </Tag>
          <!-- Mention discrète dès qu'il y a eu plusieurs envois -->
          <span
            v-if="(proposal.version || 1) > 1"
            class="text-xs text-gray-600"
          >
            {{ $t("client.document_version", { version: proposal.version }) }}
          </span>
        </div>
      </div>
      <Button
        v-if="proposal.public_url"
        :href="proposal.public_url"
        target="_blank"
        rel="noopener"
        icon="FileText"
        class="!px-3.5 !py-1.5 text-sm shrink-0"
        :aria-label="$t('client.proposal_view_pdf_short')"
      >
        <span class="sm:hidden">{{ $t("client.proposal_view_short") }}</span>
        <span class="hidden sm:inline">{{ $t("client.proposal_view_pdf_short") }}</span>
      </Button>
    </div>

    <!-- Pas de montant ici : il est saisi à la main et peut diverger du PDF,
         qui reste la seule référence pour la cliente. -->

    <!-- Le mot de Laëtitia qui accompagne ce devis -->
    <div
      v-if="proposal.description"
      class="rounded-xl bg-cream p-4 mb-4"
    >
      <p class="text-xs text-dark/60 uppercase tracking-wider mb-1.5">
        {{ $t("client.laetitia_note") }}
      </p>
      <p class="text-dark whitespace-pre-line">{{ proposal.description }}</p>
    </div>

    <!-- Pied de carte : la réponse au devis, dans le même bloc -->
    <div v-if="$slots.default" class="border-t-2 border-dark/10 mt-6 pt-6">
      <slot />
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
</script>
