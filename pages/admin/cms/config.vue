<template>
  <div class="min-h-screen bg-cream">
    <div class="container mx-auto px-6 py-12 max-w-4xl">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-4">
          <Button variant="ghost" icon="ArrowLeft" to="/admin/cms">
            Retour
          </Button>

          <div>
            <h1 class="text-4xl font-bold text-dark mb-2">Configuration</h1>
            <p class="text-dark/60">
              Paramètres globaux du site
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          icon="Plus"
          @click="showCreateModal = true"
        >
          Nouvelle Config
        </Button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <IconLucid name="Loader2" class="animate-spin mx-auto mb-4" size="lg" />
        <p class="text-dark/60">Chargement de la configuration...</p>
      </div>

      <!-- Config List -->
      <div v-else class="space-y-6">
        <!-- Group by category -->
        <Card
          v-for="category in categories"
          :key="category"
        >
          <h2 class="text-2xl font-bold mb-4 capitalize">
            {{ category }}
          </h2>

          <div class="space-y-3">
            <div
              v-for="config in getConfigsByCategory(category)"
              :key="config.id"
              class="flex items-center justify-between p-4 border-2 border-dark/10 hover:border-dark transition-all"
            >
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <h3 class="font-bold">{{ config.key }}</h3>
                  <Tag variant="default" size="sm">
                    {{ config.locale || 'global' }}
                  </Tag>
                </div>
                <p v-if="config.description" class="text-sm text-dark/60">
                  {{ config.description }}
                </p>
              </div>

              <div class="flex items-center gap-2">
                <Button
                  variant="ghost"
                  icon="Edit"
                  @click="editConfig(config)"
                >
                  Éditer
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <!-- Empty State -->
        <Card v-if="configs.length === 0" variant="muted" class="text-center py-12">
          <IconLucid name="Settings" size="lg" class="mx-auto mb-4 text-dark/40" />
          <h3 class="text-xl font-bold mb-2">Aucune configuration</h3>
          <p class="text-dark/60 mb-6">
            Créez votre première configuration
          </p>
          <Button variant="primary" icon="Plus" @click="showCreateModal = true">
            Nouvelle Config
          </Button>
        </Card>
      </div>

      <!-- Create/Edit Modal -->
      <BaseModal
        v-if="showCreateModal || editingConfig"
        :isOpen="showCreateModal || !!editingConfig"
        @close="closeModal"
        :title="editingConfig ? 'Éditer Configuration' : 'Nouvelle Configuration'"
      >
        <form @submit.prevent="saveConfig" class="space-y-4">
          <Input
            v-model="formData.key"
            label="Clé"
            placeholder="site.navigation"
            :disabled="!!editingConfig"
            required
          />

          <Select
            v-model="formData.category"
            :options="categoryOptions"
            label="Catégorie"
            required
          />

          <Select
            v-model="formData.locale"
            :options="localeOptions"
            label="Langue"
          />

          <div>
            <label class="block text-sm font-medium mb-2">
              Valeur (JSON)
            </label>
            <textarea
              v-model="formData.valueJson"
              class="w-full h-64 p-3 border-2 border-dark font-mono text-sm"
              placeholder='{"items": []}'
              required
            />
          </div>

          <Input
            v-model="formData.description"
            label="Description"
            placeholder="Description de la configuration"
          />

          <div class="flex gap-3 pt-4">
            <Button type="button" variant="ghost" @click="closeModal">
              Annuler
            </Button>
            <Button
              type="submit"
              variant="primary"
              :loading="saving"
              class="flex-1"
            >
              {{ editingConfig ? 'Enregistrer' : 'Créer' }}
            </Button>
          </div>
        </form>
      </BaseModal>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CmsConfig } from "~/server/utils/cms-types";

definePageMeta({
  layout: "minimal",
  ssr: false,
  middleware: ["auth-admin"],
});

const { getConfigs, upsertConfig } = useCms();

// State
const configs = ref<CmsConfig[]>([]);
const loading = ref(true);
const saving = ref(false);
const showCreateModal = ref(false);
const editingConfig = ref<CmsConfig | null>(null);

// Form data
const formData = reactive({
  key: "",
  category: "general",
  locale: "",
  valueJson: "{}",
  description: "",
});

// Options
const categoryOptions = [
  { label: "General", value: "general" },
  { label: "Navigation", value: "navigation" },
  { label: "Footer", value: "footer" },
  { label: "SEO", value: "seo" },
  { label: "Social", value: "social" },
];

const localeOptions = [
  { label: "Global", value: "" },
  { label: "Français", value: "fr" },
  { label: "English", value: "en" },
  { label: "日本語", value: "ja" },
];

// Computed
const categories = computed(() => {
  const cats = new Set(configs.value.map((c) => c.category));
  return Array.from(cats).sort();
});

// Load configs
const loadConfigs = async () => {
  loading.value = true;

  try {
    configs.value = await getConfigs();
  } catch (error) {
    console.error("Error loading configs:", error);
  } finally {
    loading.value = false;
  }
};

// Get configs by category
const getConfigsByCategory = (category: string) => {
  return configs.value.filter((c) => c.category === category);
};

// Edit config
const editConfig = (config: CmsConfig) => {
  editingConfig.value = config;
  formData.key = config.key;
  formData.category = config.category;
  formData.locale = config.locale || "";
  formData.valueJson = JSON.stringify(config.value, null, 2);
  formData.description = config.description || "";
};

// Close modal
const closeModal = () => {
  showCreateModal.value = false;
  editingConfig.value = null;
  formData.key = "";
  formData.category = "general";
  formData.locale = "";
  formData.valueJson = "{}";
  formData.description = "";
};

// Save config
const saveConfig = async () => {
  saving.value = true;

  try {
    const value = JSON.parse(formData.valueJson);

    await upsertConfig({
      key: formData.key,
      category: formData.category,
      locale: formData.locale || undefined,
      value,
      description: formData.description || undefined,
    });

    closeModal();
    await loadConfigs();

    alert(editingConfig.value ? "Configuration mise à jour !" : "Configuration créée !");
  } catch (error) {
    console.error("Error saving config:", error);
    alert("Erreur lors de l'enregistrement (vérifiez le JSON)");
  } finally {
    saving.value = false;
  }
};

// Initial load
onMounted(() => {
  loadConfigs();
});

useHead({
  title: "CMS - Configuration",
});
</script>
