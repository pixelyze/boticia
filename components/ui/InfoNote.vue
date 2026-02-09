<template>
  <!--
    InfoNote
    Note informative avec bordure latérale colorée.
    Utilisé pour donner des indications contextuelles à l'utilisateur.
  -->
  <div
    class="p-4 border-l-2"
    :class="variantClasses"
  >
    <p class="text-sm" :class="textClass">
      <slot />
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'default' | 'info' | 'warning' | 'success';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default'
});

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'info':
      return 'bg-blue-50 border-blue-500';
    case 'warning':
      return 'bg-yellow-50 border-yellow-500';
    case 'success':
      return 'bg-green-50 border-green-500';
    default:
      return 'bg-gray-200 border-gray-500';
  }
});

const textClass = computed(() => {
  switch (props.variant) {
    case 'info':
      return 'text-blue-800';
    case 'warning':
      return 'text-yellow-800';
    case 'success':
      return 'text-green-800';
    default:
      return 'text-gray-800';
  }
});
</script>
