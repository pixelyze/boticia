<template>
  <div>
    <label v-if="label" :for="timeId" class="block font-medium mb-2">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <div class="relative">
      <input
        :id="timeId"
        type="time"
        :value="modelValue"
        :step="step"
        :required="required"
        :disabled="disabled"
        class="peer"
        :class="inputClasses"
        @input="handleInput"
        @blur="handleBlur"
        v-bind="$attrs"
      />

      <div v-if="!disabled" class="absolute right-3 top-1/2 -mt-2.5 pointer-events-none text-black bg-white pl-1 transition-all peer-focus:translate-x-[4px] peer-focus:translate-y-[4px]">
        <IconLucid name="Clock" size="sm" :strokeWidth="2" />
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

interface Props {
  modelValue: string;
  label?: string;
  step?: number;
  error?: string;
  hint?: string;
  required?: boolean;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  disabled: false,
  step: 1800
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  'blur': [event: FocusEvent];
}>();

const timeId = computed(() => `time-${Math.random().toString(36).substr(2, 9)}`);

const inputClasses = computed(() => {
  const base = 'w-full h-12 px-4 py-3 border-2 pr-10 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-none focus:translate-x-[4px] focus:translate-y-[4px] transition-all hover:bg-gray-50';

  if (props.disabled) {
    return `${base} border-gray-300 bg-gray-50 cursor-not-allowed opacity-60 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`;
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

defineOptions({
  inheritAttrs: false
});
</script>

<style scoped>
input[type="time"]::-webkit-calendar-picker-indicator {
  background: transparent;
  bottom: 0;
  color: transparent;
  cursor: pointer;
  height: auto;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  width: auto;
}
</style>
