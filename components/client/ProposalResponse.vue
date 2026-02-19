<template>
  <div class="rounded-[1.5rem] border-2 border-dark/10 p-6">
    <h3
      class="font-heading text-sm text-dark/50
        uppercase tracking-wider mb-4"
    >
      {{ $t("client.proposal_respond") }}
    </h3>

    <!-- Accept -->
    <div class="flex flex-col sm:flex-row gap-3">
      <Button
        variant="primary"
        icon="Check"
        :loading="accepting"
        @click="showConfirm = true"
      >
        {{ $t("client.proposal_accept") }}
      </Button>
      <Button
        icon="MessageSquare"
        :loading="requesting"
        @click="showRevision = !showRevision"
      >
        {{ $t("client.proposal_request_revision") }}
      </Button>
    </div>

    <!-- Revision textarea -->
    <div v-if="showRevision" class="mt-4">
      <textarea
        v-model="comment"
        :placeholder="
          $t('client.proposal_revision_placeholder')
        "
        class="w-full h-24 px-4 py-3 rounded-xl border-2
          border-dark/10 bg-cream/50 focus:outline-none
          focus:border-dark/30 transition-all resize-none"
      />
      <div class="mt-3">
        <Button
          icon="Send"
          :loading="requesting"
          @click="$emit('revision', comment)"
        >
          {{ $t("client.proposal_send_revision") }}
        </Button>
      </div>
    </div>

    <!-- Confirm modal -->
    <BaseModal
      :isOpen="showConfirm"
      :title="$t('client.proposal_confirm_title')"
      :showCloseButton="true"
      :closeButtonText="$t('common.cancel')"
      @close="showConfirm = false"
    >
      <div class="text-center">
        <div
          class="w-16 h-16 rounded-full bg-green-100
            flex items-center justify-center mx-auto mb-4"
        >
          <IconLucid
            name="Check"
            size="lg"
            class="text-green-600"
          />
        </div>
        <p class="text-dark/60 mb-6">
          {{ $t("client.proposal_confirm_message") }}
        </p>
        <Button
          variant="primary"
          icon="Check"
          :loading="accepting"
          @click="handleAccept"
        >
          {{ $t("client.proposal_confirm_yes") }}
        </Button>
      </div>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: "accept"): void;
  (e: "revision", comment: string): void;
}>();

defineProps<{
  accepting: boolean;
  requesting: boolean;
}>();

const showConfirm = ref(false);
const showRevision = ref(false);
const comment = ref("");

const handleAccept = () => {
  showConfirm.value = false;
  emit("accept");
};
</script>
