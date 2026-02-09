<template>
  <button
    type="button"
    class="w-full flex items-center justify-between text-left p-4 border-2 transition-colors group"
    :class="selected
      ? 'border-green-600 bg-green-50'
      : 'border-gray-200 hover:border-black hover:bg-gray-50'"
    @click="$emit('click')"
  >
    <div class="flex items-center gap-3 flex-1">
      <!-- Icône optionnelle -->
      <div
        v-if="icon"
        class="w-10 h-10 flex items-center justify-center flex-shrink-0"
        :class="selected ? 'bg-green-600' : 'bg-black'"
      >
        <IconLucid :name="icon" size="md" color="white" />
      </div>

      <!-- Contenu texte -->
      <div class="flex-1">
        <p
          class="font-semibold"
          :class="selected ? 'text-green-700' : 'text-gray-900 group-hover:text-black'"
        >
          {{ label }}
        </p>
        <p
          v-if="sublabel"
          class="text-sm"
          :class="selected ? 'text-green-600' : 'text-gray-500'"
        >
          {{ sublabel }}
        </p>
        <p
          v-if="hint"
          class="text-xs mt-1"
          :class="selected ? 'text-green-600' : 'text-gray-400 group-hover:text-gray-600'"
        >
          {{ hint }}
        </p>
      </div>
    </div>

    <!-- Partie droite -->
    <div class="flex items-center gap-2">
      <span v-if="badge" class="text-sm font-semibold text-green-600">
        {{ badge }}
      </span>
      <IconLucid
        name="ChevronRight"
        size="sm"
        :class="selected ? 'text-green-600' : 'text-gray-400 group-hover:text-black'"
        class="transition-colors"
      />
    </div>
  </button>
</template>

<script setup lang="ts">

defineProps<{
  label: string;
  sublabel?: string;
  hint?: string;
  icon?: string;
  badge?: string;
  selected?: boolean;
}>();

defineEmits<{
  (e: "click"): void;
}>();
</script>
