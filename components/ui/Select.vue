<template>
  <div>
    <label v-if="label" :for="selectId" class="block font-medium mb-2">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
      <span v-if="optional" class="text-gray-500 text-xs font-normal">({{ optional }})</span>
    </label>

    <div class="relative">
      <select
        :id="selectId"
        :value="modelValue"
        :required="required"
        :disabled="disabled"
        class="peer"
        :class="selectClasses"
        @change="handleChange"
        @blur="handleBlur"
        v-bind="$attrs"
      >
        <option v-if="placeholder" value="" disabled selected>{{ placeholder }}</option>
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>

      <!-- Custom Chevron Icon -->
      <div
        class="absolute right-3 top-1/2 -mt-2.5 pointer-events-none transition-all peer-focus:translate-x-[4px] peer-focus:translate-y-[4px]"
        :class="disabled ? 'text-gray-400' : 'text-black'"
      >
        <IconLucid name="ChevronDown" size="sm" :strokeWidth="2" />
      </div>
    </div>

    <p v-if="error" class="mt-2 text-sm text-red-600 flex items-center gap-1">
      <IconLucid name="XCircle" size="xs" />
      {{ error }}
    </p>

    <p v-if="hint && !error" class="mt-1 text-xs text-gray-600">
      {{ hint }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Option {
  label: string;
  value: string | number;
}

interface Props {
  modelValue: string | number;
  options: Option[];
  label?: string;
  placeholder?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  disabled?: boolean;
  optional?: string;
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  disabled: false,
  options: () => []
});

const emit = defineEmits<{
  'update:modelValue': [value: string | number];
  'blur': [event: FocusEvent];
}>();

// Générer un ID unique
const selectId = computed(() => `select-${Math.random().toString(36).substr(2, 9)}`);

const selectClasses = computed(() => {
  const base = 'w-full h-12 pl-4 pr-10 py-3 border-2 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-none focus:translate-x-[4px] focus:translate-y-[4px] transition-all appearance-none';

  if (props.disabled) {
    return `${base} border-gray-300 bg-gray-50 cursor-not-allowed opacity-60 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`;
  }

  if (props.error) {
    return `${base} border-red-500`;
  }

  return `${base} border-black`;
});

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit('update:modelValue', target.value);
};

const handleBlur = (event: FocusEvent) => {
  emit('blur', event);
};

// Désactiver l'héritage automatique des attributs pour qu'ils s'appliquent au select et non à la div wrapper
defineOptions({
  inheritAttrs: false
});
</script>
