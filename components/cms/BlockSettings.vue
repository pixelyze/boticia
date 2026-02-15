<template>
  <div class="block-settings space-y-6">
    <!-- Nom du Bloc -->
    <div>
      <label class="block text-sm font-medium mb-2">Nom du Bloc</label>
      <Input
        :model-value="block.name"
        @update:model-value="updateName"
        placeholder="Mon Bloc"
      />
    </div>

    <!-- Paramètres Généraux -->
    <div class="space-y-3 pb-4 border-b-2 border-dark/10">
      <h4 class="font-bold text-sm uppercase tracking-wide">Paramètres</h4>

      <div class="flex items-center justify-between">
        <label class="text-sm">Visible</label>
        <input
          type="checkbox"
          :checked="block.settings.visible"
          @change="updateSettings({ visible: ($event.target as HTMLInputElement).checked })"
          class="w-5 h-5"
        />
      </div>

      <Select
        :model-value="block.settings.padding || 'medium'"
        @update:model-value="updateSettings({ padding: $event })"
        :options="paddingOptions"
        label="Espacement Interne"
      />

      <Select
        :model-value="block.settings.margin || 'medium'"
        @update:model-value="updateSettings({ margin: $event })"
        :options="marginOptions"
        label="Espacement Externe"
      />
    </div>

    <!-- Contenu Spécifique au Type -->
    <div class="space-y-4">
      <h4 class="font-bold text-sm uppercase tracking-wide">Contenu</h4>

      <!-- Hero Block -->
      <template v-if="block.type === 'hero'">
        <Input
          :model-value="content.title"
          @update:model-value="updateContent({ title: $event })"
          label="Titre"
          placeholder="Titre Principal"
        />

        <Input
          :model-value="content.subtitle"
          @update:model-value="updateContent({ subtitle: $event })"
          label="Sous-titre"
          placeholder="Sous-titre Accrocheur"
        />

        <div>
          <label class="block text-sm font-medium mb-2">Description</label>
          <textarea
            :value="content.description"
            @input="updateContent({ description: ($event.target as HTMLTextAreaElement).value })"
            class="w-full p-3 border-2 border-dark"
            rows="3"
            placeholder="Description..."
          />
        </div>

        <Input
          :model-value="content.ctaText"
          @update:model-value="updateContent({ ctaText: $event })"
          label="Texte du Bouton"
          placeholder="En Savoir Plus"
        />

        <Input
          :model-value="content.ctaLink"
          @update:model-value="updateContent({ ctaLink: $event })"
          label="Lien du Bouton"
          placeholder="/contact"
        />

        <Select
          :model-value="content.alignment || 'center'"
          @update:model-value="updateContent({ alignment: $event })"
          :options="alignmentOptions"
          label="Alignement"
        />
      </template>

      <!-- Text Block -->
      <template v-else-if="block.type === 'text'">
        <div>
          <label class="block text-sm font-medium mb-2">Contenu HTML</label>
          <textarea
            :value="content.html"
            @input="updateContent({ html: ($event.target as HTMLTextAreaElement).value })"
            class="w-full p-3 border-2 border-dark font-mono text-sm"
            rows="8"
            placeholder="<p>Votre contenu...</p>"
          />
        </div>

        <Select
          :model-value="content.alignment || 'left'"
          @update:model-value="updateContent({ alignment: $event })"
          :options="alignmentOptions"
          label="Alignement"
        />
      </template>

      <!-- Image Block -->
      <template v-else-if="block.type === 'image'">
        <Input
          :model-value="content.url"
          @update:model-value="updateContent({ url: $event })"
          label="URL de l'Image"
          placeholder="https://..."
        />

        <Input
          :model-value="content.alt"
          @update:model-value="updateContent({ alt: $event })"
          label="Texte Alternatif"
          placeholder="Description de l'image"
        />

        <Input
          :model-value="content.caption"
          @update:model-value="updateContent({ caption: $event })"
          label="Légende"
          placeholder="Légende optionnelle"
        />

        <Select
          :model-value="content.alignment || 'center'"
          @update:model-value="updateContent({ alignment: $event })"
          :options="alignmentOptions"
          label="Alignement"
        />
      </template>

      <!-- CTA Block -->
      <template v-else-if="block.type === 'cta'">
        <Input
          :model-value="content.title"
          @update:model-value="updateContent({ title: $event })"
          label="Titre"
          placeholder="Prêt à Commencer ?"
        />

        <div>
          <label class="block text-sm font-medium mb-2">Description</label>
          <textarea
            :value="content.description"
            @input="updateContent({ description: ($event.target as HTMLTextAreaElement).value })"
            class="w-full p-3 border-2 border-dark"
            rows="2"
            placeholder="Description..."
          />
        </div>

        <Input
          :model-value="content.buttonText"
          @update:model-value="updateContent({ buttonText: $event })"
          label="Texte du Bouton"
          placeholder="Commencer Maintenant"
        />

        <Input
          :model-value="content.buttonLink"
          @update:model-value="updateContent({ buttonLink: $event })"
          label="Lien du Bouton"
          placeholder="/contact"
        />

        <Select
          :model-value="content.variant || 'primary'"
          @update:model-value="updateContent({ variant: $event })"
          :options="buttonVariantOptions"
          label="Style du Bouton"
        />
      </template>

      <!-- Quote Block -->
      <template v-else-if="block.type === 'quote'">
        <div>
          <label class="block text-sm font-medium mb-2">Citation</label>
          <textarea
            :value="content.quote"
            @input="updateContent({ quote: ($event.target as HTMLTextAreaElement).value })"
            class="w-full p-3 border-2 border-dark"
            rows="3"
            placeholder="Une citation inspirante..."
          />
        </div>

        <Input
          :model-value="content.author"
          @update:model-value="updateContent({ author: $event })"
          label="Auteur"
          placeholder="Nom de l'Auteur"
        />

        <Input
          :model-value="content.role"
          @update:model-value="updateContent({ role: $event })"
          label="Rôle / Titre"
          placeholder="CEO, Expert, etc."
        />
      </template>

      <!-- Spacer Block -->
      <template v-else-if="block.type === 'spacer'">
        <Input
          :model-value="content.height?.toString()"
          @update:model-value="updateContent({ height: parseInt($event) || 80 })"
          label="Hauteur (px)"
          type="number"
          placeholder="80"
        />
      </template>

      <!-- Fallback: JSON Editor -->
      <template v-else>
        <div>
          <label class="block text-sm font-medium mb-2">
            Contenu (JSON)
          </label>
          <textarea
            :value="JSON.stringify(content, null, 2)"
            @input="handleJsonUpdate"
            class="w-full p-3 border-2 border-dark font-mono text-sm"
            rows="8"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Block, BlockContent, BlockSettings } from "~/types/cms-blocks";

const props = defineProps<{
  block: Block;
}>();

const emit = defineEmits<{
  "update:content": [content: Partial<BlockContent>];
  "update:settings": [settings: Partial<BlockSettings>];
}>();

const content = computed(() => props.block.content as any);

const updateName = (name: string) => {
  emit("update:settings", { ...props.block.settings });
  // Note: Le nom est dans Block, pas dans Settings
  // On pourrait avoir besoin d'un emit séparé
};

const updateContent = (updates: Partial<BlockContent>) => {
  emit("update:content", updates);
};

const updateSettings = (updates: Partial<BlockSettings>) => {
  emit("update:settings", updates);
};

const handleJsonUpdate = (event: Event) => {
  try {
    const json = (event.target as HTMLTextAreaElement).value;
    const parsed = JSON.parse(json);
    updateContent(parsed);
  } catch (error) {
    // Invalid JSON, ignore
  }
};

// Options
const paddingOptions = [
  { label: "Aucun", value: "none" },
  { label: "Petit", value: "small" },
  { label: "Moyen", value: "medium" },
  { label: "Grand", value: "large" },
];

const marginOptions = [
  { label: "Aucun", value: "none" },
  { label: "Petit", value: "small" },
  { label: "Moyen", value: "medium" },
  { label: "Grand", value: "large" },
];

const alignmentOptions = [
  { label: "Gauche", value: "left" },
  { label: "Centre", value: "center" },
  { label: "Droite", value: "right" },
];

const buttonVariantOptions = [
  { label: "Principal", value: "primary" },
  { label: "Secondaire", value: "default" },
  { label: "Subtil", value: "ghost" },
];
</script>
