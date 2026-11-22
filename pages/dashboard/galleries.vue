<template>
  <!-- ==========================================
       [PAGE-DASHBOARD-PHOTOS] — Photos du site
       Une photothèque unique (chaque photo déposée une fois, avec un type
       et une légende) et un onglet par page du site, qui reprend la mise en
       page de la page. Une seule action partout : cliquer sur une case,
       choisir une photo. Chaque choix est enregistré tout de suite.
       ========================================== -->
  <div class="flex-1 flex flex-col bg-white">
    <section class="py-6 md:py-8">
      <div class="px-4 md:px-10">
        <div v-if="loading" class="py-12 text-center">
          <IconLucid name="Loader2" size="lg" class="animate-spin mx-auto text-gray-300" />
        </div>

        <template v-else>
          <p
            v-if="error"
            role="alert"
            class="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
          >
            {{ error }}
          </p>

          <!-- Onglets -->
          <nav class="flex flex-wrap gap-2 mb-8">
            <button
              v-for="tab in TABS"
              :key="tab"
              type="button"
              class="h-10 px-5 rounded-full border text-sm transition-colors"
              :class="
                activeTab === tab
                  ? 'bg-dark text-cream border-dark'
                  : 'bg-white text-dark border-dark/20 hover:border-dark'
              "
              @click="activeTab = tab"
            >
              {{ t(`dashboard.photos_tab_${tab}`) }}
              <span
                v-if="tab === 'library'"
                class="ml-1"
                :class="activeTab === tab ? 'text-cream' : 'text-gray-500'"
              >
                {{ photos.length }}
              </span>
            </button>
          </nav>

          <!-- ===== Photothèque ===== -->
          <div v-if="activeTab === 'library'">
            <div class="mb-6">
              <h2 class="font-heading text-2xl text-dark">
                {{ t("dashboard.photos_tab_library") }}
              </h2>
              <p class="text-sm text-gray-500 mt-1">
                {{ t("dashboard.photos_library_intro") }}
              </p>
            </div>

            <!-- Filtres : le type, puis la collection -->
            <PhotoFilters class="mb-6" />

            <!-- Collection choisie : son nom, renommer, supprimer -->
            <div
              v-if="isCollectionName(collectionFilter)"
              class="mb-6 flex flex-wrap items-baseline gap-x-4 gap-y-1"
            >
              <p class="font-heading text-xl text-dark">{{ collectionFilter }}</p>
              <button
                type="button"
                class="text-sm text-gray-500 underline underline-offset-2 hover:text-dark"
                @click="openRename"
              >
                {{ t("dashboard.photos_collection_rename") }}
              </button>
              <button
                type="button"
                class="text-sm text-gray-500 underline underline-offset-2 hover:text-red-600"
                @click="collectionToDelete = collectionFilter"
              >
                {{ t("dashboard.photos_collection_delete") }}
              </button>
            </div>

            <!-- Mosaïque : chaque photo garde son vrai format. Cartes en
                 inline-block : sinon la marge du bas d'une colonne passe en
                 haut de la suivante et décale la première photo -->
            <div style="columns: 220px; column-gap: 16px">
              <!-- Dépôt -->
              <label
                class="rounded-xl border-2 border-dashed border-dark/15
                       flex flex-col items-center justify-center gap-2
                       text-gray-400 text-sm text-center px-3 mb-4 cursor-pointer
                       hover:border-dark/40 transition-colors"
                style="height: 160px; break-inside: avoid; display: inline-flex; width: 100%"
              >
                <input
                  type="file"
                  class="sr-only"
                  multiple
                  accept="image/png,image/jpeg,image/webp"
                  :disabled="uploading"
                  @change="pickFiles"
                />
                <IconLucid
                  :name="uploading ? 'Loader2' : 'Plus'"
                  size="sm"
                  :class="uploading ? 'animate-spin' : ''"
                />
                {{ uploading ? t("dashboard.photos_uploading") : t("dashboard.photos_drop") }}
              </label>

              <div
                v-for="photo in filteredPhotos"
                :key="photo.id"
                class="rounded-xl overflow-hidden border border-dark/10 bg-white mb-4"
                style="break-inside: avoid; display: inline-block; width: 100%"
              >
                <img
                  :src="photo.public_url"
                  :alt="photo.caption || ''"
                  loading="lazy"
                  class="block w-full h-auto bg-dark/5"
                />
                <div class="p-3 space-y-3">
                  <!-- Type : un seul choix -->
                  <fieldset role="radiogroup" :aria-label="t('dashboard.photos_type_label')">
                    <legend class="text-xs font-medium text-dark mb-1.5">
                      {{ t("dashboard.photos_type_label") }}
                    </legend>
                    <div class="flex flex-wrap gap-1.5">
                      <button
                        v-for="type in PHOTO_TYPES"
                        :key="type"
                        type="button"
                        role="radio"
                        :aria-checked="photo.photo_type === type"
                        class="h-7 px-2.5 rounded-full text-[11px] border transition-colors"
                        :class="
                          photo.photo_type === type
                            ? 'bg-dark text-cream border-dark'
                            : 'bg-white text-gray-500 border-dark/20 hover:border-dark'
                        "
                        @click="setType(photo, type)"
                      >
                        {{ t(`dashboard.photos_type_${type}`) }}
                      </button>
                    </div>
                  </fieldset>

                  <!-- Collection : son nom (clic = filtrer) et « Changer » -->
                  <div>
                    <p class="text-xs font-medium text-dark mb-1">
                      {{ t("dashboard.photos_collection_label") }}
                    </p>
                    <div v-if="photo.collection" class="flex items-baseline gap-2 min-w-0">
                      <button
                        type="button"
                        class="text-[11px] text-dark truncate text-left hover:underline"
                        :title="t('dashboard.photos_collection_show', { name: photo.collection })"
                        @click="collectionFilter = photo.collection"
                      >
                        {{ photo.collection }}
                      </button>
                      <button
                        type="button"
                        class="text-[11px] text-gray-500 underline underline-offset-2 shrink-0"
                        @click="openMove(photo)"
                      >
                        {{ t("dashboard.photos_collection_change") }}
                      </button>
                    </div>
                    <button
                      v-else
                      type="button"
                      class="text-[11px] text-gray-500 underline underline-offset-2"
                      @click="openMove(photo)"
                    >
                      {{ t("dashboard.photos_collection_add") }}
                    </button>
                  </div>

                  <!-- Légende : orange si la photo est sur le site, gris sinon -->
                  <CaptionRow :photo="photo" :muted="!usesOf(photo.id).length" />

                  <!-- Où elle apparaît -->
                  <p class="text-[11px] leading-snug text-gray-500">
                    <template v-if="usesOf(photo.id).length">
                      {{
                        t(
                          usesOf(photo.id).length > 1
                            ? "dashboard.photos_visible_many"
                            : "dashboard.photos_visible_one",
                          { pages: joinPages(usesOf(photo.id)) }
                        )
                      }}
                    </template>
                    <template v-else>{{ t("dashboard.photos_not_visible") }}</template>
                  </p>

                  <button
                    type="button"
                    class="text-[11px] text-gray-400 underline underline-offset-2 hover:text-red-600"
                    @click="photoToDelete = photo"
                  >
                    {{ t("dashboard.photos_delete") }}
                  </button>
                </div>
              </div>
            </div>
            <p v-if="!photos.length" class="text-sm text-gray-500 mt-4">
              {{ t("dashboard.photos_empty_library") }}
            </p>
          </div>

          <!-- ===== Grilles de 9 photos : Accueil, Mariages, Entreprises ===== -->
          <div v-else-if="GRID_PAGES.includes(activeTab)">
            <PageHeader :page="activeTab" />

            <!-- Mêmes proportions que le site : la petite case est en
                 portrait 3:4 et fixe la hauteur de la rangée -->
            <div class="flex gap-4">
              <div class="flex-[3] flex flex-col gap-4">
                <div v-for="row in GRID_ROWS" :key="row.join()" class="flex gap-4">
                  <SlotTile
                    v-for="n in row"
                    :key="n"
                    :photo="photoById(zones[activeTab].grid[n - 1])"
                    :label="String(n)"
                    :class="GRID_WIDE.includes(n) ? 'flex-[2]' : 'flex-[1]'"
                    :style="GRID_WIDE.includes(n) ? null : { aspectRatio: '3 / 4' }"
                    @pick="openPicker(activeTab, 'grid', n - 1)"
                    @clear="setSlot(activeTab, 'grid', n - 1, null)"
                  />
                </div>
              </div>
              <div class="flex-[1] flex flex-col gap-4">
                <SlotTile
                  v-for="n in [7, 8, 9]"
                  :key="n"
                  class="flex-1"
                  :photo="photoById(zones[activeTab].grid[n - 1])"
                  :label="String(n)"
                  @pick="openPicker(activeTab, 'grid', n - 1)"
                  @clear="setSlot(activeTab, 'grid', n - 1, null)"
                />
              </div>
            </div>

            <!-- Aussi dans la visionneuse -->
            <div class="mt-12 pt-8 border-t border-dark/10">
              <h3 class="font-heading text-xl text-dark">
                {{ t("dashboard.photos_viewer_title") }}
                <span class="text-gray-400 text-base">
                  ·
                  {{
                    t(
                      zones[activeTab].viewer.length > 1
                        ? "dashboard.photos_viewer_count_many"
                        : "dashboard.photos_viewer_count_one",
                      { n: zones[activeTab].viewer.length }
                    )
                  }}
                </span>
              </h3>
              <p class="text-sm text-gray-500 mt-1 mb-5">
                {{
                  zones[activeTab].viewer.length
                    ? t("dashboard.photos_viewer_text_some", { n: zones[activeTab].viewer.length })
                    : t("dashboard.photos_viewer_text_none")
                }}
              </p>
              <div
                style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 16px"
              >
                <SlotTile
                  v-for="(id, k) in (zones[activeTab].viewer as string[])"
                  :key="id"
                  style="aspect-ratio: 4 / 5"
                  :photo="photoById(id)"
                  :label="t('dashboard.photos_photo_n', { n: Number(k) + 10 })"
                  @pick="openPicker(activeTab, 'viewer', Number(k))"
                  @clear="removeFromViewer(activeTab, Number(k))"
                />
                <button
                  v-if="emptySlots(activeTab) === 0"
                  type="button"
                  class="rounded-lg border-2 border-dashed border-dark/15 bg-white
                         flex flex-col items-center justify-center gap-1
                         text-gray-400 text-xs hover:border-dark/40 transition-colors"
                  style="aspect-ratio: 4 / 5"
                  @click="openPicker(activeTab, 'viewer', zones[activeTab].viewer.length)"
                >
                  <span class="text-lg leading-none">+</span>
                  {{ t("dashboard.photos_viewer_add") }}
                </button>
              </div>
              <p
                v-if="emptySlots(activeTab) > 0"
                class="mt-1 text-sm text-gray-500 rounded-xl bg-cream/50 px-4 py-3"
              >
                {{
                  t(
                    emptySlots(activeTab) > 1
                      ? "dashboard.photos_viewer_locked_many"
                      : "dashboard.photos_viewer_locked_one",
                    { n: emptySlots(activeTab) }
                  )
                }}
              </p>
            </div>

            <!-- Abonnement floral (page Entreprises seulement) -->
            <div v-if="activeTab === 'events'" class="mt-12 pt-8 border-t border-dark/10">
              <h3 class="font-heading text-xl text-dark">
                {{ t("dashboard.photos_subscription_title") }}
              </h3>
              <p class="text-sm text-gray-500 mt-1 mb-5">
                {{ t("dashboard.photos_subscription_text") }}
              </p>
              <div class="grid grid-cols-2 gap-4 max-w-md">
                <SlotTile
                  v-for="n in [0, 1]"
                  :key="n"
                  style="aspect-ratio: 1 / 1"
                  :photo="photoById(zones.events.subscription[n])"
                  :label="t(n === 0 ? 'dashboard.photos_subscription_main' : 'dashboard.photos_subscription_second')"
                  @pick="openPicker('events', 'subscription', n)"
                  @clear="setSlot('events', 'subscription', n, null)"
                />
              </div>
            </div>
          </div>

          <!-- ===== Créations : ouverture + 4 chapitres ===== -->
          <div v-else-if="activeTab === 'creations'">
            <PageHeader page="creations" />
            <div class="max-w-3xl space-y-8">
              <div :style="TWO_COLS">
                <div class="pt-2">
                  <p class="section-tagline">{{ t("dashboard.photos_opening") }}</p>
                  <p class="text-sm text-gray-500 mt-2">
                    {{ t("dashboard.photos_opening_text") }}
                  </p>
                </div>
                <SlotTile
                  style="aspect-ratio: 5 / 6"
                  :photo="photoById(zones.creations.opening[0])"
                  :label="t('dashboard.photos_opening')"
                  @pick="openPicker('creations', 'opening', 0)"
                  @clear="setSlot('creations', 'opening', 0, null)"
                />
              </div>
              <div
                v-for="chapter in CHAPTERS"
                :key="chapter"
                class="pt-8 border-t border-dark/10"
                :style="TWO_COLS"
              >
                <div>
                  <p class="section-tagline">
                    {{ t(`creations.chapter_${chapter}_tagline`) }}
                  </p>
                  <p class="font-heading text-xl text-dark mt-2">
                    {{ t(`creations.chapter_${chapter}_title`) }}
                  </p>
                </div>
                <div
                  style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; align-items: start"
                >
                  <SlotTile
                    v-for="n in [0, 1]"
                    :key="n"
                    style="aspect-ratio: 3 / 4"
                    :class="n === 1 ? 'mt-8' : ''"
                    :photo="photoById(zones.creations[chapter][n])"
                    :label="t('dashboard.photos_photo_n', { n: n + 1 })"
                    @pick="openPicker('creations', chapter, n)"
                    @clear="setSlot('creations', chapter, n, null)"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- ===== Atelier floral : 3 photos ===== -->
          <div v-else-if="activeTab === 'workshops'">
            <PageHeader page="workshops" />
            <div class="grid grid-cols-3 gap-3 max-w-3xl">
              <SlotTile
                v-for="n in [0, 1, 2]"
                :key="n"
                style="aspect-ratio: 3 / 4"
                :photo="photoById(zones.workshops.grid[n])"
                :label="t('dashboard.photos_photo_n', { n: n + 1 })"
                @pick="openPicker('workshops', 'grid', n)"
                @clear="setSlot('workshops', 'grid', n, null)"
              />
            </div>
          </div>
        </template>
      </div>
    </section>

    <!-- Type des photos déposées -->
    <BaseModal
      :is-open="!!pendingFiles.length"
      :title="t('dashboard.photos_upload_title')"
      :show-close-button="false"
      show-close-icon
      compact
      @close="pendingFiles = []"
    >
      <div class="space-y-6">
        <!-- Aperçu des photos choisies -->
        <div class="flex gap-2 overflow-x-auto pb-1">
          <img
            v-for="(url, i) in pendingPreviews"
            :key="i"
            :src="url"
            alt=""
            class="rounded-lg object-cover shrink-0"
            style="width: 64px; height: 64px"
          />
        </div>

        <!-- 1. Le type : un seul, facultatif (un 2e clic le retire) -->
        <fieldset>
          <legend class="text-sm font-medium text-dark mb-2">
            {{ t("dashboard.photos_upload_step_type") }}
            <span class="font-normal text-gray-500">{{ t("dashboard.photos_optional") }}</span>
          </legend>
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="type in PHOTO_TYPES"
              :key="type"
              type="button"
              :aria-pressed="uploadType === type"
              class="h-11 rounded-full border text-sm transition-colors"
              :class="
                uploadType === type
                  ? 'bg-dark text-cream border-dark'
                  : 'bg-white text-dark border-dark/20 hover:border-dark'
              "
              @click="uploadType = uploadType === type ? null : type"
            >
              {{ t(`dashboard.photos_type_${type}`) }}
            </button>
          </div>
        </fieldset>

        <!-- 2. La collection : facultative -->
        <div>
          <label for="upload-collection" class="block text-sm font-medium text-dark mb-1">
            {{ t("dashboard.photos_upload_step_collection") }}
            <span class="font-normal text-gray-500">{{ t("dashboard.photos_optional") }}</span>
          </label>
          <p class="text-sm text-gray-500 mb-2">
            {{ t("dashboard.photos_upload_collection_help") }}
            <ExamplesLink />
          </p>
          <CollectionField id="upload-collection" v-model="uploadCollection" />
        </div>

        <div class="space-y-3">
          <Button variant="primary" class="w-full justify-center" @click="uploadFiles">
            {{
              pendingFiles.length > 1
                ? t("dashboard.photos_upload_confirm_many", { n: pendingFiles.length })
                : t("dashboard.photos_upload_confirm_one")
            }}
          </Button>
          <p class="text-xs text-gray-500 text-center">
            {{ t("dashboard.photos_upload_change_later") }}
          </p>
        </div>
      </div>
    </BaseModal>

    <!-- Collection d'une photo : changer ou retirer -->
    <BaseModal
      :is-open="!!movePhoto"
      :title="t('dashboard.photos_collection_title')"
      :show-close-button="false"
      show-close-icon
      compact
      @close="movePhoto = null"
    >
      <div v-if="movePhoto" class="space-y-5">
        <img
          :src="movePhoto.public_url"
          alt=""
          class="w-full h-auto rounded-lg"
          style="max-height: 30vh; object-fit: contain"
        />
        <div>
          <label for="move-collection" class="block text-sm font-medium text-dark mb-2">
            {{ t("dashboard.photos_collection_label") }}
          </label>
          <CollectionField id="move-collection" v-model="moveDraft" />
        </div>
        <div class="space-y-4">
          <Button
            variant="primary"
            class="w-full justify-center"
            :loading="savingCollection"
            @click="saveMove(moveDraft)"
          >
            {{ t("dashboard.photos_save") }}
          </Button>
          <Button
            v-if="movePhoto.collection"
            variant="ghost"
            class="!flex mx-auto w-fit"
            @click="saveMove(null)"
          >
            {{ t("dashboard.photos_collection_remove") }}
          </Button>
        </div>
      </div>
    </BaseModal>

    <!-- Renommer une collection -->
    <BaseModal
      :is-open="renameOpen"
      :title="t('dashboard.photos_collection_rename_title')"
      :show-close-button="false"
      show-close-icon
      compact
      @close="renameOpen = false"
    >
      <div class="space-y-5">
        <input
          v-model="renameDraft"
          type="text"
          maxlength="80"
          data-autofocus
          :aria-label="t('dashboard.photos_collection_rename_title')"
          class="w-full h-12 px-4 text-base border border-dark/30 rounded-lg
                 focus:outline-none focus:border-dark"
          @keydown.enter="saveRename"
        />
        <p class="text-sm text-gray-500">
          {{
            countIn(collectionFilter) > 1
              ? t("dashboard.photos_collection_rename_many", { n: countIn(collectionFilter) })
              : t("dashboard.photos_collection_rename_one")
          }}
        </p>
        <Button
          variant="primary"
          class="w-full justify-center"
          :loading="savingCollection"
          :disabled="!renameDraft.trim()"
          @click="saveRename"
        >
          {{ t("dashboard.photos_save") }}
        </Button>
      </div>
    </BaseModal>

    <!-- Supprimer une collection : les photos restent -->
    <BaseModal
      :is-open="!!collectionToDelete"
      :title="t('dashboard.photos_collection_delete_title')"
      :show-close-button="false"
      show-close-icon
      compact
      @close="collectionToDelete = null"
    >
      <div v-if="collectionToDelete" class="space-y-5">
        <p class="text-dark leading-relaxed">
          {{
            countIn(collectionToDelete) > 1
              ? t("dashboard.photos_collection_delete_many", {
                  n: countIn(collectionToDelete),
                  name: collectionToDelete,
                })
              : t("dashboard.photos_collection_delete_one", { name: collectionToDelete })
          }}
        </p>
        <div class="space-y-4">
          <Button
            variant="primary"
            class="w-full justify-center"
            :loading="savingCollection"
            @click="deleteCollection"
          >
            {{ t("dashboard.photos_collection_delete") }}
          </Button>
          <Button variant="ghost" class="!flex mx-auto w-fit" @click="collectionToDelete = null">
            {{ t("dashboard.photos_cancel") }}
          </Button>
        </div>
      </div>
    </BaseModal>

    <!-- Suppression -->
    <BaseModal
      :is-open="!!photoToDelete"
      :title="t('dashboard.photos_delete_title')"
      :show-close-button="false"
      show-close-icon
      compact
      @close="photoToDelete = null"
    >
      <div v-if="photoToDelete" class="space-y-5">
        <img
          :src="photoToDelete.public_url"
          alt=""
          class="w-full h-auto rounded-lg"
          style="max-height: 35vh; object-fit: contain"
        />
        <p class="text-dark leading-relaxed">
          <template v-if="usesOf(photoToDelete.id).length">
            {{
              t(
                usesOf(photoToDelete.id).length > 1
                  ? "dashboard.photos_delete_used_many"
                  : "dashboard.photos_delete_used_one",
                { pages: joinPages(usesOf(photoToDelete.id)) }
              )
            }}
          </template>
          <template v-else>{{ t("dashboard.photos_delete_unused") }}</template>
        </p>
        <p class="text-sm text-gray-500">{{ t("dashboard.photos_delete_final") }}</p>
        <div class="space-y-4">
          <button
            type="button"
            class="w-full h-12 rounded-full bg-red-600 text-white text-sm
                   font-medium hover:bg-red-700 transition-colors disabled:opacity-60"
            :disabled="deleting"
            @click="deletePhoto"
          >
            {{ t("dashboard.photos_delete_confirm") }}
          </button>
          <Button variant="ghost" class="!flex mx-auto w-fit" @click="photoToDelete = null">
            {{ t("dashboard.photos_cancel") }}
          </Button>
        </div>
      </div>
    </BaseModal>

    <!-- Légende : photo à gauche (ordinateur), saisie à droite -->
    <BaseModal
      :is-open="!!captionPhoto"
      :title="t('dashboard.photos_caption_title')"
      :show-close-button="false"
      show-close-icon
      @close="captionPhoto = null"
    >
      <div
        v-if="captionPhoto"
        class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-start"
      >
        <div class="bg-cream/50 rounded-lg flex items-center justify-center">
          <img
            :src="captionPhoto.public_url"
            alt=""
            class="w-full h-auto rounded-lg"
            style="max-height: 60vh; object-fit: contain"
          />
        </div>
        <div class="space-y-5">
          <div>
            <label for="caption-modal" class="block text-sm font-medium text-dark mb-2">
              {{ t("dashboard.photos_caption_label") }}
            </label>
            <input
              id="caption-modal"
              v-model="captionDraft"
              type="text"
              maxlength="200"
              data-autofocus
              class="w-full h-12 px-4 text-base border border-dark/30 rounded-lg
                     focus:outline-none focus:border-dark"
              @keydown.enter="saveCaption"
            />
          </div>
          <!-- Légende anglaise : facultative, pour les versions anglaise et
               japonaise du site (vide = le français s'affiche) -->
          <div>
            <label for="caption-modal-en" class="block text-sm font-medium text-dark mb-1">
              {{ t("dashboard.photos_caption_label_en") }}
              <span class="font-normal text-gray-500">{{ t("dashboard.photos_optional") }}</span>
            </label>
            <p class="text-xs text-gray-500 mb-2">
              {{ t("dashboard.photos_caption_en_help") }}
            </p>
            <input
              id="caption-modal-en"
              v-model="captionDraftEn"
              type="text"
              maxlength="200"
              lang="en"
              class="w-full h-12 px-4 text-base border border-dark/30 rounded-lg
                     focus:outline-none focus:border-dark"
              @keydown.enter="saveCaption"
            />
          </div>
          <div class="rounded-xl bg-cream/50 px-4 py-3 text-sm text-gray-600">
            <p>{{ t("dashboard.photos_caption_help") }}</p>
            <ul class="mt-3 space-y-1.5">
              <li>{{ t("dashboard.photos_caption_ex1") }}</li>
              <li>{{ t("dashboard.photos_caption_ex2") }}</li>
              <li>{{ t("dashboard.photos_caption_ex3") }}</li>
            </ul>
            <div class="mt-3 flex flex-wrap gap-x-5 gap-y-2">
              <ExamplesLink />
              <!-- Prompt à coller dans un chat IA, avec la photo -->
              <Button
                variant="ghost"
                class="!inline-block !p-0 !text-sm underline underline-offset-2"
                @click="copyPrompt"
              >
                {{ promptCopied ? t("dashboard.photos_ai_copied") : t("dashboard.photos_ai_copy") }}
              </Button>
            </div>
          </div>
          <div class="space-y-4">
            <Button
              variant="primary"
              class="w-full justify-center"
              :loading="savingCaption"
              @click="saveCaption"
            >
              {{ t("dashboard.photos_save") }}
            </Button>
            <Button variant="ghost" class="!flex mx-auto w-fit" @click="captionPhoto = null">
              {{ t("dashboard.photos_cancel") }}
            </Button>
          </div>
        </div>
      </div>
    </BaseModal>

    <!-- Choix d'une photo -->
    <BaseModal
      :is-open="pickerOpen"
      :title="t('dashboard.photos_picker_title')"
      :show-close-button="false"
      show-close-icon
      @close="pickerOpen = false"
    >
      <PhotoFilters class="mb-4" />
      <div style="columns: 160px; column-gap: 12px">
        <button
          v-for="photo in filteredPhotos"
          :key="photo.id"
          type="button"
          class="relative w-full mb-3 rounded-lg overflow-hidden bg-dark/5 group"
          style="break-inside: avoid; display: inline-block; width: 100%"
          @click="choose(photo.id)"
        >
          <img
            :src="photo.public_url"
            :alt="photo.caption || ''"
            loading="lazy"
            class="block w-full h-auto group-hover:scale-105 transition-transform"
          />
          <span
            v-if="usesOf(photo.id).length"
            class="absolute top-1 left-1 px-2 py-0.5 rounded-full text-[11px] bg-white text-dark"
            :title="joinPages(usesOf(photo.id))"
          >
            {{ t("dashboard.photos_already_used") }}
          </span>
        </button>
      </div>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { h } from "vue";
import { useI18n } from "vue-i18n";
import Button from "~/components/ui/Button.vue";
import type { GalleryImage, PhotoType } from "~/server/utils/galleries-types";

definePageMeta({
  ssr: false,
  layout: "dashboard",
  middleware: ["auth-admin"],
  pageTransition: false,
  layoutTransition: false,
});

const { t } = useI18n();
const { adminFetch } = useAdminFetch();
const { compress } = useImageCompression();
const localePath = useLocalePath();

const pageTitle = useState<string | null>("dashboard-page-title", () => null);
pageTitle.value = t("dashboard.photos_title");
useHead({ title: t("dashboard.photos_title") + " - Boticia" });

// ── Configuration (même liste que server/utils/photo-placements.ts) ──
const PHOTO_TYPES: PhotoType[] = ["mariage", "entreprise", "atelier"];
const TABS = ["library", "home", "creations", "wedding", "events", "workshops"];
const GRID_PAGES = ["home", "wedding", "events"];
const CHAPTERS = ["bouquets", "ceremonie", "reception", "accessoires"] as const;
// Grille : 3 rangées à gauche (case large en alternance), 3 cases à droite
const GRID_ROWS = [
  [1, 2],
  [3, 4],
  [5, 6],
];
const GRID_WIDE = [1, 4, 5];
const PAGE_URLS: Record<string, string> = {
  home: "index",
  wedding: "mariages",
  events: "evenements",
  creations: "creations",
  workshops: "ateliers",
};
const TWO_COLS = {
  display: "grid",
  gridTemplateColumns: "2fr 3fr",
  gap: "24px",
  alignItems: "start",
};

const emptyZones = () => ({
  home: { grid: Array(9).fill(null), viewer: [] as string[] },
  wedding: { grid: Array(9).fill(null), viewer: [] as string[] },
  events: {
    grid: Array(9).fill(null),
    viewer: [] as string[],
    subscription: [null, null],
  },
  workshops: { grid: Array(3).fill(null) },
  creations: {
    opening: [null],
    bouquets: [null, null],
    ceremonie: [null, null],
    reception: [null, null],
    accessoires: [null, null],
  },
});

// ── État ───────────────────────────────────────────────────────
const loading = ref(true);
const error = ref("");
const activeTab = ref("library");
const typeFilter = ref<string>("all");
const collectionFilter = ref<string>("all");
const photos = ref<GalleryImage[]>([]);
const zones = reactive<any>(emptyZones());

const load = async () => {
  try {
    const res = await adminFetch<{
      data: { photos: GalleryImage[]; placements: any[] };
    }>("/api/admin/photos");
    photos.value = res.data.photos;
    Object.assign(zones, emptyZones());
    for (const p of res.data.placements) {
      const list = zones[p.page]?.[p.zone];
      if (!list) continue;
      if (p.zone === "viewer") list.push(p.image_id);
      else if (p.position < list.length) list[p.position] = p.image_id;
    }
  } catch (err) {
    console.error("Error loading photos:", err);
    error.value = t("dashboard.photos_error");
  } finally {
    loading.value = false;
  }
};
onMounted(load);

const photoById = (id: string | null) =>
  (id && photos.value.find((p) => p.id === id)) || null;

// « all » et « none » sont des filtres ; tout le reste est un nom
const isCollectionName = (value: string | null) =>
  !!value && value !== "all" && value !== "none";

const matchesType = (p: GalleryImage) => {
  if (typeFilter.value === "all") return true;
  if (typeFilter.value === "none") return !p.photo_type;
  return p.photo_type === typeFilter.value;
};

const filteredPhotos = computed(() =>
  photos.value.filter((p) => {
    if (!matchesType(p)) return false;
    if (collectionFilter.value === "none") return !p.collection;
    if (isCollectionName(collectionFilter.value)) {
      return p.collection === collectionFilter.value;
    }
    return true;
  })
);

// Collections du type choisi, par ordre alphabétique, avec leur nombre
// de photos (on ne propose pas une collection vide pour ce type)
const collections = computed(() => {
  const counts: Record<string, number> = {};
  for (const p of photos.value) {
    if (p.collection && matchesType(p)) {
      counts[p.collection] = (counts[p.collection] ?? 0) + 1;
    }
  }
  return Object.entries(counts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, count]) => ({ name, count }));
});

// Toutes les collections, quel que soit le type (pour les proposer)
const allCollections = computed(() =>
  [...new Set(photos.value.map((p) => p.collection).filter(Boolean))].sort(
    (a, b) => a!.localeCompare(b!)
  ) as string[]
);

const countIn = (name: string | null) =>
  photos.value.filter((p) => p.collection === name).length;

// Si la collection choisie n'existe pas pour le nouveau type : « Toutes »
watch(typeFilter, () => {
  if (
    isCollectionName(collectionFilter.value) &&
    !collections.value.some((c) => c.name === collectionFilter.value)
  ) {
    collectionFilter.value = "all";
  }
});

// Pages où une photo apparaît
const usesOf = (id: string) => {
  const uses: string[] = [];
  for (const page of ["home", "creations", "wedding", "events", "workshops"]) {
    const used = Object.values(zones[page]).some((list: any) => list.includes(id));
    if (used) uses.push(t(`dashboard.photos_tab_${page}`));
  }
  return uses;
};
const joinPages = (pages: string[]) =>
  pages.length > 1
    ? `${pages.slice(0, -1).join(", ")} ${t("dashboard.photos_and")} ${pages.at(-1)}`
    : pages[0] ?? "";

const pageIds = (page: string) =>
  [...new Set(Object.values(zones[page]).flat().filter(Boolean))] as string[];
const captionStats = (page: string) => {
  const ids = pageIds(page);
  return {
    total: ids.length,
    missing: ids.filter((id) => !photoById(id)?.caption?.trim()).length,
  };
};
const emptySlots = (page: string) =>
  zones[page].grid.filter((id: string | null) => !id).length;

// ── Enregistrement ─────────────────────────────────────────────
const fail = (err: unknown) => {
  console.error(err);
  error.value = t("dashboard.photos_error");
  load();
};

const saveZone = async (page: string, zone: string) => {
  error.value = "";
  try {
    await adminFetch("/api/admin/placements", {
      method: "PUT",
      body: { page, zone, image_ids: zones[page][zone] },
    });
  } catch (err) {
    fail(err);
  }
};

const setSlot = (page: string, zone: string, index: number, id: string | null) => {
  zones[page][zone][index] = id;
  saveZone(page, zone);
};

const removeFromViewer = (page: string, index: number) => {
  zones[page].viewer.splice(index, 1);
  saveZone(page, "viewer");
};

const setType = async (photo: GalleryImage, type: PhotoType) => {
  const previous = photo.photo_type;
  photo.photo_type = type;
  try {
    await adminFetch(`/api/admin/photos/${photo.id}`, {
      method: "PATCH",
      body: { photo_type: type },
    });
  } catch (err) {
    photo.photo_type = previous;
    fail(err);
  }
};

// ── Sélecteur de photo ────────────────────────────────────────
const pickerOpen = ref(false);
const target = ref<{ page: string; zone: string; index: number } | null>(null);

const openPicker = (page: string, zone: string, index: number) => {
  target.value = { page, zone, index };
  pickerOpen.value = true;
};

const choose = (id: string) => {
  const { page, zone, index } = target.value!;
  const list = zones[page][zone];
  // Une photo n'apparaît qu'une fois dans une zone : on la déplace
  const already = list.indexOf(id);
  if (already !== -1 && already !== index) {
    if (zone === "viewer") list.splice(already, 1);
    else list[already] = null;
  }
  if (zone === "viewer" && index >= list.length) list.push(id);
  else list[index] = id;
  pickerOpen.value = false;
  saveZone(page, zone);
};

// ── Légende ────────────────────────────────────────────────────
const captionPhoto = ref<GalleryImage | null>(null);
const captionDraft = ref("");
const captionDraftEn = ref("");
const savingCaption = ref(false);

const openCaption = (photo: GalleryImage) => {
  captionPhoto.value = photo;
  captionDraft.value = photo.caption || "";
  captionDraftEn.value = photo.caption_en || "";
  promptCopied.value = false;
};

// Prompt pour un chat IA : on y joint la photo, l'IA propose la légende
const promptCopied = ref(false);
const copyPrompt = async () => {
  promptCopied.value = await copyText(t("dashboard.photos_ai_prompt"));
};

const saveCaption = async () => {
  const photo = captionPhoto.value;
  if (!photo || savingCaption.value) return;
  savingCaption.value = true;
  try {
    const res = await adminFetch<{ data: GalleryImage }>(
      `/api/admin/photos/${photo.id}`,
      {
        method: "PATCH",
        body: { caption: captionDraft.value, caption_en: captionDraftEn.value },
      }
    );
    photo.caption = res.data.caption;
    photo.caption_en = res.data.caption_en ?? null;
    captionPhoto.value = null;
  } catch (err) {
    fail(err);
  } finally {
    savingCaption.value = false;
  }
};

// ── Dépôt ──────────────────────────────────────────────────────
const pendingFiles = ref<File[]>([]);
const pendingPreviews = ref<string[]>([]);
const uploadType = ref<PhotoType | null>(null);
const uploadCollection = ref("");
const uploading = ref(false);

// Les aperçus sont libérés quand la fenêtre se ferme
watch(pendingFiles, (files) => {
  pendingPreviews.value.forEach((url) => URL.revokeObjectURL(url));
  pendingPreviews.value = files.map((file) => URL.createObjectURL(file));
});

const pickFiles = (event: Event) => {
  const input = event.target as HTMLInputElement;
  pendingFiles.value = Array.from(input.files || []);
  input.value = "";
  // Une collection est affichée : les nouvelles photos y vont par défaut
  uploadType.value = PHOTO_TYPES.includes(typeFilter.value as PhotoType)
    ? (typeFilter.value as PhotoType)
    : null;
  uploadCollection.value = isCollectionName(collectionFilter.value)
    ? collectionFilter.value
    : "";
};

const uploadFiles = async () => {
  const files = pendingFiles.value;
  const type = uploadType.value;
  const collection = uploadCollection.value.replace(/\s+/g, " ").trim();
  pendingFiles.value = [];
  uploading.value = true;
  error.value = "";
  for (const raw of files) {
    try {
      const file = await compress(raw);
      const form = new FormData();
      form.append("file", file);
      if (type) form.append("photo_type", type);
      if (collection) form.append("collection", collection);
      const res = await adminFetch<{ data: GalleryImage }>("/api/admin/photos", {
        method: "POST",
        body: form,
      });
      photos.value.unshift(res.data);
    } catch (err) {
      console.error("Error uploading photo:", err);
      error.value = t("dashboard.photos_error");
    }
  }
  uploading.value = false;
  // On montre la collection qui vient d'être remplie
  if (collection) {
    typeFilter.value = "all";
    collectionFilter.value = collection;
  }
};

// ── Collections ────────────────────────────────────────────────
const savingCollection = ref(false);

// Changer ou retirer la collection d'une photo
const movePhoto = ref<GalleryImage | null>(null);
const moveDraft = ref("");

const openMove = (photo: GalleryImage) => {
  movePhoto.value = photo;
  moveDraft.value = photo.collection ?? "";
};

const saveMove = async (name: string | null) => {
  const photo = movePhoto.value;
  if (!photo || savingCollection.value) return;
  savingCollection.value = true;
  try {
    const res = await adminFetch<{ data: GalleryImage }>(
      `/api/admin/photos/${photo.id}`,
      { method: "PATCH", body: { collection: name } }
    );
    photo.collection = res.data.collection ?? null;
    movePhoto.value = null;
  } catch (err) {
    fail(err);
  } finally {
    savingCollection.value = false;
  }
};

// Renommer ou supprimer une collection (les photos restent)
const updateCollection = async (from: string, to: string | null) => {
  savingCollection.value = true;
  try {
    const res = await adminFetch<{ data: { collection: string | null } }>(
      "/api/admin/photo-collections",
      { method: "PATCH", body: { from, to } }
    );
    for (const p of photos.value) {
      if (p.collection === from) p.collection = res.data.collection;
    }
    collectionFilter.value = res.data.collection ?? "all";
    return true;
  } catch (err) {
    fail(err);
    return false;
  } finally {
    savingCollection.value = false;
  }
};

const renameOpen = ref(false);
const renameDraft = ref("");

const openRename = () => {
  renameDraft.value = collectionFilter.value;
  renameOpen.value = true;
};

const saveRename = async () => {
  if (!renameDraft.value.trim() || savingCollection.value) return;
  if (await updateCollection(collectionFilter.value, renameDraft.value)) {
    renameOpen.value = false;
  }
};

const collectionToDelete = ref<string | null>(null);

const deleteCollection = async () => {
  const name = collectionToDelete.value;
  if (!name || savingCollection.value) return;
  if (await updateCollection(name, null)) {
    collectionToDelete.value = null;
  }
};

// ── Suppression ────────────────────────────────────────────────
const photoToDelete = ref<GalleryImage | null>(null);
const deleting = ref(false);

const deletePhoto = async () => {
  const photo = photoToDelete.value;
  if (!photo) return;
  deleting.value = true;
  try {
    await adminFetch(`/api/admin/photos/${photo.id}`, { method: "DELETE" });
    // Les emplacements sont supprimés en base (cascade) : on suit en local
    for (const page of Object.keys(zones)) {
      for (const zone of Object.keys(zones[page])) {
        const list = zones[page][zone];
        if (zone === "viewer") zones[page][zone] = list.filter((x: string) => x !== photo.id);
        else zones[page][zone] = list.map((x: string | null) => (x === photo.id ? null : x));
      }
    }
    photos.value = photos.value.filter((p) => p.id !== photo.id);
    photoToDelete.value = null;
  } catch (err) {
    fail(err);
  } finally {
    deleting.value = false;
  }
};

// ── Petits composants ──────────────────────────────────────────
// « Voir des exemples » : l'article du guide sur les collections et les
// légendes, dans un nouvel onglet (la saisie en cours n'est pas perdue)
const ExamplesLink = (_: unknown, { attrs }: any) =>
  h(
    Button,
    {
      variant: "ghost",
      href: `${localePath("/dashboard/guide")}?article=collections-legendes`,
      target: "_blank",
      rel: "noopener",
      class: [
        "!inline-block !p-0 !text-sm underline underline-offset-2",
        attrs.class,
      ],
    },
    () => t("dashboard.photos_examples_link")
  );
ExamplesLink.inheritAttrs = false;

// Pastille de filtre (avec un nombre facultatif)
const chip = (active: boolean, label: string, onClick: () => void, count?: number) =>
  h(
    "button",
    {
      type: "button",
      "aria-pressed": active,
      class: [
        "h-8 px-3 rounded-full text-xs border transition-colors",
        active
          ? "bg-dark text-cream border-dark"
          : "bg-white text-dark border-dark/20 hover:border-dark",
      ],
      onClick,
    },
    count === undefined
      ? label
      : [label, h("span", { class: active ? "ml-1 text-cream" : "ml-1 text-gray-500" }, count)]
  );

// Au-delà de 8 collections, une liste déroulante prend moins de place
const COLLECTION_CHIPS_MAX = 8;

// 2 rangées de filtres : le type, puis les collections de ce type
const PhotoFilters = (_: unknown, { attrs }: any) => {
  const rowLabel = (text: string) =>
    h("span", { class: "text-xs font-medium text-dark", style: "width: 80px" }, text);

  const collectionRow =
    collections.value.length > COLLECTION_CHIPS_MAX
      ? [
          h(
            "select",
            {
              value: collectionFilter.value,
              "aria-label": t("dashboard.photos_filter_collection"),
              class:
                "h-9 max-w-full px-3 pr-8 rounded-full text-xs border border-dark/20 bg-white text-dark",
              onChange: (e: Event) =>
                (collectionFilter.value = (e.target as HTMLSelectElement).value),
            },
            [
              h("option", { value: "all" }, t("dashboard.photos_filter_all")),
              ...collections.value.map((c) =>
                h("option", { value: c.name }, `${c.name} (${c.count})`)
              ),
              h("option", { value: "none" }, t("dashboard.photos_filter_no_collection")),
            ]
          ),
        ]
      : [
          chip(collectionFilter.value === "all", t("dashboard.photos_filter_all"), () =>
            (collectionFilter.value = "all")
          ),
          ...collections.value.map((c) =>
            chip(
              collectionFilter.value === c.name,
              c.name,
              () => (collectionFilter.value = c.name),
              c.count
            )
          ),
          chip(
            collectionFilter.value === "none",
            t("dashboard.photos_filter_no_collection"),
            () => (collectionFilter.value = "none")
          ),
        ];

  return h("div", { class: ["space-y-3", attrs.class] }, [
    h("div", { class: "flex flex-wrap items-center gap-2" }, [
      rowLabel(t("dashboard.photos_filter_type")),
      ...["all", ...PHOTO_TYPES, "none"].map((key) =>
        chip(
          typeFilter.value === key,
          key === "all"
            ? t("dashboard.photos_filter_all")
            : key === "none"
              ? t("dashboard.photos_filter_none")
              : t(`dashboard.photos_type_${key}`),
          () => (typeFilter.value = key)
        )
      ),
    ]),
    // Pas encore de collection : la rangée n'apparaît pas
    allCollections.value.length
      ? h("div", { class: "flex flex-wrap items-center gap-2" }, [
          rowLabel(t("dashboard.photos_filter_collection")),
          ...collectionRow,
        ])
      : null,
  ]);
};
PhotoFilters.inheritAttrs = false;

// Champ de collection : on écrit un nom, ou on choisit une collection
// existante dans les pastilles en dessous
const CollectionField = (props: any, { emit }: any) =>
  h("div", [
    h("input", {
      id: props.id,
      type: "text",
      maxlength: 80,
      value: props.modelValue,
      placeholder: t("dashboard.photos_collection_placeholder"),
      class:
        "w-full h-12 px-4 text-base border border-dark/30 rounded-lg focus:outline-none focus:border-dark",
      onInput: (e: Event) => emit("update:modelValue", (e.target as HTMLInputElement).value),
    }),
    allCollections.value.length
      ? h("div", { class: "mt-3" }, [
          h("p", { class: "text-xs text-gray-500 mb-2" }, t("dashboard.photos_collection_existing")),
          h(
            "div",
            { class: "flex flex-wrap gap-2" },
            allCollections.value.map((name) =>
              chip(props.modelValue === name, name, () => emit("update:modelValue", name))
            )
          ),
        ])
      : null,
  ]);
CollectionField.props = ["id", "modelValue"];
CollectionField.emits = ["update:modelValue"];

// Ligne de légende : « + Ajouter une légende » ou légende + « Modifier »
const captionRow = (photo: GalleryImage, muted = false) =>
  photo.caption
    ? h("div", { class: "flex items-baseline gap-2 min-w-0" }, [
        h("p", { class: "text-[11px] text-dark truncate", title: photo.caption }, photo.caption),
        h(
          "button",
          {
            type: "button",
            class: "text-[11px] text-gray-500 underline underline-offset-2 shrink-0",
            onClick: () => openCaption(photo),
          },
          t("dashboard.photos_caption_edit")
        ),
      ])
    : h(
        "button",
        {
          type: "button",
          class: [
            "text-[11px] underline underline-offset-2 text-left",
            muted ? "text-gray-400" : "text-orange-600",
          ],
          onClick: () => openCaption(photo),
        },
        t("dashboard.photos_caption_add")
      );

const CaptionRow = (props: any) => captionRow(props.photo, props.muted);
CaptionRow.props = ["photo", "muted"];

// Case d'une page : vide (+) ou photo (croix pour retirer), légende dessous
const SlotTile = (props: any, { emit, attrs }: any) =>
  h("div", { class: ["flex flex-col gap-1.5 min-w-0", attrs.class] }, [
    h(
      "div",
      {
        class: [
          "relative rounded-lg overflow-hidden group flex-1 min-h-0",
          props.photo ? "bg-dark/5" : "border-2 border-dashed border-dark/15 bg-white",
        ],
        style: attrs.style,
      },
      [
        h(
          "button",
          {
            type: "button",
            class:
              "absolute inset-0 w-full h-full flex flex-col items-center justify-center gap-1 text-gray-400 text-xs",
            onClick: () => emit("pick"),
            "aria-label": t("dashboard.photos_choose_slot", { label: props.label }),
          },
          props.photo
            ? [
                h("img", {
                  src: props.photo.public_url,
                  alt: props.photo.caption || "",
                  class: "absolute inset-0 w-full h-full object-cover",
                }),
              ]
            : [h("span", { class: "text-lg leading-none" }, "+"), h("span", props.label)]
        ),
        props.photo
          ? h(
              "button",
              {
                type: "button",
                class:
                  "absolute top-1 right-1 w-7 h-7 rounded-full bg-white text-dark text-sm flex items-center justify-center shadow",
                onClick: () => emit("clear"),
                "aria-label": t("dashboard.photos_remove"),
              },
              "×"
            )
          : null,
      ]
    ),
    // Case vide : ligne invisible de même hauteur, pour l'alignement
    props.photo
      ? captionRow(props.photo)
      : h(
          "span",
          { class: "text-[11px] invisible", "aria-hidden": "true" },
          t("dashboard.photos_caption_add")
        ),
  ]);
SlotTile.props = ["photo", "label"];
SlotTile.emits = ["pick", "clear"];
SlotTile.inheritAttrs = false;

// En-tête d'une page : titre, explication, lien, légendes manquantes
const PageHeader = (props: any) => {
  const stats = captionStats(props.page);
  return h("div", { class: "mb-6" }, [
    h("h2", { class: "font-heading text-2xl text-dark" }, t(`dashboard.photos_tab_${props.page}`)),
    h("p", { class: "text-sm text-gray-500 mt-1" }, [
      t(`dashboard.photos_page_${props.page}_text`),
      " ",
      h(
        "a",
        {
          href: localePath(PAGE_URLS[props.page]),
          target: "_blank",
          class: "underline underline-offset-4",
        },
        t("dashboard.photos_view_page")
      ),
    ]),
    stats.missing > 0
      ? h(
          "p",
          { class: "text-sm text-orange-600 mt-2" },
          t(
            stats.missing > 1 ? "dashboard.photos_missing_many" : "dashboard.photos_missing_one",
            { n: stats.missing }
          )
        )
      : stats.total > 0
        ? h("p", { class: "text-sm text-green-700 mt-2" }, t("dashboard.photos_all_captioned"))
        : null,
  ]);
};
PageHeader.props = ["page"];
</script>
