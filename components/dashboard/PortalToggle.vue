<template>
  <div
    class="rounded-2xl p-4 transition-all border-2"
    :class="
      enabled
        ? 'bg-green-50/50 border-green-200'
        : 'bg-gray-100 border-gray-200'
    "
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2.5">
        <div
          class="w-8 h-8 rounded-full flex items-center
            justify-center shrink-0"
          :class="
            enabled
              ? 'bg-green-100 text-green-600'
              : 'bg-gray-200 text-gray-400'
          "
        >
          <IconLucid
            :name="enabled ? 'UserCheck' : 'UserPlus'"
            size="xs"
          />
        </div>
        <div>
          <h2
            class="font-heading text-sm text-dark/80
              uppercase tracking-wider"
          >
            {{ $t("dashboard.portal_title") }}
          </h2>
          <p
            class="text-xs"
            :class="
              enabled
                ? 'text-green-600'
                : 'text-gray-400'
            "
          >
            {{
              enabled
                ? $t("dashboard.portal_active")
                : $t("dashboard.portal_desc_off")
            }}
          </p>
        </div>
      </div>
      <!-- Toggle switch -->
      <button
        @click="toggle"
        :aria-label="
          enabled
            ? $t('dashboard.portal_deactivate')
            : $t('dashboard.portal_activate')
        "
        class="relative w-11 h-6 rounded-full
          transition-colors shrink-0"
        :class="
          enabled
            ? 'bg-green-500'
            : 'bg-dark/20'
        "
      >
        <span
          class="absolute top-0.5 left-0.5 w-5 h-5
            rounded-full bg-white shadow
            transition-transform"
          :class="enabled ? 'translate-x-5' : ''"
        />
      </button>
    </div>

    <!-- Enabled details -->
    <div v-if="enabled" class="mt-3 space-y-2.5">
      <div class="flex items-center gap-2 text-sm">
        <IconLucid
          name="Mail"
          size="xs"
          class="text-green-500 shrink-0"
        />
        <span class="text-dark/70 truncate">
          {{ quoteEmail }}
        </span>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  enabled: boolean;
  quoteEmail: string;
}>();

const emit = defineEmits<{
  (e: "toggle", value: boolean): void;
}>();

const toggle = () => {
  emit("toggle", !props.enabled);
};
</script>
