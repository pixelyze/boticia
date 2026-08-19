<template>
  <div>
    <label v-if="label" :for="inputId" class="block font-medium mb-2">
      {{ label }}
      <span v-if="optional" class="text-gray-500 text-xs font-normal">({{ optional }})</span>
    </label>

    <input
      :id="inputId"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :class="inputClasses"
      @input="handleInput"
      @blur="handleBlur"
      v-bind="$attrs"
    />

    <p v-if="error" class="mt-2 font-semibold text-sm text-red-600 flex items-center gap-1">
      <IconLucid name="XCircle" size="xs" />
      {{ error }}
    </p>

    <p v-if="hint && !error" class="mt-1 text-xs text-gray-600">
      {{ hint }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue';

interface Props {
  modelValue: string | number;
  type?: 'text' | 'email' | 'password' | 'tel' | 'number' | 'url' | 'time' | 'date';
  label?: string;
  placeholder?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  disabled?: boolean;
  optional?: string;
  variant?: 'brutal' | 'soft';
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  required: false,
  disabled: false,
  variant: 'brutal'
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  'blur': [event: FocusEvent];
}>();

// ID unique pour le lien label/input. useId() donne la même valeur au
// rendu serveur et au rendu client ; Math.random() en donnait deux
// différentes, ce qui cassait l'association <label for> à l'hydratation.
const inputId = useId();

// Classes du design system (copiées de espace/index.vue)
const inputClasses = computed(() => {
  if (props.variant === 'soft') {
    const base = 'w-full h-12 px-4 py-3 rounded-xl border-2 bg-white focus:outline-none focus:border-dark/30 transition-all';

    if (props.disabled) {
      return `${base} border-gray-200 bg-gray-50 cursor-not-allowed opacity-60`;
    }

    if (props.error) {
      return `${base} border-red-400`;
    }

    return `${base} border-dark/10`;
  }

  const base = 'w-full h-12 px-4 py-3 border-2 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-none focus:translate-x-[4px] focus:translate-y-[4px] transition-all';

  if (props.disabled) {
    return `${base} border-gray-300 bg-gray-50 cursor-not-allowed opacity-60`;
  }

  if (props.error) {
    return `${base} border-red-500`;
  }

  return `${base} border-black`;
});

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};

const handleBlur = (event: FocusEvent) => {
  emit('blur', event);
};

// Désactiver l'héritage automatique des attributs
defineOptions({
  inheritAttrs: false
});
</script>
