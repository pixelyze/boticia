<template>
  <!-- Récapitulatif de la demande de devis, une carte par information
       (affiché dans la modale « Votre demande » de l'espace client). -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div
      v-for="info in infos"
      :key="info.label"
      class="border border-dark/20 p-5"
      :class="info.span"
    >
      <div class="flex items-start gap-3">
        <div
          class="w-9 h-9 rounded-full border border-dark/20 flex items-center
            justify-center shrink-0"
        >
          <IconLucid :stroke-width="1.5" :name="info.icon" size="sm" class="text-gray-400" />
        </div>
        <div class="min-w-0">
          <p class="text-[12px] font-semibold uppercase tracking-[0.2em] text-orange-500 mb-1">
            {{ info.label }}
          </p>
          <ul v-if="info.list" class="space-y-0.5">
            <li
              v-for="item in info.list"
              :key="item"
              class="text-sm font-medium text-dark"
            >
              {{ item }}
            </li>
          </ul>
          <p v-else class="font-medium text-dark break-words">
            {{ info.value }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  infos: {
    icon: string;
    label: string;
    value?: string;
    list?: string[];
    span?: string;
  }[];
}>();
</script>
