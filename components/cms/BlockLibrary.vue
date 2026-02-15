<template>
  <BaseModal
    :is-open="isOpen"
    @close="$emit('close')"
    title="Bibliothèque de Blocs"
    size="large"
  >
    <!-- Catégories -->
    <div class="flex gap-2 mb-6">
      <Button
        v-for="cat in blockCategories"
        :key="cat.value"
        :variant="selectedCategory === cat.value ? 'primary' : 'ghost'"
        :icon="cat.icon"
        @click="selectedCategory = cat.value"
        size="sm"
      >
        {{ cat.label }}
      </Button>
    </div>

    <!-- Grille de Blocs -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
      <Card
        v-for="template in filteredTemplates"
        :key="template.type"
        variant="standard"
        class="cursor-pointer hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
        @click="handleAdd(template)"
      >
        <div class="flex items-start gap-3">
          <div class="p-3 bg-dark text-cream rounded">
            <IconLucid :name="template.icon" size="lg" />
          </div>

          <div class="flex-1">
            <h3 class="font-bold mb-1">{{ template.name }}</h3>
            <p class="text-sm text-dark/60">{{ template.description }}</p>
          </div>

          <IconLucid name="Plus" class="text-dark/40" />
        </div>
      </Card>
    </div>

    <!-- Empty State -->
    <div
      v-if="filteredTemplates.length === 0"
      class="text-center py-12 text-dark/60"
    >
      <IconLucid name="Inbox" size="lg" class="mx-auto mb-3 opacity-40" />
      <p>Aucun bloc dans cette catégorie</p>
    </div>

    <!-- Footer -->
    <div class="flex justify-end gap-3 mt-6 pt-6 border-t-2 border-dark/10">
      <Button variant="ghost" @click="$emit('close')">
        Annuler
      </Button>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import type { Block, BlockTemplate } from "~/types/cms-blocks";
import { blockTemplates, blockCategories } from "~/utils/block-templates";

defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  close: [];
  add: [block: Block];
}>();

const { createBlock } = useBlocks();

const selectedCategory = ref<BlockTemplate["category"]>("content");

const filteredTemplates = computed(() => {
  return blockTemplates.filter((t) => t.category === selectedCategory.value);
});

const handleAdd = (template: BlockTemplate) => {
  const block = createBlock(
    template.type,
    template.name,
    { ...template.defaultContent },
    { ...template.defaultSettings }
  );

  emit("add", block);
};
</script>
