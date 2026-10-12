<template>
  <div class="rounded-[1.5rem] border-2 border-dark/10 p-6">
    <!-- Header -->
    <div class="flex items-start justify-between mb-4">
      <div>
        <h3 class="font-heading text-lg font-medium text-dark">
          {{ proposal.title }}
        </h3>
        <!-- Mention discrète dès qu'il y a eu plusieurs envois -->
        <p
          v-if="(proposal.version || 1) > 1"
          class="text-xs text-gray-600 mt-0.5"
        >
          {{ $t("client.document_version", { version: proposal.version }) }}
        </p>
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

    <!-- Pas de montant ici : il est saisi à la main et peut diverger du PDF,
         qui reste la seule référence pour la cliente. -->

    <!-- PDF : vrai bouton (pleine largeur sur mobile) plutôt qu'un lien
         texte ; le nom de fichier interne n'apporte rien à la cliente. -->
    <Button
      v-if="proposal.public_url"
      :href="proposal.public_url"
      target="_blank"
      rel="noopener"
      icon="FileText"
      class="w-full sm:w-auto justify-center mb-4"
    >
      {{ $t("client.proposal_view_pdf") }}
    </Button>

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
