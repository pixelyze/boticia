<template>
  <div class="min-h-screen bg-cream">
    <div class="container mx-auto px-6 py-12">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <IconLucid name="Loader2" class="animate-spin mx-auto mb-4" size="lg" />
        <p class="text-dark/60">Chargement de la page...</p>
      </div>

      <!-- Editor -->
      <div v-else-if="page" class="max-w-5xl mx-auto">
        <!-- Header -->
        <div class="flex items-center justify-between mb-8">
          <div class="flex items-center gap-4">
            <Button
              variant="ghost"
              icon="ArrowLeft"
              to="/admin/cms"
            >
              Retour
            </Button>

            <div>
              <h1 class="text-3xl font-bold text-dark">{{ page.title }}</h1>
              <p class="text-dark/60">{{ page.slug }}</p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <Tag :variant="getStatusVariant(page.status)">
              {{ getStatusLabel(page.status) }}
            </Tag>

            <Button
              v-if="page.status === 'published'"
              variant="ghost"
              icon="EyeOff"
              @click="unpublish"
            >
              Dépublier
            </Button>

            <Button
              v-else
              variant="primary"
              icon="Eye"
              @click="publish"
            >
              Publier
            </Button>

            <Button
              variant="default"
              icon="Save"
              :loading="saving"
              @click="savePage"
            >
              Enregistrer
            </Button>
          </div>
        </div>

        <!-- Tabs -->
        <div class="flex gap-2 mb-6">
          <Button
            :variant="activeTab === 'content' ? 'primary' : 'ghost'"
            @click="activeTab = 'content'"
          >
            Contenu
          </Button>
          <Button
            :variant="activeTab === 'settings' ? 'primary' : 'ghost'"
            @click="activeTab = 'settings'"
          >
            Paramètres
          </Button>
          <Button
            :variant="activeTab === 'seo' ? 'primary' : 'ghost'"
            @click="activeTab = 'seo'"
          >
            SEO
          </Button>
        </div>

        <!-- Content Tab -->
        <div v-if="activeTab === 'content'" class="space-y-6">
          <!-- Éditeur de Blocs Visuel -->
          <BlockEditor
            :page-id="page.id"
            :initial-blocks="sections"
            @save="handleSaveBlocks"
          />
        </div>

        <!-- Settings Tab -->
        <div v-if="activeTab === 'settings'" class="space-y-6">
          <Card>
            <h2 class="text-2xl font-bold mb-6">Paramètres</h2>

            <div class="space-y-4">
              <Input
                v-model="page.title"
                label="Titre"
                placeholder="Titre de la page"
              />

              <Input
                v-model="page.slug"
                label="Slug (URL)"
                placeholder="/about"
              />

              <Input
                v-model="page.description"
                label="Description"
                placeholder="Description de la page"
              />

              <Select
                v-model="page.locale"
                :options="localeOptions"
                label="Langue"
              />

              <Select
                v-model="page.layout"
                :options="layoutOptions"
                label="Layout"
              />
            </div>
          </Card>
        </div>

        <!-- SEO Tab -->
        <div v-if="activeTab === 'seo'" class="space-y-6">
          <Card>
            <h2 class="text-2xl font-bold mb-6">SEO</h2>

            <div class="space-y-4">
              <Input
                v-model="page.meta_title"
                label="Titre SEO"
                placeholder="Titre optimisé pour les moteurs de recherche"
              />

              <Input
                v-model="page.meta_description"
                label="Description SEO"
                placeholder="Description pour les moteurs de recherche"
              />

              <Input
                v-model="page.canonical_url"
                label="URL Canonique"
                placeholder="https://boticia.com/about"
              />

              <Input
                v-model="page.robots"
                label="Robots"
                placeholder="index,follow"
              />

              <Input
                v-model="page.og_image"
                label="Image OG (Open Graph)"
                placeholder="/images/og-image.jpg"
              />
            </div>
          </Card>
        </div>
      </div>

      <!-- Error State -->
      <Card v-else variant="warning" class="text-center py-12">
        <IconLucid name="AlertCircle" size="lg" class="mx-auto mb-4" />
        <h3 class="text-xl font-bold mb-2">Page introuvable</h3>
        <p class="text-dark/60 mb-6">
          Cette page n'existe pas ou a été supprimée.
        </p>
        <Button variant="primary" to="/admin/cms">
          Retour aux Pages
        </Button>
      </Card>

      <!-- Add Section Modal -->
      <BaseModal
        v-if="showAddSectionModal"
        :isOpen="showAddSectionModal"
        @close="showAddSectionModal = false"
        title="Ajouter une Section"
      >
        <form @submit.prevent="addSection" class="space-y-4">
          <Input
            v-model="newSection.name"
            label="Nom"
            placeholder="Hero Principal"
            required
          />

          <Select
            v-model="newSection.component_type"
            :options="componentTypeOptions"
            label="Type de Composant"
            required
          />

          <div class="flex gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              @click="showAddSectionModal = false"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="primary"
              :loading="addingSectionLoading"
              class="flex-1"
            >
              Ajouter
            </Button>
          </div>
        </form>
      </BaseModal>

      <!-- Edit Section Modal -->
      <BaseModal
        v-if="editingSection"
        :isOpen="!!editingSection"
        @close="editingSection = null"
        :title="`Éditer: ${editingSection.name}`"
      >
        <div class="space-y-4">
          <Input
            v-model="editingSection.name"
            label="Nom"
          />

          <div>
            <label class="block text-sm font-medium mb-2">
              Contenu (JSON)
            </label>
            <textarea
              v-model="sectionContentJson"
              class="w-full h-64 p-3 border-2 border-dark font-mono text-sm"
              placeholder='{"title": "Titre", "subtitle": "Sous-titre"}'
            />
          </div>

          <div class="flex gap-3 pt-4">
            <Button variant="ghost" @click="editingSection = null">
              Annuler
            </Button>
            <Button
              variant="primary"
              :loading="savingSectionLoading"
              @click="saveSection"
              class="flex-1"
            >
              Enregistrer
            </Button>
          </div>
        </div>
      </BaseModal>

      <!-- Delete Section Confirmation -->
      <BaseModal
        v-if="sectionToDelete"
        :isOpen="!!sectionToDelete"
        @close="sectionToDelete = null"
        title="Confirmer la Suppression"
      >
        <p class="mb-6">
          Supprimer la section <strong>{{ sectionToDelete.name }}</strong> ?
        </p>

        <div class="flex gap-3">
          <Button variant="ghost" @click="sectionToDelete = null">
            Annuler
          </Button>
          <Button
            variant="primary"
            icon="Trash2"
            :loading="deletingSectionLoading"
            @click="executeDeleteSection"
            class="flex-1"
          >
            Supprimer
          </Button>
        </div>
      </BaseModal>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CmsPage, CmsSection } from "~/server/utils/cms-types";

definePageMeta({
  layout: "minimal",
  ssr: false,
  middleware: ["auth-admin"],
});

const route = useRoute();
const router = useRouter();
const cms = useCms();

// State
const page = ref<CmsPage | null>(null);
const sections = ref<CmsSection[]>([]);
const loading = ref(true);
const saving = ref(false);
const activeTab = ref<"content" | "settings" | "seo">("content");

// Sections
const showAddSectionModal = ref(false);
const editingSection = ref<CmsSection | null>(null);
const sectionToDelete = ref<CmsSection | null>(null);
const addingSectionLoading = ref(false);
const savingSectionLoading = ref(false);
const deletingSectionLoading = ref(false);
const sectionContentJson = ref("{}");

const newSection = reactive({
  name: "",
  component_type: "HeroSection",
});

// Options
const localeOptions = [
  { label: "Français", value: "fr" },
  { label: "English", value: "en" },
  { label: "日本語", value: "ja" },
];

const layoutOptions = [
  { label: "Default", value: "default" },
  { label: "Landing", value: "landing" },
  { label: "Dashboard", value: "dashboard" },
];

const componentTypeOptions = [
  { label: "Hero Section", value: "HeroSection" },
  { label: "Features Section", value: "FeaturesSection" },
  { label: "Pricing Section", value: "PricingSection" },
  { label: "FAQ Section", value: "FAQSection" },
  { label: "Process Section", value: "ProcessSection" },
];

// Load page
const loadPage = async () => {
  loading.value = true;

  try {
    const pageId = route.params.id as string;

    // Get page data
    const pages = await cms.getPages({ includeSections: false });
    page.value = pages.find((p) => p.id === pageId) || null;

    if (page.value) {
      // Load sections
      sections.value = await cms.getSectionsByPageId(page.value.id);
    }
  } catch (error) {
    console.error("Error loading page:", error);
  } finally {
    loading.value = false;
  }
};

// Save page
const savePage = async () => {
  if (!page.value) return;

  saving.value = true;

  try {
    await cms.updatePage(page.value.id, {
      title: page.value.title,
      slug: page.value.slug,
      description: page.value.description,
      locale: page.value.locale,
      layout: page.value.layout,
      meta_title: page.value.meta_title,
      meta_description: page.value.meta_description,
      canonical_url: page.value.canonical_url,
      robots: page.value.robots,
      og_image: page.value.og_image,
    });

    alert("Page enregistrée !");
  } catch (error) {
    console.error("Error saving page:", error);
    alert("Erreur lors de l'enregistrement");
  } finally {
    saving.value = false;
  }
};

// Publish
const publish = async () => {
  if (!page.value) return;

  try {
    await cms.publishPage(page.value.id);
    page.value.status = "published";
    alert("Page publiée !");
  } catch (error) {
    console.error("Error publishing:", error);
    alert("Erreur lors de la publication");
  }
};

// Handle save blocks from BlockEditor
const handleSaveBlocks = async (blocks: any[]) => {
  if (!page.value) return;

  saving.value = true;

  try {
    // Convertir les blocs en sections CMS
    const sectionsData = blocks.map((block, index) => ({
      page_id: page.value!.id,
      name: block.name,
      component_type: block.type,
      content: block.content,
      settings: block.settings,
      sort_order: index,
      is_visible: block.settings.visible,
    }));

    // Supprimer toutes les sections existantes
    for (const section of sections.value) {
      await cms.deleteSection(section.id);
    }

    // Créer les nouvelles sections
    for (const sectionData of sectionsData) {
      await cms.createSection(sectionData);
    }

    // Recharger les sections
    await loadSections();

    alert("Contenu enregistré !");
  } catch (error) {
    console.error("Error saving blocks:", error);
    alert("Erreur lors de l'enregistrement");
  } finally {
    saving.value = false;
  }
};

// Unpublish
const unpublish = async () => {
  if (!page.value) return;

  try {
    await cms.unpublishPage(page.value.id);
    page.value.status = "draft";
    alert("Page dépubliée !");
  } catch (error) {
    console.error("Error unpublishing:", error);
    alert("Erreur lors de la dépublication");
  }
};

// Add section
const addSection = async () => {
  if (!page.value) return;

  addingSectionLoading.value = true;

  try {
    await cms.createSection({
      page_id: page.value.id,
      name: newSection.name,
      component_type: newSection.component_type,
      sort_order: sections.value.length,
      content: {},
      settings: {},
    });

    showAddSectionModal.value = false;
    newSection.name = "";
    newSection.component_type = "HeroSection";

    await loadPage();
  } catch (error) {
    console.error("Error adding section:", error);
    alert("Erreur lors de l'ajout");
  } finally {
    addingSectionLoading.value = false;
  }
};

// Edit section
const editSection = (section: CmsSection) => {
  console.log("editSection called with:", section);
  editingSection.value = { ...section };
  sectionContentJson.value = JSON.stringify(section.content, null, 2);
  console.log("editingSection.value:", editingSection.value);
};

// Save section
const saveSection = async () => {
  if (!editingSection.value) return;

  savingSectionLoading.value = true;

  try {
    const content = JSON.parse(sectionContentJson.value);

    await cms.updateSection(editingSection.value.id, {
      name: editingSection.value.name,
      content,
    });

    editingSection.value = null;
    await loadPage();
  } catch (error) {
    console.error("Error saving section:", error);
    alert("Erreur lors de l'enregistrement (vérifiez le JSON)");
  } finally {
    savingSectionLoading.value = false;
  }
};

// Toggle section visibility
const toggleSectionVisibility = async (section: CmsSection) => {
  try {
    await cms.updateSection(section.id, {
      is_visible: !section.is_visible,
    });

    await loadPage();
  } catch (error) {
    console.error("Error toggling visibility:", error);
    alert("Erreur");
  }
};

// Confirm delete section
const confirmDeleteSection = (section: CmsSection) => {
  sectionToDelete.value = section;
};

// Execute delete section
const executeDeleteSection = async () => {
  if (!sectionToDelete.value) return;

  deletingSectionLoading.value = true;

  try {
    await cms.deleteSection(sectionToDelete.value.id);
    sectionToDelete.value = null;
    await loadPage();
  } catch (error) {
    console.error("Error deleting section:", error);
    alert("Erreur lors de la suppression");
  } finally {
    deletingSectionLoading.value = false;
  }
};

// Helpers
const getStatusVariant = (status: string) => {
  switch (status) {
    case "published":
      return "success";
    case "draft":
      return "warning";
    default:
      return "default";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "published":
      return "Publié";
    case "draft":
      return "Brouillon";
    default:
      return status;
  }
};

// Initial load
onMounted(() => {
  loadPage();
});

useHead({
  title: `CMS - ${page.value?.title || "Édition"}`,
});
</script>
