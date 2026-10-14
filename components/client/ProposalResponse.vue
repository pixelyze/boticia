<template>
  <!-- Sans cadre : s'affiche en pied de la carte du devis (ProposalCard) -->
  <div>
    <h3
      class="font-heading text-sm text-dark/50
        uppercase tracking-wider mb-4"
    >
      {{ $t("client.proposal_respond") }}
    </h3>

    <!-- Ses messages déjà envoyés sur ce devis -->
    <div v-if="messages.length" class="space-y-3 mb-5">
      <div
        v-for="(m, i) in messages"
        :key="i"
        class="rounded-xl bg-cream p-4"
      >
        <p class="text-xs text-dark/60 mb-1">
          {{ $t("client.proposal_message_sent_on", { date: formatDate(m.created_at) }) }}
        </p>
        <p class="text-sm text-dark whitespace-pre-line">{{ m.text }}</p>
      </div>
    </div>

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
        @click="openWrite"
      >
        {{ $t("client.proposal_write") }}
      </Button>
    </div>

    <!-- Message à Laëtitia : dans une fenêtre à part, pour qu'« Envoyer »
         ne voisine jamais avec « Valider la proposition » -->
    <BaseModal
      :is-open="showWrite"
      :title="$t('client.proposal_write')"
      :show-close-button="false"
      show-close-icon
      @close="showWrite = false"
    >
      <!-- Comme la prise de notes de Laëtitia : une page sans cadre, à
           largeur de lecture. Ici, rien ne part sans « Envoyer ». -->
      <div class="max-w-2xl mx-auto">
        <textarea
          ref="textareaRef"
          v-model="comment"
          :placeholder="$t('client.proposal_write_placeholder')"
          :aria-label="$t('client.proposal_write')"
          class="w-full min-h-[50vh] p-0 border-0 bg-transparent
            focus:outline-none resize-none text-lg leading-relaxed text-dark
            placeholder:text-gray-400"
        />
        <div
          class="mt-4 pt-4 border-t border-gray-200 flex flex-col gap-4
            sm:flex-row sm:items-center sm:justify-between"
        >
          <p class="flex items-center gap-2 text-sm text-gray-500">
            <IconLucid name="Mail" size="xs" class="text-gray-500" />
            {{ $t("client.proposal_write_hint") }}
          </p>
          <Button
            type="button"
            variant="primary"
            icon="Send"
            :loading="requesting"
            :disabled="!comment.trim()"
            class="w-full sm:w-auto justify-center shrink-0"
            @click="$emit('revision', comment.trim())"
          >
            {{ $t("client.proposal_send_revision") }}
          </Button>
        </div>
      </div>
    </BaseModal>

    <p
      v-if="justSent"
      class="flex items-start gap-2 text-sm text-green-800 mt-4"
    >
      <IconLucid name="CheckCircle" size="sm" class="shrink-0 mt-0.5 text-green-600" />
      {{ $t("client.proposal_message_sent") }}
    </p>

    <!-- Confirmation : pas d'icône de succès, rien n'est encore validé -->
    <BaseModal
      :is-open="showConfirm"
      :title="$t('client.proposal_confirm_title')"
      :show-close-button="false"
      show-close-icon
      compact
      @close="showConfirm = false"
    >
      <p class="text-dark/70 leading-relaxed mb-3">
        {{ $t("client.proposal_confirm_message") }}
      </p>
      <p class="text-dark/70 leading-relaxed mb-6">
        {{ $t("client.proposal_confirm_question") }}
      </p>
      <div class="space-y-3">
        <Button
          variant="primary"
          icon="Check"
          :loading="accepting"
          class="w-full justify-center"
          @click="handleAccept"
        >
          {{ $t("client.proposal_confirm_yes") }}
        </Button>
        <Button
          variant="ghost"
          class="w-full justify-center"
          @click="showConfirm = false"
        >
          {{ $t("client.proposal_confirm_not_yet") }}
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

const props = defineProps<{
  accepting: boolean;
  requesting: boolean;
  messages: { text: string; created_at: string }[];
}>();

const { locale } = useI18n();

const showConfirm = ref(false);
const showWrite = ref(false);
const justSent = ref(false);
const comment = ref("");
const textareaRef = ref<HTMLTextAreaElement | null>(null);

function openWrite() {
  showWrite.value = true;
  justSent.value = false;
  // Après l'animation d'ouverture de la fenêtre
  setTimeout(() => textareaRef.value?.focus(), 350);
}

// Un nouveau message enregistré : on vide le champ et on confirme l'envoi.
watch(
  () => props.messages.length,
  (now, before) => {
    if (now > before) {
      comment.value = "";
      showWrite.value = false;
      justSent.value = true;
    }
  }
);

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(locale.value, {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });

const handleAccept = () => {
  showConfirm.value = false;
  emit("accept");
};
</script>
