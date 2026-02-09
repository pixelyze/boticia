<template>
  <div class="flex items-center justify-between p-4 bg-gray-100 border-2 border-gray-300">
    <div class="flex items-center gap-4">
      <!-- Icône -->
      <div class="w-10 h-10 bg-black text-white flex items-center justify-center">
        <IconLucid :name="icon" size="md" color="white" />
      </div>

      <!-- Contenu -->
      <div>
        <p class="font-bold text-gray-800">{{ title }}</p>
        <p class="text-sm text-gray-600">
          {{ subtitle }}
          <span v-if="price" class="font-semibold"> — {{ price }} €</span>
        </p>
      </div>
    </div>

    <!-- Bouton modifier -->
    <button
      v-if="editable"
      type="button"
      class="text-sm underline hover:no-underline text-gray-600"
      @click="$emit('edit')"
    >
      {{ editLabel }}
    </button>
  </div>
</template>

<script setup lang="ts">

withDefaults(defineProps<{
  icon: string;
  title: string;
  subtitle: string;
  price?: number | string;
  editable?: boolean;
  editLabel?: string;
}>(), {
  editable: true,
  editLabel: "Modifier"
});

defineEmits<{
  (e: "edit"): void;
}>();
</script>
