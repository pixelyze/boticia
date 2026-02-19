<template>
  <div class="rounded-[1.5rem] bg-white p-5">
    <h2
      class="font-heading text-sm text-dark/50
        uppercase tracking-wider mb-4"
    >
      {{ $t("dashboard.portal_title") }}
    </h2>

    <!-- Disabled state -->
    <div v-if="!enabled" class="flex items-center justify-between">
      <div>
        <p class="text-dark/60 text-sm">
          {{ $t("dashboard.portal_desc_off") }}
        </p>
      </div>
      <Button
        icon="UserPlus"
        variant="primary"
        @click="toggle"
      >
        {{ $t("dashboard.portal_activate") }}
      </Button>
    </div>

    <!-- Enabled state -->
    <div v-else class="space-y-4">
      <div class="flex items-center gap-3">
        <div
          class="w-9 h-9 rounded-full bg-green-100
            flex items-center justify-center shrink-0"
        >
          <IconLucid name="Check" size="sm" class="text-green-600" />
        </div>
        <div>
          <p class="text-dark font-medium text-sm">
            {{ $t("dashboard.portal_active") }}
          </p>
          <p class="text-dark/40 text-sm">
            {{ quoteEmail }}
          </p>
        </div>
      </div>

      <Button
        icon="Send"
        variant="primary"
        :loading="sending"
        @click="$emit('invite')"
      >
        {{ $t("dashboard.portal_send_invite") }}
      </Button>

      <div
        v-if="inviteSent"
        class="flex items-center gap-2 text-green-600 text-sm"
      >
        <IconLucid name="CheckCircle" size="sm" />
        {{ $t("dashboard.portal_invite_sent") }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  enabled: boolean;
  quoteEmail: string;
  sending: boolean;
  inviteSent: boolean;
}>();

const emit = defineEmits<{
  (e: "toggle", value: boolean): void;
  (e: "invite"): void;
}>();

const toggle = () => {
  emit("toggle", !props.enabled);
};
</script>
