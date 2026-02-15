<template>
  <div class="min-h-screen bg-cream">
    <div class="container mx-auto px-6 py-12">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-4xl font-bold text-dark mb-2">CMS - Pages</h1>
          <p class="text-dark/60">
            Gérez le contenu de votre site
          </p>
        </div>

        <div class="flex items-center gap-3">
          <Button variant="ghost" icon="LogOut" @click="handleLogout">
            Déconnexion
          </Button>
          <Button variant="primary" icon="Plus" @click="showCreateModal = true">
            Nouvelle Page
          </Button>
        </div>
      </div>

      <!-- Filters -->
      <Card class="mb-6">
        <div class="flex gap-4">
          <Select
            v-model="filters.status"
            :options="statusOptions"
            placeholder="Tous les statuts"
            class="w-48"
          />
          <Select
            v-model="filters.locale"
            :options="localeOptions"
            placeholder="Toutes les langues"
            class="w-48"
          />
        </div>
      </Card>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <IconLucid name="Loader2" class="animate-spin mx-auto mb-4" size="lg" />
        <p class="text-dark/60">Chargement des pages...</p>
      </div>

      <!-- Pages List -->
      <div v-else-if="pages.length > 0" class="space-y-4">
        <Card
          v-for="page in pages"
          :key="page.id"
          variant="standard"
          class="hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all"
        >
          <div class="flex items-center justify-between">
            <!-- Page Info -->
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <h3 class="text-xl font-bold">{{ page.title }}</h3>
                <Tag :variant="getStatusVariant(page.status)">
                  {{ getStatusLabel(page.status) }}
                </Tag>
                <Tag variant="default">{{ page.locale.toUpperCase() }}</Tag>
              </div>

              <p class="text-dark/60 text-sm mb-2">
                <IconLucid name="Link" size="sm" class="inline mr-1" />
                {{ page.slug }}
              </p>

              <p v-if="page.description" class="text-dark/80 text-sm">
                {{ page.description }}
              </p>

              <div class="flex gap-4 mt-3 text-sm text-dark/60">
                <span>
                  <IconLucid name="Calendar" size="sm" class="inline mr-1" />
                  {{ formatDate(page.created_at) }}
                </span>
                <span v-if="page.published_at">
                  <IconLucid name="CheckCircle" size="sm" class="inline mr-1" />
                  Publié le {{ formatDate(page.published_at) }}
                </span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-2">
              <Button
                variant="default"
                icon="Edit"
                :to="`/admin/cms/pages/${page.id}`"
              >
                Éditer
              </Button>

              <Button
                v-if="page.status === 'published'"
                variant="ghost"
                icon="EyeOff"
                @click="unpublish(page.id)"
              >
                Dépublier
              </Button>

              <Button
                v-else
                variant="primary"
                icon="Eye"
                @click="publish(page.id)"
              >
                Publier
              </Button>

              <Button
                variant="ghost"
                icon="Trash2"
                @click="confirmDelete(page)"
              >
                Supprimer
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <!-- Empty State -->
      <Card v-else variant="muted" class="text-center py-12">
        <IconLucid name="FileText" size="lg" class="mx-auto mb-4 text-dark/40" />
        <h3 class="text-xl font-bold mb-2">Aucune page</h3>
        <p class="text-dark/60 mb-6">
          Créez votre première page pour commencer
        </p>
        <Button variant="primary" icon="Plus" @click="showCreateModal = true">
          Créer une Page
        </Button>
      </Card>

      <!-- Create Modal -->
      <BaseModal
        v-if="showCreateModal"
        :isOpen="showCreateModal"
        @close="showCreateModal = false"
        title="Nouvelle Page"
      >
        <form @submit.prevent="createNewPage" class="space-y-4">
          <Input
            v-model="newPage.slug"
            label="Slug (URL)"
            placeholder="/about"
            required
          />

          <Input
            v-model="newPage.title"
            label="Titre"
            placeholder="À Propos"
            required
          />

          <Input
            v-model="newPage.description"
            label="Description"
            placeholder="Description de la page"
          />

          <Select
            v-model="newPage.locale"
            :options="localeOptions"
            label="Langue"
          />

          <Select
            v-model="newPage.layout"
            :options="layoutOptions"
            label="Layout"
          />

          <div class="flex gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              @click="showCreateModal = false"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="primary"
              :loading="creating"
              class="flex-1"
            >
              Créer la Page
            </Button>
          </div>
        </form>
      </BaseModal>

      <!-- Delete Confirmation Modal -->
      <BaseModal
        v-if="pageToDelete"
        :isOpen="!!pageToDelete"
        @close="pageToDelete = null"
        title="Confirmer la Suppression"
      >
        <p class="mb-6">
          Êtes-vous sûr de vouloir supprimer la page
          <strong>{{ pageToDelete.title }}</strong> ?
          Cette action est irréversible.
        </p>

        <div class="flex gap-3">
          <Button variant="ghost" @click="pageToDelete = null">
            Annuler
          </Button>
          <Button
            variant="primary"
            icon="Trash2"
            :loading="deleting"
            @click="executeDelete"
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
import type { CmsPage } from "~/server/utils/cms-types";

definePageMeta({
  layout: "minimal",
  ssr: false,
  middleware: ["auth-admin"],
});

const { getPages, createPage, deletePage, publishPage, unpublishPage } =
  useCms();
const supabase = useSupabaseClient();

// State
const pages = ref<CmsPage[]>([]);
const loading = ref(true);
const creating = ref(false);
const deleting = ref(false);
const showCreateModal = ref(false);
const pageToDelete = ref<CmsPage | null>(null);

// Filters
const filters = reactive({
  status: "",
  locale: "",
});

// New page form
const newPage = reactive({
  slug: "",
  title: "",
  description: "",
  locale: "fr",
  layout: "default",
});

// Options
const statusOptions = [
  { label: "Tous", value: "" },
  { label: "Brouillon", value: "draft" },
  { label: "Publié", value: "published" },
  { label: "Archivé", value: "archived" },
];

const localeOptions = [
  { label: "Toutes", value: "" },
  { label: "Français", value: "fr" },
  { label: "English", value: "en" },
  { label: "日本語", value: "ja" },
];

const layoutOptions = [
  { label: "Default", value: "default" },
  { label: "Landing", value: "landing" },
  { label: "Dashboard", value: "dashboard" },
];

// Load pages
const loadPages = async () => {
  loading.value = true;

  try {
    pages.value = await getPages({
      status: filters.status || undefined,
      locale: filters.locale || undefined,
    });
  } catch (error) {
    console.error("Error loading pages:", error);
  } finally {
    loading.value = false;
  }
};

// Create new page
const createNewPage = async () => {
  creating.value = true;

  try {
    const page = await createPage({
      slug: newPage.slug,
      title: newPage.title,
      description: newPage.description || undefined,
      locale: newPage.locale as "fr" | "en" | "ja",
      layout: newPage.layout as "default" | "landing" | "dashboard",
      status: "draft",
    });

    if (page) {
      showCreateModal.value = false;

      // Reset form
      newPage.slug = "";
      newPage.title = "";
      newPage.description = "";
      newPage.locale = "fr";
      newPage.layout = "default";

      // Reload pages
      await loadPages();

      // Redirect to editor
      navigateTo(`/admin/cms/pages/${page.id}`);
    }
  } catch (error) {
    console.error("Error creating page:", error);
    alert("Erreur lors de la création de la page");
  } finally {
    creating.value = false;
  }
};

// Publish page
const publish = async (id: string) => {
  try {
    await publishPage(id);
    await loadPages();
  } catch (error) {
    console.error("Error publishing page:", error);
    alert("Erreur lors de la publication");
  }
};

// Unpublish page
const unpublish = async (id: string) => {
  try {
    await unpublishPage(id);
    await loadPages();
  } catch (error) {
    console.error("Error unpublishing page:", error);
    alert("Erreur lors de la dépublication");
  }
};

// Confirm delete
const confirmDelete = (page: CmsPage) => {
  pageToDelete.value = page;
};

// Execute delete
const executeDelete = async () => {
  if (!pageToDelete.value) return;

  deleting.value = true;

  try {
    const success = await deletePage(pageToDelete.value.id);

    if (success) {
      pageToDelete.value = null;
      await loadPages();
    } else {
      alert("Erreur lors de la suppression");
    }
  } catch (error) {
    console.error("Error deleting page:", error);
    alert("Erreur lors de la suppression");
  } finally {
    deleting.value = false;
  }
};

// Helpers
const getStatusVariant = (status: string) => {
  switch (status) {
    case "published":
      return "success";
    case "draft":
      return "warning";
    case "archived":
      return "default";
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
    case "archived":
      return "Archivé";
    default:
      return status;
  }
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Logout
const handleLogout = async () => {
  await supabase.auth.signOut();
  navigateTo("/admin/login");
};

// Watch filters
watch(filters, () => {
  loadPages();
});

// Initial load
onMounted(() => {
  loadPages();
});

useHead({
  title: "CMS - Pages",
});
</script>
