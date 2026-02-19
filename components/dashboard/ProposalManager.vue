<template>
  <div class="rounded-[1.5rem] bg-white p-5">
    <div class="flex items-center justify-between mb-4">
      <h2
        class="font-heading text-sm text-dark/50
          uppercase tracking-wider"
      >
        {{ $t("dashboard.proposal_section_title") }}
      </h2>
      <Button
        v-if="!showForm"
        icon="Plus"
        @click="showForm = true"
      >
        {{ $t("dashboard.proposal_create") }}
      </Button>
    </div>

    <!-- Create form -->
    <ProposalForm
      v-if="showForm"
      :submitting="creating"
      class="mb-4"
      @submit="handleCreate"
      @cancel="showForm = false"
    />

    <!-- Loading -->
    <div v-if="loading" class="py-8 text-center">
      <IconLucid
        name="Loader2"
        size="sm"
        class="animate-spin mx-auto text-dark/30"
      />
    </div>

    <!-- Proposals list -->
    <div
      v-else-if="proposals.length > 0"
      class="space-y-3"
    >
      <div
        v-for="proposal in proposals"
        :key="proposal.id"
        class="rounded-xl border-2 border-dark/10 p-4"
      >
        <div
          class="flex items-start justify-between mb-2"
        >
          <div>
            <p class="font-medium text-dark text-sm">
              {{ proposal.title }}
            </p>
            <p
              v-if="proposal.total_amount_cents"
              class="text-xs text-dark/50"
            >
              {{
                formatAmount(proposal.total_amount_cents)
              }}
            </p>
          </div>
          <div class="flex items-center gap-2">
            <Tag :variant="statusVariant(proposal.status)">
              {{
                $t(
                  `dashboard.proposal_status_${proposal.status}`
                )
              }}
            </Tag>
            <button
              @click="$emit('delete', proposal.id)"
              class="text-dark/30 hover:text-red-500
                transition-colors"
            >
              <IconLucid
                name="Trash2"
                size="xs"
                :strokeWidth="2"
              />
            </button>
          </div>
        </div>

        <!-- Client comment -->
        <div
          v-if="
            proposal.status === 'revision_requested' &&
            proposal.client_comment
          "
          class="rounded-lg bg-cream/50 px-3 py-2 mt-2"
        >
          <p class="text-xs text-dark/40 mb-1">
            {{ $t("dashboard.proposal_client_comment") }}
          </p>
          <p class="text-sm text-dark">
            {{ proposal.client_comment }}
          </p>
        </div>
      </div>
    </div>

    <!-- Empty -->
    <p
      v-else-if="!loading && !showForm"
      class="text-dark/30 text-sm text-center py-4"
    >
      {{ $t("dashboard.proposal_empty") }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { ProjectProposal } from "~/server/utils/client-portal-types";

defineProps<{
  proposals: ProjectProposal[];
  loading: boolean;
  creating: boolean;
}>();

const emit = defineEmits<{
  (
    e: "create",
    data: {
      title: string;
      description: string;
      amount: number;
      status: string;
      file: File | null;
    }
  ): void;
  (e: "delete", id: string): void;
}>();

const showForm = ref(false);

const handleCreate = (data: any) => {
  emit("create", data);
  showForm.value = false;
};

const statusVariant = (status: string) => {
  const map: Record<string, string> = {
    draft: "default",
    pending: "warning",
    viewed: "info",
    accepted: "success",
    revision_requested: "error",
  };
  return (map[status] || "default") as any;
};

const formatAmount = (cents: number) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
};
</script>
