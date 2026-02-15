<template>
  <div class="block-editor">
    <!-- Header avec Actions -->
    <div class="flex items-center justify-between mb-6 pb-4 border-b-2 border-dark">
      <div class="flex items-center gap-4">
        <h2 class="text-2xl font-bold">Éditeur de Contenu</h2>
        <Tag v-if="hasUnsavedChanges" variant="warning">
          Non sauvegardé
        </Tag>
      </div>

      <div class="flex items-center gap-2">
        <Button
          variant="ghost"
          icon="Plus"
          @click="showLibrary = true"
        >
          Ajouter un Bloc
        </Button>

        <Button
          v-if="selectedBlock"
          variant="ghost"
          icon="Copy"
          @click="handleDuplicate"
        >
          Dupliquer
        </Button>

        <Button
          variant="primary"
          icon="Save"
          :loading="saving"
          @click="handleSave"
          :disabled="!hasUnsavedChanges"
        >
          Enregistrer
        </Button>
      </div>
    </div>

    <!-- Zone d'Édition -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Liste des Blocs (2/3) -->
      <div class="lg:col-span-2">
        <Card>
          <BlockList
            :blocks="blocks"
            :selected-id="selectedBlockId"
            @select="handleSelect"
            @move="handleMove"
            @remove="handleRemove"
          />

          <!-- Empty State -->
          <div
            v-if="blocks.length === 0"
            class="text-center py-12"
          >
            <IconLucid
              name="Inbox"
              size="lg"
              class="mx-auto mb-4 text-dark/40"
            />
            <h3 class="text-xl font-bold mb-2">Aucun Bloc</h3>
            <p class="text-dark/60 mb-6">
              Ajoutez votre premier bloc pour commencer à créer du contenu
            </p>
            <Button
              variant="primary"
              icon="Plus"
              @click="showLibrary = true"
            >
              Ajouter un Bloc
            </Button>
          </div>
        </Card>
      </div>

      <!-- Sidebar d'Édition (1/3) -->
      <div class="lg:col-span-1">
        <Card v-if="selectedBlock" class="sticky top-6">
          <div class="flex items-center justify-between mb-4 pb-3 border-b-2 border-dark/10">
            <h3 class="font-bold">Paramètres du Bloc</h3>
            <Button
              variant="ghost"
              icon="X"
              size="sm"
              @click="selectBlock(null)"
            />
          </div>

          <BlockSettings
            :block="selectedBlock"
            @update:content="handleUpdateContent"
            @update:settings="handleUpdateSettings"
          />
        </Card>

        <Card v-else variant="muted" class="text-center py-12">
          <IconLucid
            name="MousePointerClick"
            size="lg"
            class="mx-auto mb-3 text-dark/40"
          />
          <p class="text-sm text-dark/60">
            Sélectionnez un bloc pour modifier ses paramètres
          </p>
        </Card>
      </div>
    </div>

    <!-- Bibliothèque de Blocs (Modal) -->
    <BlockLibrary
      v-if="showLibrary"
      :is-open="showLibrary"
      @close="showLibrary = false"
      @add="handleAdd"
    />
  </div>
</template>

<script setup lang="ts">
import type { Block, BlockContent, BlockSettings } from "~/types/cms-blocks";

const props = defineProps<{
  pageId: string;
  initialBlocks?: any[];
}>();

const emit = defineEmits<{
  save: [blocks: Block[]];
}>();

const {
  blocks,
  selectedBlockId,
  selectedBlock,
  hasUnsavedChanges,
  addBlock,
  removeBlock,
  updateBlockContent,
  updateBlockSettings,
  duplicateBlock,
  moveBlock,
  selectBlock,
  loadFromSections,
  toSections,
} = useBlocks();

const showLibrary = ref(false);
const saving = ref(false);

// Charger les blocs initiaux
onMounted(() => {
  if (props.initialBlocks && props.initialBlocks.length > 0) {
    loadFromSections(props.initialBlocks);
  }
});

// Gestion des événements
const handleSelect = (blockId: string) => {
  selectBlock(blockId);
};

const handleAdd = (block: Block) => {
  addBlock(block);
  showLibrary.value = false;
  selectBlock(block.id);
};

const handleRemove = (blockId: string) => {
  removeBlock(blockId);
};

const handleMove = (blockId: string, newIndex: number) => {
  moveBlock(blockId, newIndex);
};

const handleDuplicate = () => {
  if (selectedBlockId.value) {
    duplicateBlock(selectedBlockId.value);
  }
};

const handleUpdateContent = (content: Partial<BlockContent>) => {
  if (selectedBlockId.value) {
    updateBlockContent(selectedBlockId.value, content);
  }
};

const handleUpdateSettings = (settings: Partial<BlockSettings>) => {
  if (selectedBlockId.value) {
    updateBlockSettings(selectedBlockId.value, settings);
  }
};

const handleSave = async () => {
  saving.value = true;

  try {
    const sections = toSections();
    emit("save", blocks.value);
    hasUnsavedChanges.value = false;
  } catch (error) {
    console.error("Error saving blocks:", error);
    alert("Erreur lors de la sauvegarde");
  } finally {
    saving.value = false;
  }
};

// Raccourcis clavier
onMounted(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    // Cmd/Ctrl + S : Sauvegarder
    if ((e.metaKey || e.ctrlKey) && e.key === "s") {
      e.preventDefault();
      if (hasUnsavedChanges.value) {
        handleSave();
      }
    }

    // Cmd/Ctrl + D : Dupliquer
    if ((e.metaKey || e.ctrlKey) && e.key === "d" && selectedBlockId.value) {
      e.preventDefault();
      handleDuplicate();
    }

    // / : Ouvrir la bibliothèque
    if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.shiftKey) {
      const target = e.target as HTMLElement;
      // Seulement si on n'est pas dans un input/textarea
      if (target.tagName !== "INPUT" && target.tagName !== "TEXTAREA") {
        e.preventDefault();
        showLibrary.value = true;
      }
    }

    // Delete/Backspace : Supprimer le bloc sélectionné
    if (
      (e.key === "Delete" || e.key === "Backspace") &&
      selectedBlockId.value &&
      !e.metaKey &&
      !e.ctrlKey
    ) {
      const target = e.target as HTMLElement;
      if (target.tagName !== "INPUT" && target.tagName !== "TEXTAREA") {
        e.preventDefault();
        handleRemove(selectedBlockId.value);
      }
    }
  };

  window.addEventListener("keydown", handleKeyDown);

  onUnmounted(() => {
    window.removeEventListener("keydown", handleKeyDown);
  });
});
</script>

<style scoped>
.block-editor {
  @apply relative;
}
</style>
