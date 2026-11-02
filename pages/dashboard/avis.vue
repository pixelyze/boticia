<template>
  <div class="flex-1 flex flex-col bg-white">
    <section class="py-6 md:py-8">
      <div class="px-4 md:px-10 max-w-4xl mx-auto w-full">
        <!-- En-tête : explication + ajout -->
        <div
          class="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center
            sm:justify-between"
        >
          <p class="text-dark/60">{{ t("dashboard.testimonials_hint") }}</p>
          <Button
            variant="primary"
            icon="Plus"
            class="shrink-0 justify-center"
            @click="openEditor(null)"
          >
            {{ t("dashboard.testimonials_add") }}
          </Button>
        </div>

        <p v-if="listError" class="mb-4 text-sm text-red-600">
          {{ listError }}
        </p>

        <!-- Chargement -->
        <div v-if="loading" class="py-12 text-center">
          <IconLucid
            name="Loader2"
            size="lg"
            class="animate-spin mx-auto text-gray-300"
          />
        </div>

        <!-- Aucun avis -->
        <div
          v-else-if="testimonials.length === 0"
          class="py-12 text-center text-dark/40"
        >
          {{ t("dashboard.testimonials_empty") }}
        </div>

        <!-- Liste, dans l'ordre d'affichage -->
        <ol v-else class="space-y-3">
          <li
            v-for="(item, index) in testimonials"
            :key="item.id"
            class="rounded-[1.5rem] bg-cream/50 p-5 flex flex-col gap-4
              md:flex-row md:items-center"
            :class="item.is_published ? '' : 'opacity-60'"
          >
            <!-- Contenu : un toucher ouvre l'édition -->
            <Button
              variant="ghost"
              class="!p-0 !border-0 !rounded-none flex-1 min-w-0 text-left
                !no-underline hover:!bg-transparent block"
              @click="openEditor(item)"
            >
              <span
                class="block italic text-dark/80 leading-relaxed line-clamp-3"
              >
                « {{ item.text_fr }} »
              </span>
              <span class="mt-2 flex flex-wrap items-center gap-2 text-sm">
                <span class="font-medium text-dark">
                  {{ item.author_name }}
                </span>
                <span v-if="item.context_fr" class="text-dark/50">
                  · {{ item.context_fr }}
                </span>
                <span
                  v-if="!item.text_en"
                  class="px-2 py-0.5 rounded-full bg-white text-xs
                    text-dark/70 border border-dark/10"
                >
                  {{ t("dashboard.testimonials_missing_en") }}
                </span>
              </span>
            </Button>

            <!-- Actions : affiché / masqué, ordre, modifier -->
            <div class="flex items-center gap-2 shrink-0">
              <Button
                :icon="item.is_published ? 'Eye' : 'EyeOff'"
                :variant="item.is_published ? 'primary' : 'default'"
                class="!py-2 !px-4 text-sm"
                :disabled="busyId === item.id"
                @click="togglePublished(item)"
              >
                {{
                  item.is_published
                    ? t("dashboard.testimonials_visible")
                    : t("dashboard.testimonials_hidden")
                }}
              </Button>
              <Button
                icon="ArrowUp"
                icon-only
                :aria-label="t('dashboard.testimonials_move_up')"
                :title="t('dashboard.testimonials_move_up')"
                :disabled="index === 0 || reordering"
                @click="move(index, -1)"
              />
              <Button
                icon="ArrowDown"
                icon-only
                :aria-label="t('dashboard.testimonials_move_down')"
                :title="t('dashboard.testimonials_move_down')"
                :disabled="index === testimonials.length - 1 || reordering"
                @click="move(index, 1)"
              />
              <Button
                icon="Pencil"
                icon-only
                :aria-label="t('dashboard.testimonials_edit')"
                :title="t('dashboard.testimonials_edit')"
                @click="openEditor(item)"
              />
            </div>
          </li>
        </ol>
      </div>
    </section>

    <!-- Fenêtre d'ajout / de modification -->
    <BaseModal
      :is-open="editorOpen"
      :title="
        editingId
          ? t('dashboard.testimonials_edit')
          : t('dashboard.testimonials_new')
      "
      :show-close-button="true"
      :close-button-text="t('common.close')"
      @close="closeEditor"
    >
      <form class="max-w-2xl mx-auto space-y-8" @submit.prevent="save">
        <!-- Nom (identique dans les deux langues) -->
        <div>
          <label for="testimonial-author" class="block font-medium mb-1">
            {{ t("dashboard.testimonials_author") }}
          </label>
          <p class="text-sm text-dark/50 mb-2">
            {{ t("dashboard.testimonials_author_hint") }}
          </p>
          <input
            id="testimonial-author"
            v-model="form.author_name"
            type="text"
            :maxlength="LIMITS.author"
            required
            data-autofocus
            class="w-full h-12 px-4 rounded-xl border-2 border-dark/10
              bg-white focus:outline-none focus:border-dark"
          />
          <p class="mt-1.5 flex items-start justify-between gap-3 text-xs">
              <span
                :class="lengthInfo('author_name').warning ? 'text-dark font-medium' : ''"
              >
                {{ lengthInfo('author_name').warning }}
              </span>
              <span class="shrink-0 text-right text-dark/40">
                {{ lengthInfo('author_name').count }} ·
                {{ lengthInfo('author_name').advice }}
              </span>
            </p>
        </div>

        <!-- Français -->
        <fieldset class="space-y-4">
          <legend class="font-heading text-lg text-dark mb-1">
            {{ t("dashboard.testimonials_french") }}
          </legend>
          <div>
            <label for="testimonial-text-fr" class="block font-medium mb-1">
              {{ t("dashboard.testimonials_text") }}
            </label>
            <p class="text-sm text-dark/50 mb-2">
              {{ t("dashboard.testimonials_text_hint") }}
            </p>
            <textarea
              id="testimonial-text-fr"
              v-model="form.text_fr"
              rows="4"
              :maxlength="LIMITS.text"
              required
              class="w-full px-4 py-3 rounded-xl border-2 border-dark/10
                bg-white focus:outline-none focus:border-dark resize-y
                leading-relaxed"
            />
            <p class="mt-1.5 flex items-start justify-between gap-3 text-xs">
              <span
                :class="lengthInfo('text_fr').warning ? 'text-dark font-medium' : ''"
              >
                {{ lengthInfo('text_fr').warning }}
              </span>
              <span class="shrink-0 text-right text-dark/40">
                {{ lengthInfo('text_fr').count }} ·
                {{ lengthInfo('text_fr').advice }}
              </span>
            </p>
          </div>
          <div>
            <label for="testimonial-context-fr" class="block font-medium mb-1">
              {{ t("dashboard.testimonials_context") }}
            </label>
            <p class="text-sm text-dark/50 mb-2">
              {{ t("dashboard.testimonials_context_hint") }}
            </p>
            <input
              id="testimonial-context-fr"
              v-model="form.context_fr"
              type="text"
              :maxlength="LIMITS.context"
              :placeholder="t('dashboard.testimonials_context_example_fr')"
              class="w-full h-12 px-4 rounded-xl border-2 border-dark/10
              bg-white focus:outline-none focus:border-dark"
            />
            <p class="mt-1.5 flex items-start justify-between gap-3 text-xs">
              <span
                :class="lengthInfo('context_fr').warning ? 'text-dark font-medium' : ''"
              >
                {{ lengthInfo('context_fr').warning }}
              </span>
              <span class="shrink-0 text-right text-dark/40">
                {{ lengthInfo('context_fr').count }} ·
                {{ lengthInfo('context_fr').advice }}
              </span>
            </p>
          </div>
        </fieldset>

        <!-- Anglais (facultatif) -->
        <fieldset class="space-y-4">
          <legend class="font-heading text-lg text-dark mb-1">
            {{ t("dashboard.testimonials_english") }}
          </legend>
          <p class="text-sm text-dark/50">
            {{ t("dashboard.testimonials_english_hint") }}
          </p>
          <div>
            <label for="testimonial-text-en" class="block font-medium mb-2">
              {{ t("dashboard.testimonials_text") }}
            </label>
            <textarea
              id="testimonial-text-en"
              v-model="form.text_en"
              rows="4"
              :maxlength="LIMITS.text"
              lang="en"
              class="w-full px-4 py-3 rounded-xl border-2 border-dark/10
                bg-white focus:outline-none focus:border-dark resize-y
                leading-relaxed"
            />
            <p class="mt-1.5 flex items-start justify-between gap-3 text-xs">
              <span
                :class="lengthInfo('text_en').warning ? 'text-dark font-medium' : ''"
              >
                {{ lengthInfo('text_en').warning }}
              </span>
              <span class="shrink-0 text-right text-dark/40">
                {{ lengthInfo('text_en').count }} ·
                {{ lengthInfo('text_en').advice }}
              </span>
            </p>
          </div>
          <div>
            <label for="testimonial-context-en" class="block font-medium mb-2">
              {{ t("dashboard.testimonials_context") }}
            </label>
            <input
              id="testimonial-context-en"
              v-model="form.context_en"
              type="text"
              :maxlength="LIMITS.context"
              lang="en"
              :placeholder="t('dashboard.testimonials_context_example_en')"
              class="w-full h-12 px-4 rounded-xl border-2 border-dark/10
              bg-white focus:outline-none focus:border-dark"
            />
            <p class="mt-1.5 flex items-start justify-between gap-3 text-xs">
              <span
                :class="lengthInfo('context_en').warning ? 'text-dark font-medium' : ''"
              >
                {{ lengthInfo('context_en').warning }}
              </span>
              <span class="shrink-0 text-right text-dark/40">
                {{ lengthInfo('context_en').count }} ·
                {{ lengthInfo('context_en').advice }}
              </span>
            </p>
          </div>
        </fieldset>

        <!-- Affiché sur le site -->
        <label class="flex items-center gap-3 cursor-pointer select-none">
          <input
            v-model="form.is_published"
            type="checkbox"
            class="w-5 h-5 accent-black"
          />
          <span class="font-medium text-dark">
            {{ t("dashboard.testimonials_publish") }}
          </span>
        </label>

        <p v-if="formError" class="text-sm text-red-600">{{ formError }}</p>

        <div class="flex flex-col gap-3 sm:flex-row sm:items-center
          sm:justify-between pt-2">
          <!-- Suppression en deux temps (pas de fenêtre du navigateur) -->
          <Button
            v-if="editingId"
            type="button"
            variant="ghost"
            icon="Trash2"
            :class="confirmingDelete ? '!text-red-600' : ''"
            :loading="deleting"
            @click="removeTestimonial"
          >
            {{
              confirmingDelete
                ? t("dashboard.testimonials_delete_confirm")
                : t("dashboard.testimonials_delete")
            }}
          </Button>
          <span v-else />
          <Button
            type="submit"
            variant="primary"
            icon="Check"
            class="justify-center"
            :loading="saving"
          >
            {{ t("dashboard.testimonials_save") }}
          </Button>
        </div>
      </form>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import type { Testimonial } from "~/utils/testimonials";
import {
  TESTIMONIAL_LIMITS as LIMITS,
  TESTIMONIAL_ADVICE as ADVICE,
} from "~/utils/testimonials";

definePageMeta({
  ssr: false,
  layout: "dashboard",
  middleware: ["auth-admin"],
  pageTransition: false,
  layoutTransition: false,
});

const { t } = useI18n();
const { adminFetch } = useAdminFetch();

const pageTitle = useState<string | null>("dashboard-page-title", () => null);
pageTitle.value = t("dashboard.testimonials_title");
useHead({ title: t("dashboard.testimonials_title") + " - Boticia" });

const testimonials = ref<Testimonial[]>([]);
const loading = ref(true);
const listError = ref("");
const busyId = ref<string | null>(null);
const reordering = ref(false);

const errorMessage = (err: any) =>
  err?.data?.message || err?.message || t("dashboard.testimonials_error");

async function fetchTestimonials() {
  try {
    const res = await adminFetch<{ data: Testimonial[] }>(
      "/api/admin/testimonials"
    );
    testimonials.value = res.data;
    listError.value = "";
  } catch (err) {
    listError.value = errorMessage(err);
  } finally {
    loading.value = false;
  }
}

onMounted(fetchTestimonials);

// ── Affiché / masqué ────────────────────────────────
async function togglePublished(item: Testimonial) {
  busyId.value = item.id;
  try {
    const res = await adminFetch<{ data: Testimonial }>(
      `/api/admin/testimonials/${item.id}`,
      { method: "PATCH", body: { is_published: !item.is_published } }
    );
    Object.assign(item, res.data);
    listError.value = "";
  } catch (err) {
    listError.value = errorMessage(err);
  } finally {
    busyId.value = null;
  }
}

// ── Ordre : on échange avec le voisin, puis on enregistre ──
async function move(index: number, direction: -1 | 1) {
  const target = index + direction;
  if (target < 0 || target >= testimonials.value.length) return;
  const previous = [...testimonials.value];
  const next = [...previous];
  [next[index], next[target]] = [next[target], next[index]];
  testimonials.value = next;

  reordering.value = true;
  try {
    await adminFetch("/api/admin/testimonials/reorder", {
      method: "POST",
      body: { ids: next.map((t) => t.id) },
    });
    listError.value = "";
  } catch (err) {
    testimonials.value = previous;
    listError.value = errorMessage(err);
  } finally {
    reordering.value = false;
  }
}

// ── Fenêtre d'ajout / de modification ───────────────
const editorOpen = ref(false);
const editingId = ref<string | null>(null);
const saving = ref(false);
const deleting = ref(false);
const confirmingDelete = ref(false);
const formError = ref("");

const emptyForm = () => ({
  author_name: "",
  text_fr: "",
  context_fr: "",
  text_en: "",
  context_en: "",
  is_published: true,
});
const form = reactive(emptyForm());

// ── Aide à la rédaction : compteur, longueur conseillée, conséquence ──
type LengthField =
  | "author_name"
  | "text_fr"
  | "text_en"
  | "context_fr"
  | "context_en";

function lengthInfo(field: LengthField) {
  const count = form[field].trim().length;
  const isText = field === "text_fr" || field === "text_en";
  const max = isText
    ? LIMITS.text
    : field === "author_name"
      ? LIMITS.author
      : LIMITS.context;
  const adviceMax = isText
    ? ADVICE.text.max
    : field === "author_name"
      ? ADVICE.author
      : ADVICE.context;

  let warning = "";
  if (count >= max) {
    warning = t("dashboard.testimonials_limit_reached", { max });
  } else if (count > adviceMax) {
    warning = isText
      ? t("dashboard.testimonials_too_long_text")
      : t("dashboard.testimonials_too_long_line");
  }

  return {
    count: t("dashboard.testimonials_count", { count }),
    advice: isText
      ? t("dashboard.testimonials_advice_range", {
          min: ADVICE.text.min,
          max: ADVICE.text.max,
        })
      : t("dashboard.testimonials_advice_max", { max: adviceMax }),
    warning,
  };
}

function openEditor(item: Testimonial | null) {
  Object.assign(
    form,
    item
      ? {
          author_name: item.author_name,
          text_fr: item.text_fr,
          context_fr: item.context_fr ?? "",
          text_en: item.text_en ?? "",
          context_en: item.context_en ?? "",
          is_published: item.is_published,
        }
      : emptyForm()
  );
  editingId.value = item?.id ?? null;
  formError.value = "";
  confirmingDelete.value = false;
  editorOpen.value = true;
}

function closeEditor() {
  editorOpen.value = false;
}

async function save() {
  saving.value = true;
  formError.value = "";
  try {
    if (editingId.value) {
      const res = await adminFetch<{ data: Testimonial }>(
        `/api/admin/testimonials/${editingId.value}`,
        { method: "PATCH", body: { ...form } }
      );
      const index = testimonials.value.findIndex((t) => t.id === res.data.id);
      if (index >= 0) testimonials.value[index] = res.data;
    } else {
      const res = await adminFetch<{ data: Testimonial }>(
        "/api/admin/testimonials",
        { method: "POST", body: { ...form } }
      );
      testimonials.value.push(res.data);
    }
    closeEditor();
  } catch (err) {
    formError.value = errorMessage(err);
  } finally {
    saving.value = false;
  }
}

async function removeTestimonial() {
  if (!editingId.value) return;
  if (!confirmingDelete.value) {
    confirmingDelete.value = true;
    return;
  }
  deleting.value = true;
  try {
    await adminFetch(`/api/admin/testimonials/${editingId.value}`, {
      method: "DELETE",
    });
    testimonials.value = testimonials.value.filter(
      (t) => t.id !== editingId.value
    );
    closeEditor();
  } catch (err) {
    formError.value = errorMessage(err);
  } finally {
    deleting.value = false;
  }
}
</script>
