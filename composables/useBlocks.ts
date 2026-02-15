/**
 * Composable pour gérer les blocs de contenu du CMS
 */

import type { Block, BlockType, BlockContent, BlockSettings } from "~/types/cms-blocks";

export const useBlocks = () => {
  const blocks = ref<Block[]>([]);
  const selectedBlockId = ref<string | null>(null);
  const hasUnsavedChanges = ref(false);

  /**
   * Générer un ID unique pour un bloc
   */
  const generateBlockId = (): string => {
    return `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  /**
   * Créer un nouveau bloc
   */
  const createBlock = (
    type: BlockType,
    name: string,
    content: BlockContent,
    settings?: Partial<BlockSettings>
  ): Block => {
    const defaultSettings: BlockSettings = {
      visible: true,
      padding: "medium",
      margin: "medium",
      ...settings,
    };

    return {
      id: generateBlockId(),
      type,
      name,
      content,
      settings: defaultSettings,
      order: blocks.value.length,
    };
  };

  /**
   * Ajouter un bloc
   */
  const addBlock = (block: Block, index?: number) => {
    if (index !== undefined) {
      blocks.value.splice(index, 0, block);
    } else {
      blocks.value.push(block);
    }

    // Recalculer les ordres
    reorderBlocks();
    hasUnsavedChanges.value = true;
  };

  /**
   * Supprimer un bloc
   */
  const removeBlock = (blockId: string) => {
    const index = blocks.value.findIndex((b) => b.id === blockId);
    if (index !== -1) {
      blocks.value.splice(index, 1);
      reorderBlocks();
      hasUnsavedChanges.value = true;

      // Désélectionner si c'était le bloc sélectionné
      if (selectedBlockId.value === blockId) {
        selectedBlockId.value = null;
      }
    }
  };

  /**
   * Mettre à jour un bloc
   */
  const updateBlock = (blockId: string, updates: Partial<Block>) => {
    const block = blocks.value.find((b) => b.id === blockId);
    if (block) {
      Object.assign(block, updates);
      hasUnsavedChanges.value = true;
    }
  };

  /**
   * Mettre à jour le contenu d'un bloc
   */
  const updateBlockContent = (blockId: string, content: Partial<BlockContent>) => {
    const block = blocks.value.find((b) => b.id === blockId);
    if (block) {
      block.content = { ...block.content, ...content };
      hasUnsavedChanges.value = true;
    }
  };

  /**
   * Mettre à jour les paramètres d'un bloc
   */
  const updateBlockSettings = (blockId: string, settings: Partial<BlockSettings>) => {
    const block = blocks.value.find((b) => b.id === blockId);
    if (block) {
      block.settings = { ...block.settings, ...settings };
      hasUnsavedChanges.value = true;
    }
  };

  /**
   * Dupliquer un bloc
   */
  const duplicateBlock = (blockId: string) => {
    const block = blocks.value.find((b) => b.id === blockId);
    if (block) {
      const duplicated = {
        ...block,
        id: generateBlockId(),
        name: `${block.name} (Copie)`,
      };

      const index = blocks.value.findIndex((b) => b.id === blockId);
      addBlock(duplicated, index + 1);
    }
  };

  /**
   * Déplacer un bloc
   */
  const moveBlock = (blockId: string, newIndex: number) => {
    const oldIndex = blocks.value.findIndex((b) => b.id === blockId);
    if (oldIndex !== -1 && oldIndex !== newIndex) {
      const [block] = blocks.value.splice(oldIndex, 1);
      blocks.value.splice(newIndex, 0, block);
      reorderBlocks();
      hasUnsavedChanges.value = true;
    }
  };

  /**
   * Recalculer les numéros d'ordre
   */
  const reorderBlocks = () => {
    blocks.value.forEach((block, index) => {
      block.order = index;
    });
  };

  /**
   * Sélectionner un bloc
   */
  const selectBlock = (blockId: string | null) => {
    selectedBlockId.value = blockId;
  };

  /**
   * Obtenir le bloc sélectionné
   */
  const selectedBlock = computed(() => {
    if (!selectedBlockId.value) return null;
    return blocks.value.find((b) => b.id === selectedBlockId.value) || null;
  });

  /**
   * Charger des blocs depuis des sections CMS
   */
  const loadFromSections = (sections: any[]) => {
    blocks.value = sections
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((section, index) => ({
        id: section.id,
        type: section.component_type as BlockType,
        name: section.name || `Section ${index + 1}`,
        content: section.content || {},
        settings: {
          visible: section.is_visible !== false,
          ...section.settings,
        },
        order: index,
      }));

    hasUnsavedChanges.value = false;
  };

  /**
   * Convertir les blocs en sections CMS
   */
  const toSections = () => {
    return blocks.value.map((block, index) => ({
      id: block.id.startsWith("block_") ? undefined : block.id,
      name: block.name,
      component_type: block.type,
      content: block.content,
      settings: block.settings,
      sort_order: index,
      is_visible: block.settings.visible,
    }));
  };

  /**
   * Réinitialiser l'état
   */
  const reset = () => {
    blocks.value = [];
    selectedBlockId.value = null;
    hasUnsavedChanges.value = false;
  };

  return {
    // État
    blocks,
    selectedBlockId,
    selectedBlock,
    hasUnsavedChanges,

    // Actions
    createBlock,
    addBlock,
    removeBlock,
    updateBlock,
    updateBlockContent,
    updateBlockSettings,
    duplicateBlock,
    moveBlock,
    selectBlock,
    reorderBlocks,

    // Conversion
    loadFromSections,
    toSections,

    // Utilitaires
    reset,
  };
};
