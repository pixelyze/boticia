<template>
  <Card
    :variant="isSelected ? 'featured' : 'standard'"
    class="block-item cursor-pointer transition-all hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
    :class="{ 'ring-4 ring-dark': isSelected }"
    @click="$emit('select')"
  >
    <div class="flex items-center justify-between gap-4">
      <!-- Drag Handle & Info -->
      <div class="flex items-center gap-3 flex-1 min-w-0">
        <div class="flex flex-col gap-1">
          <Button
            variant="ghost"
            icon="ChevronUp"
            size="sm"
            :disabled="index === 0"
            @click.stop="$emit('move-up')"
          />
          <Button
            variant="ghost"
            icon="ChevronDown"
            size="sm"
            @click.stop="$emit('move-down')"
          />
        </div>

        <IconLucid
          name="GripVertical"
          class="text-dark/40 cursor-move flex-shrink-0"
        />

        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <IconLucid
              :name="getBlockIcon(block.type)"
              size="sm"
              class="flex-shrink-0"
            />
            <h3 class="font-bold truncate">{{ block.name }}</h3>
            <Tag variant="info" size="sm">
              {{ getBlockTypeLabel(block.type) }}
            </Tag>
            <Tag
              v-if="!block.settings.visible"
              variant="default"
              size="sm"
            >
              Masqué
            </Tag>
          </div>

          <p class="text-sm text-dark/60">
            {{ getBlockSummary(block) }}
          </p>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-1 flex-shrink-0">
        <Button
          variant="ghost"
          :icon="block.settings.visible ? 'Eye' : 'EyeOff'"
          size="sm"
          @click.stop="toggleVisibility"
        />

        <Button
          variant="ghost"
          icon="Trash2"
          size="sm"
          @click.stop="$emit('remove')"
        />
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import type { Block } from "~/types/cms-blocks";

const props = defineProps<{
  block: Block;
  isSelected: boolean;
  index: number;
}>();

const emit = defineEmits<{
  select: [];
  remove: [];
  "move-up": [];
  "move-down": [];
  "toggle-visibility": [];
}>();

const toggleVisibility = () => {
  // Géré par le parent via updateBlockSettings
  emit("toggle-visibility");
};

const getBlockIcon = (type: string): string => {
  const icons: Record<string, string> = {
    hero: "Sparkles",
    text: "FileText",
    image: "Image",
    cta: "Megaphone",
    features: "Grid3x3",
    columns: "Columns",
    quote: "Quote",
    gallery: "Images",
    video: "Video",
    spacer: "Minus",
  };
  return icons[type] || "Box";
};

const getBlockTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    hero: "Hero",
    text: "Texte",
    image: "Image",
    cta: "CTA",
    features: "Fonctionnalités",
    columns: "Colonnes",
    quote: "Citation",
    gallery: "Galerie",
    video: "Vidéo",
    spacer: "Espacement",
  };
  return labels[type] || type;
};

const getBlockSummary = (block: Block): string => {
  const content: any = block.content;

  switch (block.type) {
    case "hero":
      return content.title || "Titre hero";
    case "text":
      // Extraire le texte du HTML
      const div = document.createElement("div");
      div.innerHTML = content.html || "";
      const text = div.textContent || div.innerText || "";
      return text.substring(0, 60) + (text.length > 60 ? "..." : "");
    case "image":
      return content.alt || "Image sans description";
    case "cta":
      return content.title || "Call-to-action";
    case "features":
      return `${content.features?.length || 0} fonctionnalités`;
    case "quote":
      return content.quote?.substring(0, 60) || "Citation";
    case "gallery":
      return `${content.images?.length || 0} images`;
    case "video":
      return content.url || "Vidéo";
    case "spacer":
      return `Hauteur: ${content.height}px`;
    default:
      return "";
  }
};
</script>

<style scoped>
.block-item {
  @apply relative;
}
</style>
