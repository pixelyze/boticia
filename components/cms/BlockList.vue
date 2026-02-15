<template>
  <div class="block-list space-y-3">
    <BlockItem
      v-for="(block, index) in blocks"
      :key="block.id"
      :block="block"
      :is-selected="block.id === selectedId"
      :index="index"
      @select="$emit('select', block.id)"
      @remove="$emit('remove', block.id)"
      @move-up="moveUp(index)"
      @move-down="moveDown(index)"
    />
  </div>
</template>

<script setup lang="ts">
import type { Block } from "~/types/cms-blocks";

const props = defineProps<{
  blocks: Block[];
  selectedId: string | null;
}>();

const emit = defineEmits<{
  select: [blockId: string];
  remove: [blockId: string];
  move: [blockId: string, newIndex: number];
}>();

const moveUp = (index: number) => {
  if (index > 0) {
    const block = props.blocks[index];
    emit("move", block.id, index - 1);
  }
};

const moveDown = (index: number) => {
  if (index < props.blocks.length - 1) {
    const block = props.blocks[index];
    emit("move", block.id, index + 1);
  }
};
</script>
