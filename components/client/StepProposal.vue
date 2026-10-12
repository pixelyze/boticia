<template>
  <!-- Un seul bloc : le devis en haut, la réponse (ou la suite) en pied -->
  <ProposalCard :proposal="proposal">
    <ProposalResponse
      v-if="canRespond"
      :accepting="accepting"
      :requesting="requesting"
      @accept="$emit('accept')"
      @revision="(comment) => $emit('revision', comment)"
    />

    <!-- Après une demande de modification : dire ce qui se passe ensuite -->
    <p
      v-else-if="proposal.status === 'revision_requested'"
      class="flex items-start gap-3 font-medium text-dark"
    >
      <IconLucid name="Send" size="sm" class="shrink-0 mt-0.5 text-dark" />
      {{ t("client.proposal_revision_sent") }}
    </p>

    <p
      v-else-if="proposal.status === 'accepted'"
      class="flex items-start gap-3 font-medium text-green-800"
    >
      <IconLucid
        name="CheckCircle"
        size="sm"
        class="shrink-0 mt-0.5 text-green-600"
      />
      {{ t("client.proposal_accepted_message") }}
    </p>
  </ProposalCard>
</template>

<script setup lang="ts">
import type { ProjectProposal } from "~/server/utils/client-portal-types";

// Repris de l'ancien onglet Proposition ; l'état et les appels API
// restent dans la page, qui en tire aussi l'avancement de la frise.
const props = defineProps<{
  proposal: ProjectProposal;
  accepting: boolean;
  requesting: boolean;
}>();

defineEmits<{
  (e: "accept"): void;
  (e: "revision", comment: string): void;
}>();

const { t } = useI18n();

const canRespond = computed(() =>
  ["pending", "viewed"].includes(props.proposal.status)
);
</script>
