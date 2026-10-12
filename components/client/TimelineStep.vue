<template>
  <div :id="anchor" class="flex gap-4 scroll-mt-6">
    <!-- Line + dot -->
    <div class="flex flex-col items-center">
      <div
        class="w-10 h-10 rounded-full border-2 flex items-center
          justify-center shrink-0 transition-colors"
        :class="
          completed
            ? 'bg-black border-black text-white'
            : active
              ? 'bg-white border-black text-black'
              : 'bg-white border-gray-300 text-gray-500'
        "
      >
        <IconLucid
          v-if="completed"
          name="Check"
          size="sm"
          :strokeWidth="3"
        />
        <IconLucid
          v-else
          :name="icon"
          size="sm"
          :strokeWidth="2"
        />
      </div>
      <div
        v-if="!last"
        class="w-0.5 flex-1 min-h-[2rem] transition-colors"
        :class="completed ? 'bg-black' : 'bg-dark/10'"
      />
    </div>
    <!-- Content -->
    <div class="flex-1 min-w-0" :class="last ? 'pb-0' : 'pb-8'">
      <h3
        class="font-heading font-medium text-base"
        :class="completed || active ? 'text-dark' : 'text-gray-500'"
      >
        {{ label }}
      </h3>
      <!-- Contrastes AA : gray-600 / gray-500 sur blanc (≥ 4,5:1) -->
      <p
        v-if="description"
        class="text-sm mt-1"
        :class="completed || active ? 'text-gray-600' : 'text-gray-500'"
      >
        {{ description }}
      </p>
      <p
        v-if="detail"
        class="text-sm font-medium mt-1"
        :class="completed || active ? 'text-dark' : 'text-gray-500'"
      >
        {{ detail }}
      </p>

      <!-- Contenu de l'étape (inspirations, moodboard, devis), toujours
           visible : un repli faisait croire qu'il n'y avait rien. Sur
           mobile, il reprend toute la largeur, sous la pastille. -->
      <div
        v-if="$slots.default"
        class="relative mt-4 -ml-14 sm:ml-0 bg-white"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  icon: string;
  label: string;
  description?: string;
  detail?: string;
  completed: boolean;
  active?: boolean;
  last?: boolean;
  anchor?: string;
}>();
</script>
