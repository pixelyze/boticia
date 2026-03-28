<template>
  <div class="flex gap-4">
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
              : 'bg-white border-gray-200 text-gray-300'
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
    <div class="pb-8" :class="last ? 'pb-0' : ''">
      <h3
        class="font-heading font-medium text-base"
        :class="
          completed || active ? 'text-dark' : 'text-dark/40'
        "
      >
        {{ label }}
      </h3>
      <p
        v-if="description"
        class="text-sm mt-1"
        :class="
          completed || active
            ? 'text-dark/60'
            : 'text-dark/30'
        "
      >
        {{ description }}
      </p>
      <p
        v-if="detail"
        class="text-sm font-medium mt-1"
        :class="
          completed || active
            ? 'text-dark'
            : 'text-dark/40'
        "
      >
        {{ detail }}
      </p>
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
}>();
</script>
