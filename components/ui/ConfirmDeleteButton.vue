<template>
  <!-- Suppression en deux clics : le premier arme le bouton (pastille
       rouge « Supprimer ? »), le second émet `confirm`. Sans second clic,
       il se désarme au bout de 4 s. L'apparence au repos vient de `class`
       (chaque page garde son icône) ; `positionClass` s'applique toujours. -->
  <button
    type="button"
    :aria-label="armed ? $t('common.delete_confirm') : label || $t('common.delete')"
    :class="[
      positionClass,
      armed
        ? `inline-flex items-center gap-1 rounded-full bg-red-600
           hover:bg-red-700 text-white text-xs font-semibold px-2.5 py-1
           whitespace-nowrap shadow-sm !opacity-100 z-10`
        : $attrs.class,
    ]"
    @click.stop="onClick"
  >
    <template v-if="armed">
      <IconLucid name="Trash2" size="xs" class="text-white" />
      {{ $t("common.delete_confirm") }}
    </template>
    <slot v-else />
  </button>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false });

defineProps<{
  label?: string;
  positionClass?: string;
}>();

const emit = defineEmits<{ (e: "confirm"): void }>();

const armed = ref(false);
let timer: ReturnType<typeof setTimeout> | undefined;

const onClick = () => {
  clearTimeout(timer);
  if (armed.value) {
    armed.value = false;
    emit("confirm");
    return;
  }
  armed.value = true;
  timer = setTimeout(() => (armed.value = false), 4000);
};

onBeforeUnmount(() => clearTimeout(timer));
</script>
