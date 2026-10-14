<template>
  <!-- Préparation d'un devis ou d'un moodboard : le(s) fichier(s) et le mot
       de Laëtitia pour la cliente, puis l'envoi. Même page sans cadre que
       la prise de notes. -->
  <BaseModal
    :is-open="isOpen"
    :title="title"
    :show-close-button="false"
    show-close-icon
    @close="handleClose"
  >
    <div class="max-w-2xl mx-auto">
      <!-- Fichiers -->
      <p class="text-xs uppercase tracking-wider text-gray-600 mb-3">
        {{ filesLabel }}
      </p>

      <div v-if="items.length" class="space-y-2 mb-3">
        <div
          v-for="item in items"
          :key="item.id"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-cream/60"
        >
          <div
            class="w-10 h-10 rounded-lg overflow-hidden bg-cream shrink-0 flex items-center justify-center"
          >
            <img
              v-if="item.isImage && item.url"
              :src="item.url"
              :alt="item.name"
              class="w-full h-full object-cover"
            />
            <IconLucid v-else name="FileText" size="sm" class="text-gray-500" />
          </div>
          <span class="flex-1 min-w-0 text-sm text-dark truncate">
            {{ item.name }}
          </span>
          <div class="relative shrink-0" data-file-menu>
            <button
              type="button"
              :aria-label="t('common.more_actions')"
              class="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-cream transition-all"
              @click="menuOpen = menuOpen === item.id ? null : item.id"
            >
              <IconLucid name="MoreHorizontal" size="xs" />
            </button>
            <div
              v-if="menuOpen === item.id"
              class="absolute right-0 top-9 bg-white rounded-xl shadow-lg border border-dark/10 py-1 z-10 min-w-[140px]"
            >
              <a
                v-if="item.url"
                :href="item.url"
                target="_blank"
                rel="noopener"
                class="block px-4 py-2 text-sm text-dark/70 hover:bg-cream transition-colors"
                @click="menuOpen = null"
              >
                {{ t("dashboard.draft_view_file") }}
              </a>
              <button
                type="button"
                class="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-cream transition-colors"
                @click="removeItem(item.id)"
              >
                {{ t("common.delete") }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Ajout : un seul PDF pour un devis, plusieurs fichiers pour un
           moodboard -->
      <button
        v-if="canAdd"
        type="button"
        :disabled="uploading"
        class="w-full flex items-center justify-center gap-2 px-4 py-5 rounded-xl
          border-2 border-dashed border-dark/15 text-sm text-gray-600
          hover:border-dark/30 hover:text-dark transition-colors disabled:opacity-50"
        @click="fileInput?.click()"
      >
        <IconLucid
          :name="uploading ? 'Loader2' : 'Upload'"
          size="sm"
          :class="uploading ? 'animate-spin' : ''"
        />
        {{ addLabel }}
      </button>
      <input
        ref="fileInput"
        type="file"
        :accept="accept"
        :multiple="multiple"
        class="hidden"
        @change="onFiles"
      />

      <!-- Le mot de Laëtitia -->
      <p class="text-xs uppercase tracking-wider text-gray-600 mt-8 mb-3">
        {{ t("dashboard.draft_note_label") }}
      </p>
      <textarea
        v-model="note"
        :placeholder="notePlaceholder"
        :aria-label="t('dashboard.draft_note_label')"
        class="w-full min-h-[25vh] p-0 border-0 bg-transparent
          focus:outline-none resize-none text-lg leading-relaxed text-dark
          placeholder:text-gray-400"
      />

      <div
        class="mt-4 pt-4 border-t border-gray-200 flex flex-col gap-3
          sm:flex-row sm:items-center sm:justify-end"
      >
        <Button
          type="button"
          variant="ghost"
          class="w-full sm:w-auto justify-center"
          @click="handleClose"
        >
          {{ t("dashboard.draft_save") }}
        </Button>
        <Button
          type="button"
          variant="primary"
          icon="Send"
          :loading="sending"
          :disabled="items.length === 0 || uploading"
          class="w-full sm:w-auto justify-center"
          @click="emit('send', note.trim())"
        >
          {{ t("dashboard.send_version", { version: nextVersion }) }}
        </Button>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { useEventListener } from "@vueuse/core";

export interface DraftFile {
  id: string;
  name: string;
  url?: string | null;
  isImage: boolean;
}

const props = defineProps<{
  isOpen: boolean;
  title: string;
  filesLabel: string;
  addLabel: string;
  notePlaceholder: string;
  items: DraftFile[];
  /** Mot déjà enregistré pour ce brouillon. */
  initialNote: string;
  nextVersion: number;
  accept: string;
  multiple: boolean;
  uploading: boolean;
  sending: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "add", files: File[]): void;
  (e: "remove", id: string): void;
  /** Le mot à garder avec le brouillon (à la fermeture). */
  (e: "save", note: string): void;
  (e: "send", note: string): void;
}>();

const { t } = useI18n();
const fileInput = ref<HTMLInputElement | null>(null);
const note = ref("");
const menuOpen = ref<string | null>(null);

// Un devis = un seul PDF ; un moodboard en accepte plusieurs.
const canAdd = computed(() => props.multiple || props.items.length === 0);

// À chaque ouverture, on repart du mot enregistré.
watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      note.value = props.initialNote || "";
      menuOpen.value = null;
    }
  }
);

useEventListener(document, "click", (e: MouseEvent) => {
  if (!(e.target as HTMLElement).closest("[data-file-menu]")) {
    menuOpen.value = null;
  }
});

function onFiles(event: Event) {
  const input = event.target as HTMLInputElement;
  const files = Array.from(input.files || []);
  if (files.length) emit("add", props.multiple ? files : files.slice(0, 1));
  input.value = "";
}

function removeItem(id: string) {
  menuOpen.value = null;
  emit("remove", id);
}

// Fermer (croix, Échap, « Enregistrer le brouillon ») garde le mot.
function handleClose() {
  if (note.value.trim() !== (props.initialNote || "").trim()) {
    emit("save", note.value.trim());
  }
  emit("close");
}
</script>
