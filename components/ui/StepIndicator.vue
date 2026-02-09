<template>
  <div class="step-indicator">
    <!-- Timeline horizontale scrollable sur mobile -->
    <div class="flex items-start gap-0 overflow-x-auto pb-2 -mx-2 px-2">
      <template v-for="(step, index) in steps" :key="step.status">
        <!-- Étape -->
        <div
          class="flex flex-col items-center flex-shrink-0"
          :class="index === currentIndex ? 'min-w-[80px]' : 'min-w-[64px]'"
        >
          <!-- Bloc carré -->
          <div
            class="w-10 h-10 flex items-center justify-center border-2 transition-all"
            :class="stepBlockClasses(index)"
          >
            <!-- Check pour les étapes passées -->
            <IconLucid
              v-if="index < currentIndex"
              name="Check"
              size="sm"
              class="text-white"
            />
            <!-- Point animé pour l'étape en cours -->
            <span
              v-else-if="index === currentIndex"
              class="w-2.5 h-2.5 bg-green-500 animate-pulse"
            ></span>
            <!-- Numéro pour les étapes futures -->
            <span
              v-else
              class="text-xs font-bold text-gray-400"
            >
              {{ index + 1 }}
            </span>
          </div>

          <!-- Label -->
          <p
            class="text-xs mt-2 text-center leading-tight font-medium"
            :class="stepLabelClasses(index)"
          >
            {{ step.shortLabel }}
          </p>
        </div>

        <!-- Ligne de connexion -->
        <div
          v-if="index < steps.length - 1"
          class="h-0.5 flex-1 min-w-[12px] mt-5 mx-0.5"
          :class="index < currentIndex ? 'bg-black' : 'bg-gray-200'"
        ></div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Step {
  status: string;
  label: string;
  shortLabel: string;
}

const props = defineProps<{
  steps: Step[];
  currentStatus: string;
}>();

const currentIndex = computed(() => {
  const index = props.steps.findIndex(s => s.status === props.currentStatus);
  return index >= 0 ? index : 0;
});

const stepBlockClasses = (index: number): string => {
  if (index < currentIndex.value) {
    // Fait : fond noir
    return 'bg-black border-black';
  }
  if (index === currentIndex.value) {
    // En cours : bordure noire épaisse, fond blanc
    return 'bg-white border-black border-[3px]';
  }
  // À venir : gris clair
  return 'bg-gray-100 border-gray-200';
};

const stepLabelClasses = (index: number): string => {
  if (index < currentIndex.value) {
    return 'text-gray-500';
  }
  if (index === currentIndex.value) {
    return 'text-black font-bold';
  }
  return 'text-gray-400';
};
</script>
