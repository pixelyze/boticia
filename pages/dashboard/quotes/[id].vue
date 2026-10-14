<template>
  <div class="flex-1 flex flex-col">
    <section class="pt-4 pb-6 md:pt-6 md:pb-8">
      <div class="px-4 md:px-10">
        <!-- Loading -->
        <div v-if="loading" class="py-16 text-center">
          <IconLucid
            name="Loader2"
            size="lg"
            class="animate-spin mx-auto text-gray-500"
          />
          <p class="text-dark/60 mt-4">{{ t("common.loading") }}</p>
        </div>

        <!-- Error -->
        <div v-else-if="fetchError" class="py-16 text-center">
          <IconLucid
            name="AlertCircle"
            size="lg"
            class="mx-auto text-red-400 mb-4"
          />
          <p class="text-dark/60 mb-4">
            {{ t("dashboard.quotes_error") }}
          </p>
          <Button icon="RefreshCw" @click="fetchQuote">
            {{ t("dashboard.quotes_retry") }}
          </Button>
        </div>

        <!-- Detail content -->
        <template v-else-if="quote">
          <!-- Copilot full-page view -->
          <div
            v-if="activeSection === 'copilot'"
            class="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]"
          >
            <div class="max-w-lg w-full text-center">
              <!-- Sparkles icon -->
              <div
                class="w-16 h-16 rounded-full bg-cream-dark flex items-center justify-center mx-auto mb-8 copilot-fade-in copilot-fade-in-1"
              >
                <IconLucid
                  name="Sparkles"
                  size="md"
                  class="text-fuchsia-500 animate-pulse"
                />
              </div>

              <!-- Status badge -->
              <div
                class="mb-4 copilot-fade-in copilot-fade-in-2"
              >
                <Tag :variant="isUrgent ? 'warning' : 'default'">
                  {{ t(`dashboard.quote_status_${quote.status}`) }}
                </Tag>
              </div>

              <!-- Typewriter message -->
              <p
                class="text-xl md:text-2xl font-heading text-dark leading-relaxed mb-10 copilot-fade-in copilot-fade-in-2"
              >
                <span>{{ displayedText }}</span>
                <span
                  v-if="isTyping"
                  class="copilot-cursor"
                >|</span>
              </p>

              <!-- CTAs -->
              <div
                v-if="!isTyping"
                class="flex flex-wrap justify-center gap-3 copilot-actions-reveal"
              >
                <button
                  @click="activeSection = 'project'"
                  class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-dark text-cream text-sm font-semibold hover:bg-dark/80 transition-all"
                >
                  <IconLucid name="NotebookPen" size="xs" />
                  {{ t("dashboard.project_view_title") }}
                </button>
              </div>

              <!-- Client inspirations preview -->
              <div
                v-if="
                  !isTyping &&
                  clientInspirations.length > 0
                "
                class="mt-10 copilot-actions-reveal"
              >
                <p
                  class="text-sm text-dark/50 uppercase tracking-wider mb-3"
                >
                  {{
                    t("dashboard.client_inspirations_title")
                  }}
                </p>
                <div
                  class="flex flex-wrap justify-center gap-2"
                >
                  <button
                    v-for="item in clientInspirations.slice(0, 6)"
                    :key="item.id"
                    @click="copilotGalleryOpen = true"
                    class="w-16 h-16 rounded-xl overflow-hidden ring-1 ring-dark/5 hover:ring-fuchsia-300 transition-all hover:scale-105"
                  >
                    <img
                      :src="item.public_url"
                      :alt="
                        item.caption ||
                        item.original_filename
                      "
                      class="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </button>
                  <button
                    v-if="clientInspirations.length > 6"
                    @click="activeSection = 'project'"
                    class="w-16 h-16 rounded-xl bg-cream flex items-center justify-center text-dark/60 text-xs font-semibold hover:bg-cream-dark transition-colors"
                  >
                    +{{
                      clientInspirations.length - 6
                    }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Project view: grid layout -->
          <div
            v-else
            class="flex flex-col xl:flex-row gap-6"
          >
            <!-- MAIN CONTENT -->
            <div class="flex-1 min-w-0 flex flex-col xl:flex-row gap-6">
              <!-- Copilot button -->
              <div class="hidden xl:block pt-2">
                <button
                  class="w-10 h-10 rounded-full bg-cream-dark
                    flex items-center justify-center
                    hover:bg-dark hover:text-cream
                    transition-all text-gray-500"
                  :aria-label="t('dashboard.copilot_title')"
                  @click="activeSection = 'copilot'"
                >
                  <IconLucid name="Sparkles" size="xs" />
                </button>
              </div>
              <!-- LEFT: White panel -->
              <div class="flex-1 min-w-0">
              <div
                class="rounded-3xl bg-white p-6 border-2 border-dark/10"
              >
              <div class="flex flex-col md:flex-row gap-6">
                <!-- Left column: Statut + Prestations -->
                <div class="flex-1 min-w-0 space-y-6">
                  <!-- Statut -->
                  <div>
                    <h2 class="font-heading text-sm text-dark/60 uppercase tracking-wider mb-3">
                      {{ t("dashboard.quote_detail_status") }}
                    </h2>
                    <div class="space-y-3">
                      <button
                        class="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-dark/10 bg-white hover:bg-cream transition-all w-full text-left"
                        :aria-label="t('dashboard.quote_detail_change_status')"
                        @click="statusModalOpen = true"
                      >
                        <div class="w-7 h-7 rounded-full bg-cream-dark flex items-center justify-center shrink-0">
                          <IconLucid :name="statusIcon(quote.status)" size="xs" class="text-gray-500" />
                        </div>
                        <div class="flex-1 min-w-0">
                          <span class="text-xs text-dark/40 block">{{ t("dashboard.quote_detail_change_status") }}</span>
                          <span class="font-medium text-dark text-sm block">{{ t(`dashboard.quote_status_${quote.status}`) }}</span>
                        </div>
                        <IconLucid name="ChevronRight" size="xs" class="text-gray-400 shrink-0" />
                      </button>
                      <!-- Rendez-vous passé : un fait, plus un créneau à déplacer -->
                      <div
                        v-if="isMeetingPast"
                        class="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-dark/10 bg-white w-full"
                      >
                        <div class="w-7 h-7 rounded-full bg-cream flex items-center justify-center shrink-0">
                          <IconLucid name="CalendarCheck" size="xs" class="text-gray-400" />
                        </div>
                        <div class="flex-1 min-w-0">
                          <span class="text-xs text-dark/40 block">{{ t("dashboard.quote_detail_meeting_past") }}</span>
                          <span class="text-sm block text-dark font-medium">
                            {{ formatDate(quote.meeting_date!) + (quote.meeting_time ? ` — ${quote.meeting_time}` : "") }}
                          </span>
                        </div>
                      </div>
                      <button
                        v-else
                        class="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-dark/10 bg-white hover:bg-cream transition-all w-full text-left"
                        @click="scheduleModalOpen = true"
                      >
                        <div class="w-7 h-7 rounded-full bg-cream flex items-center justify-center shrink-0">
                          <IconLucid name="CalendarCheck" size="xs" class="text-gray-400" />
                        </div>
                        <div class="flex-1 min-w-0">
                          <span class="text-xs text-dark/40 block">{{ t("dashboard.quote_detail_change_meeting") }}</span>
                          <span class="text-sm block" :class="quote.meeting_date ? 'text-dark font-medium' : 'text-dark/40'">
                            {{ quote.meeting_date ? formatDate(quote.meeting_date) + (quote.meeting_time ? ` — ${quote.meeting_time}` : "") : t("dashboard.quote_detail_no_meeting") }}
                          </span>
                        </div>
                        <IconLucid name="ChevronRight" size="xs" class="text-gray-400 shrink-0" />
                      </button>
                    </div>
                  </div>
                  <!-- Prestations -->
                  <div>
                    <h2 class="font-heading text-sm text-dark/60 uppercase tracking-wider mb-3">
                      {{ t("dashboard.quote_detail_needs") }}
                    </h2>
                    <!-- Atelier: workshop type -->
                    <template v-if="quote.service_type === 'atelier'">
                      <div v-if="quote.workshop_type" class="flex items-center gap-2">
                        <IconLucid name="Palette" size="xs" class="text-gray-400" />
                        <span class="text-sm text-dark/80">{{ t(`quote_form.workshop_${quote.workshop_type}`) }}</span>
                      </div>
                      <p v-else class="text-sm text-dark/40">{{ t("dashboard.quote_detail_no_needs") }}</p>
                    </template>
                    <!-- Mariage / Evenement: floral/event needs -->
                    <template v-else>
                      <div v-if="quote.floral_needs?.length">
                        <div v-if="quote.service_type === 'mariage'" class="flex items-center gap-2 mb-2">
                          <IconLucid name="Heart" size="xs" class="text-gray-400" />
                          <span class="font-heading text-xs text-dark/50 uppercase tracking-wider">
                            {{ t("dashboard.quote_detail_personal_flowers") }}
                          </span>
                        </div>
                        <ul class="space-y-1 pl-1">
                          <li v-for="need in quote.floral_needs" :key="need" class="flex items-center gap-2 text-sm text-dark/80">
                            <span class="w-1.5 h-1.5 rounded-full bg-dark/30 shrink-0"></span>
                            {{ t(`quote_form.need_${need}`) }}
                          </li>
                        </ul>
                      </div>
                      <p v-else class="text-sm text-dark/40">{{ t("dashboard.quote_detail_no_needs") }}</p>
                    </template>
                  </div>
                </div>
                <!-- Right column: Coordonnées + Inspirations -->
                <div class="flex-1 min-w-0 space-y-6">
                  <!-- Coordonnées -->
                  <div>
                    <h2 class="font-heading text-sm text-dark/60 uppercase tracking-wider mb-3">
                      {{ t("dashboard.quote_detail_contact") }}
                    </h2>
                    <div class="space-y-2.5">
                      <div class="flex items-center gap-3 px-3">
                        <div class="w-7 h-7 rounded-full bg-cream flex items-center justify-center shrink-0">
                          <IconLucid name="Mail" size="xs" class="text-gray-400" />
                        </div>
                        <a :href="`mailto:${quote.email}`" class="text-sm text-dark underline truncate">{{ quote.email }}</a>
                      </div>
                      <div class="flex items-center gap-3 px-3">
                        <div class="w-7 h-7 rounded-full bg-cream flex items-center justify-center shrink-0">
                          <IconLucid name="Phone" size="xs" class="text-gray-400" />
                        </div>
                        <span v-if="quote.phone">
                          <a :href="`tel:${quote.phone}`" class="text-sm text-dark underline">{{ quote.phone }}</a>
                        </span>
                        <span v-else class="text-sm text-dark/40">{{ t("dashboard.quote_detail_no_phone") }}</span>
                      </div>
                      <!-- Date -->
                      <div class="flex items-center gap-3 px-3">
                        <div class="w-7 h-7 rounded-full bg-cream flex items-center justify-center shrink-0">
                          <IconLucid :name="quote.service_type === 'mariage' ? 'Heart' : 'Calendar'" size="xs" class="text-gray-400" />
                        </div>
                        <span class="text-sm text-dark">{{ quote.wedding_date ? formatDate(quote.wedding_date) : t("dashboard.quote_detail_no_date") }}</span>
                      </div>
                      <!-- Venue (mariage/evenement) -->
                      <div v-if="quote.service_type !== 'atelier'" class="flex items-center gap-3 px-3">
                        <div class="w-7 h-7 rounded-full bg-cream flex items-center justify-center shrink-0">
                          <IconLucid name="MapPin" size="xs" class="text-gray-400" />
                        </div>
                        <span class="text-sm text-dark">{{ quote.venue || t("dashboard.quote_detail_no_venue") }}</span>
                      </div>
                      <!-- Event type (evenement) -->
                      <div v-if="quote.service_type === 'evenement' && quote.event_type" class="flex items-center gap-3 px-3">
                        <div class="w-7 h-7 rounded-full bg-cream flex items-center justify-center shrink-0">
                          <IconLucid name="Sparkles" size="xs" class="text-gray-400" />
                        </div>
                        <span class="text-sm text-dark">{{ quote.event_type }}</span>
                      </div>
                      <!-- Guest count (atelier) -->
                      <div v-if="quote.service_type === 'atelier' && quote.guest_count" class="flex items-center gap-3 px-3">
                        <div class="w-7 h-7 rounded-full bg-cream flex items-center justify-center shrink-0">
                          <IconLucid name="Users" size="xs" class="text-gray-400" />
                        </div>
                        <span class="text-sm text-dark">{{ quote.guest_count }} {{ t("dashboard.quote_detail_guest_count").toLowerCase() }}</span>
                      </div>
                      <!-- Budget (mariage only) -->
                      <div v-if="quote.service_type === 'mariage'" class="flex items-center gap-3 px-3">
                        <div class="w-7 h-7 rounded-full bg-cream flex items-center justify-center shrink-0">
                          <IconLucid name="BadgeEuro" size="xs" class="text-gray-400" />
                        </div>
                        <span class="text-sm text-dark">{{ quote.budget ? t(`quote_form.budget_${quote.budget}`) : t("dashboard.quote_detail_no_budget") }}</span>
                      </div>
                    </div>
                  </div>
                  <!-- Inspirations du couple -->
                  <div>
                    <div class="flex items-center justify-between mb-3">
                      <h2 class="font-heading text-sm text-dark/60 uppercase tracking-wider">
                        {{ t(quote.service_type === 'mariage' ? "dashboard.client_inspirations_title" : "dashboard.client_inspirations_title_generic") }}
                      </h2>
                      <span v-if="clientInspirations.length > 0" class="w-6 h-6 rounded-full bg-green-100 text-green-600 text-xs font-bold flex items-center justify-center">
                        {{ clientInspirations.length }}
                      </span>
                    </div>
                    <div v-if="clientInspirations.length > 0" class="grid grid-cols-3 gap-2">
                      <button
                        v-for="(item, idx) in clientInspirations.slice(0, 3)"
                        :key="item.id"
                        @click="copilotGalleryOpen = true"
                        class="relative rounded-xl overflow-hidden aspect-square hover:ring-2 hover:ring-fuchsia-300 transition-all"
                      >
                        <img :src="item.public_url" :alt="item.caption || item.original_filename" class="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                        <div v-if="idx === 2 && clientInspirations.length > 3" class="absolute inset-0 bg-dark/40 flex items-center justify-center">
                          <span class="text-white text-lg font-semibold">+{{ clientInspirations.length - 3 }}</span>
                        </div>
                      </button>
                    </div>
                    <p v-else class="text-sm text-dark/40">{{ t("dashboard.quote_detail_no_inspirations") }}</p>
                  </div>
                </div>
              </div>

              </div>

              <!-- Moodboard + Devis -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
              <!-- Moodboard section -->
              <div class="rounded-xl border-2 border-dark/10 p-4 flex flex-col">
                <div class="flex items-center justify-between mb-3">
                  <h3 class="font-heading text-sm text-dark/60 uppercase tracking-wider">
                    Moodboard
                  </h3>
                  <button
                    @click="triggerMoodboardUpload"
                    :disabled="uploadingMoodboard"
                    class="text-sm text-gray-500 hover:text-dark flex items-center gap-1 transition-colors disabled:opacity-50"
                  >
                    <IconLucid
                      :name="uploadingMoodboard ? 'Loader2' : 'Plus'"
                      size="xs"
                      :class="uploadingMoodboard ? 'animate-spin' : ''"
                    />
                    {{ $t("dashboard.moodboard_add_file") }}
                  </button>
                </div>
                <input
                  ref="moodboardFileInput"
                  type="file"
                  accept="image/png,image/jpeg,image/webp,application/pdf"
                  class="hidden"
                  @change="handleMoodboardFileChange"
                />
                <!-- En préparation seulement : une version envoyée vit dans
                     la timeline, figée. -->
                <div v-if="draftMoodboardItems.length > 0" class="space-y-2 mb-3">
                  <div
                    v-for="item in draftMoodboardItems"
                    :key="item.id"
                    class="flex items-center gap-2.5 px-3 py-2 rounded-lg border bg-cream/50 border-transparent"
                  >
                    <div class="w-6 h-6 rounded-md overflow-hidden bg-cream shrink-0">
                      <img
                        v-if="item.item_type === 'image'"
                        :src="item.public_url"
                        :alt="item.original_filename"
                        class="w-full h-full object-cover"
                      />
                      <div v-else class="w-full h-full flex items-center justify-center">
                        <IconLucid name="FileText" size="xs" class="text-gray-500" />
                      </div>
                    </div>
                    <span class="flex-1 min-w-0">
                      <span class="text-sm text-dark/80 truncate block">
                        {{ item.original_filename || item.title }}
                      </span>
                    </span>
                    <!-- Menu « ⋯ » : ouvrir le menu puis « Supprimer » vaut
                         confirmation, comme pour les notes de la timeline -->
                    <div class="relative shrink-0" data-file-menu>
                      <button
                        type="button"
                        :aria-label="t('common.more_actions')"
                        @click="fileMenuOpen = fileMenuOpen === `mb-${item.id}` ? null : `mb-${item.id}`"
                        class="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-cream transition-all"
                      >
                        <IconLucid name="MoreHorizontal" size="xs" />
                      </button>
                      <div
                        v-if="fileMenuOpen === `mb-${item.id}`"
                        class="absolute right-0 top-8 bg-white rounded-xl shadow-lg border border-dark/10 py-1 z-10 min-w-[120px]"
                      >
                        <button
                          type="button"
                          @click="handleMoodboardDelete(item.id)"
                          class="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-cream transition-colors"
                        >
                          {{ t("common.delete") }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <p v-else class="text-sm text-dark/40 mb-3">
                  {{
                    moodboardVersions.length
                      ? $t("dashboard.moodboard_new_version_hint")
                      : $t("dashboard.moodboard_empty")
                  }}
                </p>
                <!-- Send moodboard button -->
                <button
                  @click="handleSendMoodboard"
                  :disabled="draftMoodboardItems.length === 0 || sendingMoodboard"
                  class="mt-auto w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 bg-dark text-cream hover:bg-dark/80"
                >
                  <IconLucid
                    :name="sendingMoodboard ? 'Loader2' : 'Send'"
                    size="xs"
                    :class="sendingMoodboard ? 'animate-spin' : ''"
                  />
                  {{
                    moodboardVersions.length
                      ? $t("dashboard.send_version", {
                          version: moodboardVersions.length + 1,
                        })
                      : $t("dashboard.moodboard_send")
                  }}
                </button>
              </div>

              <!-- Devis section -->
              <div class="rounded-xl border-2 border-dark/10 p-4 flex flex-col">
                <div class="flex items-center justify-between mb-3">
                  <h3 class="font-heading text-sm text-dark/60 uppercase tracking-wider">
                    {{ $t("dashboard.proposal_title") }}
                  </h3>
                  <button
                    @click="triggerProposalUpload"
                    :disabled="uploadingProposal"
                    class="text-sm text-gray-500 hover:text-dark flex items-center gap-1 transition-colors disabled:opacity-50"
                  >
                    <IconLucid
                      :name="uploadingProposal ? 'Loader2' : 'Plus'"
                      size="xs"
                      :class="uploadingProposal ? 'animate-spin' : ''"
                    />
                    {{ $t("dashboard.proposal_add_file") }}
                  </button>
                </div>
                <input
                  ref="proposalFileInput"
                  type="file"
                  accept="application/pdf"
                  class="hidden"
                  @change="handleProposalFileChange"
                />
                <!-- En préparation seulement : un devis envoyé vit dans la
                     timeline, figé (il ne se supprime plus). -->
                <div v-if="draftProposals.length > 0" class="space-y-2 mb-3">
                  <div
                    v-for="prop in draftProposals"
                    :key="prop.id"
                    class="flex items-center gap-2.5 px-3 py-2 rounded-lg border bg-cream/50 border-transparent"
                  >
                    <div class="w-6 h-6 rounded-md bg-cream flex items-center justify-center shrink-0">
                      <IconLucid name="FileText" size="xs" class="text-gray-500" />
                    </div>
                    <span class="flex-1 min-w-0">
                      <span class="text-sm text-dark/80 truncate block">
                        {{ prop.original_filename || prop.title }}
                      </span>
                      <span class="text-xs block text-dark/40">
                        {{ $t("dashboard.file_draft") }}
                      </span>
                    </span>
                    <!-- Menu « ⋯ » : ouvrir le menu puis « Supprimer » vaut
                         confirmation, comme pour les notes de la timeline -->
                    <div class="relative shrink-0" data-file-menu>
                      <button
                        type="button"
                        :aria-label="t('common.more_actions')"
                        @click="fileMenuOpen = fileMenuOpen === `prop-${prop.id}` ? null : `prop-${prop.id}`"
                        class="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-cream transition-all"
                      >
                        <IconLucid name="MoreHorizontal" size="xs" />
                      </button>
                      <div
                        v-if="fileMenuOpen === `prop-${prop.id}`"
                        class="absolute right-0 top-8 bg-white rounded-xl shadow-lg border border-dark/10 py-1 z-10 min-w-[120px]"
                      >
                        <button
                          type="button"
                          @click="handleDeleteProposal(prop.id)"
                          class="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-cream transition-colors"
                        >
                          {{ t("common.delete") }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <p v-else class="text-sm text-dark/40 mb-3">
                  {{
                    sentProposals.length
                      ? $t("dashboard.proposal_new_version_hint")
                      : $t("dashboard.proposal_empty")
                  }}
                </p>
                <!-- Send proposal button -->
                <button
                  @click="handleSendProposal"
                  :disabled="draftProposals.length === 0 || sendingProposal"
                  class="mt-auto w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 bg-dark text-cream hover:bg-dark/80"
                >
                  <IconLucid
                    :name="sendingProposal ? 'Loader2' : 'Send'"
                    size="xs"
                    :class="sendingProposal ? 'animate-spin' : ''"
                  />
                  {{
                    sentProposals.length
                      ? $t("dashboard.send_version", {
                          version: sentProposals.length + 1,
                        })
                      : $t("dashboard.proposal_send")
                  }}
                </button>
              </div>

              <!-- Note interne : même design que Moodboard et Devis -->
              <div class="rounded-xl border-2 border-dark/10 p-4 flex flex-col">
                <div class="flex items-center justify-between mb-3">
                  <h3 class="font-heading text-sm text-dark/60 uppercase tracking-wider">
                    {{ $t("dashboard.internal_note_title") }}
                  </h3>
                </div>
                <p class="flex items-start gap-2 text-sm text-dark/40 mb-3">
                  <IconLucid name="EyeOff" size="xs" class="text-gray-400 shrink-0 mt-0.5" />
                  {{ $t("dashboard.internal_note_hint") }}
                </p>
                <p
                  v-if="noteSaved"
                  class="flex items-center gap-2 text-sm text-green-600 mb-3"
                  role="status"
                >
                  <IconLucid name="Check" size="xs" class="text-green-600" />
                  {{ $t("dashboard.note_saved") }}
                </p>
                <button
                  @click="showNotePanel = true"
                  class="mt-auto w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all bg-dark text-cream hover:bg-dark/80"
                >
                  <IconLucid name="NotebookPen" size="xs" />
                  {{ $t("dashboard.timeline_note_label") }}
                </button>
              </div>
              </div>


              <!-- Metadata footer -->
              <div
                class="flex flex-wrap gap-x-6 gap-y-1 text-xs text-dark/45 px-2 mt-4"
              >
                <span>
                  {{
                    t("dashboard.quote_detail_created")
                  }}:
                  {{ formatDateTime(quote.created_at) }}
                </span>
                <span>
                  {{
                    t("dashboard.quote_detail_updated")
                  }}:
                  {{ formatDateTime(quote.updated_at) }}
                </span>
                <span>
                  {{
                    t("dashboard.quote_detail_locale")
                  }}:
                  {{ quote.locale }}
                </span>
              </div>
              </div>

              <!-- RIGHT: Timeline -->
              <div
                class="w-full xl:w-80 shrink-0 flex flex-col xl:h-[calc(100vh-10rem)]"
              >
                <h2
                  class="font-heading text-sm text-dark/80 uppercase tracking-wider mb-4"
                >
                  {{ t("dashboard.timeline_title") }}
                </h2>

                <!-- Loading -->
                <div
                  v-if="loadingActivity"
                  class="py-8 text-center"
                >
                  <IconLucid
                    name="Loader2"
                    size="md"
                    class="animate-spin mx-auto text-gray-500"
                  />
                </div>

                <!-- Feed + Compose wrapper -->
                <div
                  v-if="!loadingActivity"
                  class="flex-1 min-h-0 relative"
                >
                <div
                  ref="timelineScroll"
                  class="h-full overflow-y-auto space-y-3 pb-4"
                >
                  <!-- Empty -->
                  <div
                    v-if="timelineItems.length === 0"
                    class="py-8 text-center"
                  >
                    <IconLucid
                      name="Clock"
                      size="lg"
                      class="mx-auto text-gray-400 mb-3"
                    />
                    <p class="text-dark/50 text-sm">
                      {{ t("dashboard.timeline_empty") }}
                    </p>
                  </div>
                  <!-- Timeline : journal + documents envoyés, par date -->
                  <template
                    v-for="item in timelineItems"
                    :key="item.key"
                  >
                  <div
                    v-if="item.kind === 'activity'"
                    class="px-3 py-2.5 rounded-xl border border-dark/10"
                  >
                    <!-- Note with menu -->
                    <div
                      v-if="item.entry.action === 'note_added'"
                      class="relative"
                    >
                      <div class="flex items-start gap-2.5 pr-8">
                        <div
                          class="w-6 h-6 rounded-lg bg-cream flex items-center justify-center shrink-0 mt-0.5"
                        >
                          <IconLucid
                            name="NotebookPen"
                            size="xs"
                            class="text-gray-500"
                          />
                        </div>
                        <div class="flex-1 min-w-0">
                          <!-- Edit mode -->
                          <div v-if="editingNoteId === item.entry.id">
                            <textarea
                              v-model="editingNoteText"
                              class="w-full text-sm text-dark/80 bg-white rounded-lg px-3 py-2 border-2 border-gray-200 focus:outline-none focus:border-gray-400 resize-none"
                              rows="3"
                            />
                            <div class="flex gap-2 mt-2">
                              <button
                                @click="saveEditNote(item.entry.id)"
                                class="text-xs text-green-600 font-medium"
                              >
                                {{ t("common.save") }}
                              </button>
                              <button
                                @click="editingNoteId = null"
                                class="text-xs text-dark/40"
                              >
                                {{ t("common.cancel") }}
                              </button>
                            </div>
                          </div>
                          <!-- Display mode -->
                          <div v-else>
                            <p class="text-sm text-dark/80 leading-snug whitespace-pre-line">
                              {{ item.entry.details?.text }}
                            </p>
                            <p class="text-[11px] text-dark/40 mt-1">
                              {{ formatRelativeDate(item.entry.created_at) }}
                            </p>
                          </div>
                        </div>
                      </div>
                      <!-- Menu button -->
                      <div class="absolute top-0 right-0" data-file-menu>
                        <button
                          @click="
                            noteMenuOpen === item.entry.id
                              ? (noteMenuOpen = null)
                              : (noteMenuOpen = item.entry.id)
                          "
                          class="w-7 h-7 rounded-full flex items-center justify-center text-gray-300 hover:text-gray-500 hover:bg-cream transition-all"
                        >
                          <IconLucid
                            name="MoreHorizontal"
                            size="xs"
                          />
                        </button>
                        <!-- Dropdown -->
                        <div
                          v-if="noteMenuOpen === item.entry.id"
                          class="absolute right-0 top-8 bg-white rounded-xl shadow-lg border border-dark/10 py-1 z-10 min-w-[120px]"
                        >
                          <button
                            @click="startEditNote(item.entry)"
                            class="w-full text-left px-4 py-2 text-sm text-dark/70 hover:bg-cream transition-colors"
                          >
                            {{ t("common.edit") }}
                          </button>
                          <!-- Pas de second clic : ouvrir le menu puis
                               choisir « Supprimer » vaut confirmation -->
                          <button
                            @click="deleteActivity(item.entry.id)"
                            class="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-cream transition-colors"
                          >
                            {{ t("common.delete") }}
                          </button>
                        </div>
                      </div>
                    </div>

                    <!-- Other activity types -->
                    <div
                      v-else
                      class="flex items-start gap-2.5"
                    >
                      <div
                        class="w-6 h-6 rounded-lg bg-cream flex items-center justify-center shrink-0 mt-0.5"
                      >
                        <IconLucid
                          :name="activityIcon(item.entry.action)"
                          size="xs"
                          class="text-gray-500"
                        />
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-sm text-dark/80 leading-tight">
                          {{ activityLabel(item.entry) }}
                        </p>
                        <!-- Message « Écrire à Laëtitia » de la cliente -->
                        <p
                          v-if="
                            item.entry.action === 'client_message' &&
                            item.entry.details?.text
                          "
                          class="text-xs text-dark bg-cream rounded-lg px-2.5 py-2 mt-1.5 whitespace-pre-line"
                        >
                          « {{ item.entry.details.text }} »
                        </p>
                        <p class="text-[11px] text-dark/40 mt-0.5">
                          {{ formatRelativeDate(item.entry.created_at) }}
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Devis envoyé : figé, avec la réponse de la cliente -->
                  <div
                    v-else-if="item.kind === 'proposal'"
                    class="px-3 py-2.5 rounded-xl border"
                    :class="
                      item.proposal.superseded_at
                        ? 'border-dark/10 bg-gray-50'
                        : 'border-dark/20'
                    "
                  >
                    <div class="flex items-start gap-2.5">
                      <div
                        class="w-6 h-6 rounded-lg bg-cream flex items-center justify-center shrink-0 mt-0.5"
                      >
                        <IconLucid name="FileText" size="xs" class="text-gray-500" />
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-sm text-dark leading-tight">
                          {{
                            t("dashboard.timeline_proposal_sent", {
                              version: item.proposal.version || 1,
                            })
                          }}
                        </p>
                        <a
                          v-if="item.proposal.public_url"
                          :href="item.proposal.public_url"
                          target="_blank"
                          rel="noopener"
                          class="text-sm text-dark underline truncate block mt-1"
                        >
                          {{ item.proposal.original_filename || item.proposal.title }}
                        </a>
                        <p
                          v-if="item.proposal.superseded_at"
                          class="text-xs text-gray-500 mt-1"
                        >
                          {{ t("dashboard.timeline_superseded") }}
                        </p>
                        <p
                          v-else
                          class="text-xs mt-1"
                          :class="
                            proposalState(item.proposal).green
                              ? 'text-green-700'
                              : 'text-gray-600'
                          "
                        >
                          {{ proposalState(item.proposal).label }}
                        </p>
                        <!-- Ancien message unique, d'avant l'historique : les
                             nouveaux apparaissent chacun dans la timeline -->
                        <p
                          v-if="
                            item.proposal.client_comment &&
                            !proposalsWithMessages.has(item.proposal.id)
                          "
                          class="text-xs text-dark bg-cream rounded-lg px-2.5 py-2 mt-1.5"
                        >
                          « {{ item.proposal.client_comment }} »
                        </p>
                        <p class="text-[11px] text-dark/40 mt-1">
                          {{ formatRelativeDate(item.date) }}
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Version de moodboard envoyée : figée -->
                  <div
                    v-else-if="item.kind === 'moodboard'"
                    class="px-3 py-2.5 rounded-xl border"
                    :class="
                      item.superseded
                        ? 'border-dark/10 bg-gray-50'
                        : 'border-dark/20'
                    "
                  >
                    <div class="flex items-start gap-2.5">
                      <div
                        class="w-6 h-6 rounded-lg bg-cream flex items-center justify-center shrink-0 mt-0.5"
                      >
                        <IconLucid name="Palette" size="xs" class="text-gray-500" />
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-sm text-dark leading-tight">
                          {{
                            t("dashboard.timeline_moodboard_sent", {
                              version: item.version,
                              count: item.items.length,
                            })
                          }}
                        </p>
                        <div class="flex gap-1.5 mt-1.5">
                          <div
                            v-for="mi in item.items.slice(0, 4)"
                            :key="mi.id"
                            class="w-10 h-10 rounded-md overflow-hidden bg-cream flex items-center justify-center"
                          >
                            <img
                              v-if="mi.item_type === 'image'"
                              :src="mi.public_url"
                              :alt="mi.original_filename"
                              class="w-full h-full object-cover"
                            />
                            <IconLucid v-else name="FileText" size="xs" class="text-gray-500" />
                          </div>
                        </div>
                        <p
                          v-if="item.superseded"
                          class="text-xs text-gray-500 mt-1"
                        >
                          {{ t("dashboard.timeline_superseded") }}
                        </p>
                        <p class="text-[11px] text-dark/40 mt-1">
                          {{ formatRelativeDate(item.date) }}
                        </p>
                      </div>
                    </div>
                  </div>
                  </template>

                </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </section>

    <!-- Copilot inspiration gallery (masonry) -->
    <BaseModal
      :isOpen="copilotGalleryOpen"
      :title="t('dashboard.client_inspirations_title')"
      :showCloseButton="true"
      :closeButtonText="t('common.close')"
      @close="copilotGalleryOpen = false"
    >
      <div
        v-if="clientInspirations.length > 0"
        class="columns-2 gap-3"
      >
        <div
          v-for="item in clientInspirations"
          :key="item.id"
          class="mb-3 break-inside-avoid"
        >
          <img
            :src="item.public_url"
            :alt="item.caption || item.original_filename"
            class="w-full rounded-xl"
            loading="lazy"
          />
          <p
            v-if="item.caption"
            class="text-xs text-dark/50 mt-1 px-1"
          >
            {{ item.caption }}
          </p>
        </div>
      </div>
    </BaseModal>

    <!-- Note panel modal -->
    <BaseModal
      :isOpen="showNotePanel"
      :title="t('dashboard.timeline_note_label')"
      :showCloseButton="false"
      showCloseIcon
      @close="closeNotePanel"
    >
      <!-- Comme une page de traitement de texte : pas de cadre, le champ
           occupe l'espace et la ligne reste à une largeur de lecture. -->
      <div class="max-w-2xl mx-auto">
        <textarea
          v-model="newNoteText"
          :placeholder="t('dashboard.timeline_note_placeholder')"
          :aria-label="t('dashboard.timeline_note_label')"
          class="w-full min-h-[50vh] p-0 border-0 bg-transparent
            focus:outline-none resize-none text-lg leading-relaxed text-dark
            placeholder:text-gray-400"
          autofocus
        />
        <!-- La note s'enregistre pendant la frappe ; « Terminé » (ou la
             croix, Échap…) ferme la page. -->
        <div
          class="mt-4 pt-4 border-t border-gray-200 flex flex-col gap-4
            sm:flex-row sm:items-center sm:justify-between"
        >
          <p
            v-if="noteError"
            class="text-sm text-red-600"
            role="alert"
          >
            {{ t("dashboard.note_save_error") }}
          </p>
          <p
            v-else
            class="flex items-center gap-2 text-sm text-gray-500"
            aria-live="polite"
          >
            <IconLucid
              :name="noteStatus === 'saving' ? 'Loader2' : 'Check'"
              size="xs"
              class="text-gray-500"
              :class="{ 'animate-spin': noteStatus === 'saving' }"
            />
            {{ t(`dashboard.note_status_${noteStatus}`) }}
          </p>
          <Button
            type="button"
            variant="primary"
            icon="Check"
            class="w-full sm:w-auto justify-center shrink-0"
            :loading="sendingNote"
            @click="closeNotePanel"
          >
            {{ t("dashboard.note_done") }}
          </Button>
        </div>
      </div>
    </BaseModal>

    <!-- Status modal -->
    <BaseModal
      :isOpen="statusModalOpen"
      :title="t('dashboard.quote_detail_status')"
      :showCloseButton="true"
      :closeButtonText="t('common.close')"
      @close="statusModalOpen = false"
    >
      <div class="space-y-2">
        <button
          v-for="opt in statusOptions"
          :key="opt.value"
          class="flex items-center gap-4 w-full px-4 py-3.5 rounded-2xl border-2 transition-all text-left disabled:opacity-40 disabled:cursor-not-allowed"
          :disabled="isStatusDisabled(opt.value)"
          :class="
            quote?.status === opt.value
              ? 'bg-dark text-cream border-dark'
              : isStatusDisabled(opt.value)
                ? 'bg-white border-dark/10'
                : 'bg-white border-dark/10 hover:border-dark/30'
          "
          @click="selectStatus(opt.value)"
        >
          <div
            class="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
            :class="
              quote?.status === opt.value
                ? 'bg-cream/20'
                : 'bg-cream'
            "
          >
            <IconLucid
              :name="statusIcon(opt.value)"
              size="xs"
              :class="
                quote?.status === opt.value
                  ? 'text-cream'
                  : 'text-gray-400'
              "
            />
          </div>
          <div class="flex-1 min-w-0">
            <span class="font-medium text-sm block">
              {{ opt.label }}
            </span>
            <span
              class="text-xs"
              :class="
                quote?.status === opt.value
                  ? 'text-cream/60'
                  : 'text-dark/40'
              "
            >
              {{ t(`dashboard.quote_status_desc_${opt.value}`) }}
            </span>
          </div>
          <IconLucid
            v-if="quote?.status === opt.value"
            name="Check"
            size="xs"
            class="text-cream shrink-0"
          />
        </button>
      </div>
    </BaseModal>

    <!-- Schedule modal -->
    <ScheduleModal
      :isOpen="scheduleModalOpen"
      @close="scheduleModalOpen = false"
      @confirmed="handleMeetingConfirmed"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { useI18n } from "vue-i18n";
import { useEventListener } from "@vueuse/core";
import type {
  QuoteRequest,
  QuoteRequestStatus,
  QuoteActivityLog,
} from "~/server/utils/quotes-types";
import type {
  ClientInspiration,
  MoodboardItem,
  ProjectProposal,
} from "~/server/utils/client-portal-types";

definePageMeta({
  ssr: false,
  layout: "dashboard",
  middleware: ["auth-admin"],
});

const { t } = useI18n();
const localePath = useLocalePath();
const route = useRoute();
const { adminFetch } = useAdminFetch();
const { compress } = useImageCompression();

const quoteId = route.params.id as string;
const pageTitle = useState<string | null>("dashboard-page-title", () => null);

// State
const quote = ref<QuoteRequest | null>(null);
const adminNotes = ref("");
const savingNotes = ref(false);

// Portal state
const portalEnabled = ref(true);
const sendingInvite = ref(false);
const inviteSent = ref(false);
const moodboardItems = ref<MoodboardItem[]>([]);
const moodboardNote = ref("");
const savingMoodboardNote = ref(false);
const uploadingMoodboard = ref(false);
const addingMoodboardLink = ref(false);
const clientInspirations = ref<ClientInspiration[]>([]);
const loadingInspirations = ref(false);
const proposals = ref<ProjectProposal[]>([]);
const loadingProposals = ref(false);
const creatingProposal = ref(false);

// Activity log
const activityLog = ref<QuoteActivityLog[]>([]);
const loadingActivity = ref(false);

// Timeline compose
const moodboardFileInput = ref<HTMLInputElement | null>(null);
const proposalFileInput = ref<HTMLInputElement | null>(null);
const uploadingProposal = ref(false);
const sendingMoodboard = ref(false);
const sendingProposal = ref(false);

// ── Préparation vs envoyé ─────────────────────────────────────────────
// Les blocs Moodboard et Devis ne montrent que ce qui est en préparation ;
// ce qui est envoyé est figé et vit dans la timeline, version par version.
const draftMoodboardItems = computed(() =>
  moodboardItems.value.filter((i) => !i.sent_at)
);
const draftProposals = computed(() =>
  proposals.value.filter((p) => !p.sent_at)
);
const sentProposals = computed(() =>
  proposals.value.filter((p) => p.sent_at)
);

const moodboardVersions = computed(() => {
  const byVersion = new Map<number, MoodboardItem[]>();
  for (const item of moodboardItems.value) {
    if (!item.sent_at) continue;
    const v = item.version || 1;
    byVersion.set(v, [...(byVersion.get(v) || []), item]);
  }
  return [...byVersion.entries()]
    .sort(([a], [b]) => a - b)
    .map(([version, items]) => ({
      version,
      items,
      sentAt: items[0].sent_at as string,
    }));
});

type TimelineItem =
  | { kind: "activity"; key: string; date: string; entry: QuoteActivityLog }
  | { kind: "proposal"; key: string; date: string; proposal: ProjectProposal }
  | {
      kind: "moodboard";
      key: string;
      date: string;
      version: number;
      items: MoodboardItem[];
      superseded: boolean;
    };

const timelineItems = computed<TimelineItem[]>(() => {
  const proposalTimes = sentProposals.value.map((p) =>
    new Date(p.sent_at as string).getTime()
  );
  const hasMoodboardVersion = moodboardVersions.value.length > 0;

  const activities = activityLog.value
    .filter((entry) => {
      // Doublons des cartes documents : le passage en "Devis envoyé" fait
      // au même moment qu'un envoi de devis, et les anciennes entrées
      // "moodboard envoyé" (avant les versions).
      if (
        entry.action === "status_changed" &&
        entry.details?.to === "quote_sent"
      ) {
        const at = new Date(entry.created_at).getTime();
        if (proposalTimes.some((t) => Math.abs(t - at) < 5 * 60_000)) {
          return false;
        }
      }
      if ((entry.action as string) === "moodboard_sent" && hasMoodboardVersion) {
        return false;
      }
      return true;
    })
    .map(
      (entry): TimelineItem => ({
        kind: "activity",
        key: `a-${entry.id}`,
        date: entry.created_at,
        entry,
      })
    );

  const documents: TimelineItem[] = [
    ...sentProposals.value.map(
      (proposal): TimelineItem => ({
        kind: "proposal",
        key: `p-${proposal.id}`,
        date: proposal.sent_at as string,
        proposal,
      })
    ),
    ...moodboardVersions.value.map(
      (v, i, all): TimelineItem => ({
        kind: "moodboard",
        key: `m-${v.version}`,
        date: v.sentAt,
        version: v.version,
        items: v.items,
        superseded: i < all.length - 1,
      })
    ),
  ];

  // Plus récent en haut, comme le journal.
  return [...activities, ...documents].sort((a, b) =>
    b.date.localeCompare(a.date)
  );
});

const showNotePanel = ref(false);
const newNoteText = ref("");
const sendingNote = ref(false);
const noteMenuOpen = ref<string | null>(null);
const editingNoteId = ref<string | null>(null);
const editingNoteText = ref("");
const timelineScroll = ref<HTMLElement | null>(null);

// Gallery
const copilotGalleryOpen = ref(false);

const activeSection = ref("copilot");
const statusModalOpen = ref(false);
const scheduleModalOpen = ref(false);

// Copilot
const user = useSupabaseUser();
const copilotGreeting = computed(() => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return t("dashboard.greeting_morning");
  if (hour >= 12 && hour < 18) return t("dashboard.greeting_afternoon");
  return t("dashboard.greeting_evening");
});
const copilotName = computed(() => {
  if (!user.value?.email) return "";
  const part = user.value.email.split("@")[0];
  return part.charAt(0).toUpperCase() + part.slice(1);
});

const openCalendarEvent = () => {
  const q = quote.value;
  if (!q?.meeting_date) return;
  const date = q.meeting_date.replace(/-/g, "");
  const raw = (q.meeting_time || "10h00").replace(/[h:]/g, "");
  const hh = raw.slice(0, 2);
  const mm = raw.slice(2, 4) || "00";
  const startTime = `${date}T${hh}${mm}00`;
  const endHH = String(
    Math.min(parseInt(hh) + 1, 23)
  ).padStart(2, "0");
  const endTime = `${date}T${endHH}${mm}00`;
  const clientName = q.partner2_name
    ? `${q.partner1_name} & ${q.partner2_name}`
    : q.partner1_name;
  const title = `RDV ${clientName} — Boticia`;
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Boticia//FR",
    "BEGIN:VEVENT",
    `DTSTART:${startTime}`,
    `DTEND:${endTime}`,
    `SUMMARY:${title}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const blob = new Blob([ics], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

// Rendez-vous passé = date + heure du créneau dépassées (heure locale).
// Sans heure lisible, on attend la fin de la journée.
const isMeetingPast = computed(() => {
  if (!quote.value?.meeting_date) return false;
  const [y, m, d] = quote.value.meeting_date.split("-").map(Number);
  const time = quote.value.meeting_time?.match(/(\d{1,2})\s*[h:]\s*(\d{2})?/);
  const meeting = time
    ? new Date(y, m - 1, d, Number(time[1]), Number(time[2] || 0))
    : new Date(y, m - 1, d, 23, 59);
  return meeting.getTime() < Date.now();
});

const daysToWedding = computed(() => {
  if (!quote.value?.wedding_date) return null;
  const now = new Date();
  const wedding = new Date(quote.value.wedding_date);
  const days = Math.ceil(
    (wedding.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  return days > 0 ? days : null;
});

const statusDotColor = (status: string) => {
  const map: Record<string, string> = {
    new: "bg-yellow-500",
    contacted: "bg-blue-500",
    quote_sent: "bg-gray-500",
    signed: "bg-green-500",
    completed: "bg-green-700",
    cancelled: "bg-red-500",
  };
  return map[status] || "bg-gray-500";
};

const copilotInsight = computed(() => {
  const q = quote.value;
  if (!q)
    return { message: "", actions: [] as { label: string; section?: string; action?: string; icon: string }[] };

  const s = q.status;
  const now = new Date();
  const coupleName = q.partner2_name
    ? `${q.partner1_name} & ${q.partner2_name}`
    : q.partner1_name;
  const g = { greeting: copilotGreeting.value, name: copilotName.value, couple: coupleName };
  const meetingDate = q.meeting_date ? new Date(q.meeting_date) : null;
  const weddingDate = q.wedding_date ? new Date(q.wedding_date) : null;
  const daysToWedding = weddingDate
    ? Math.ceil(
        (weddingDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      )
    : null;

  if (s === "new") {
    if (meetingDate) {
      return {
        message: t("dashboard.copilot_new_with_meeting", {
          ...g,
          date: formatDate(q.meeting_date!),
          time: q.meeting_time || "",
        }),
        actions: [
          {
            label: t("dashboard.copilot_action_status"),
            section: "project",
            icon: "Flag",
          },
          {
            label: t("dashboard.copilot_action_moodboard"),
            section: "project",
            icon: "Images",
          },
        ],
      };
    }
    return {
      message: t("dashboard.copilot_new_no_meeting", g),
      actions: [
        {
          label: t("dashboard.copilot_action_schedule"),
          action: "open-schedule",
          icon: "CalendarCheck",
        },
        {
          label: t("dashboard.copilot_action_status"),
          section: "project",
          icon: "Flag",
        },
      ],
    };
  }

  if (s === "contacted") {
    if (!meetingDate) {
      return {
        message: t("dashboard.copilot_contacted_no_meeting", g),
        actions: [
          {
            label: t("dashboard.copilot_action_schedule"),
            action: "open-schedule",
            icon: "CalendarCheck",
          },
        ],
      };
    }
    if (meetingDate > now) {
      return {
        message: t("dashboard.copilot_contacted_meeting_future", {
          ...g,
          date: formatDate(q.meeting_date!),
          time: q.meeting_time || "",
        }),
        actions: [
          {
            label: t("dashboard.copilot_action_moodboard"),
            section: "project",
            icon: "Images",
          },
        ],
      };
    }
    // Le moodboard n'étant plus une étape, c'est sa date d'envoi qui
    // détermine la prochaine action une fois le rendez-vous passé.
    if (q.moodboard_sent_at) {
      return {
        message: t("dashboard.copilot_moodboard_sent", g),
        actions: [
          {
            label: t("dashboard.copilot_action_proposal"),
            section: "project",
            icon: "FileText",
          },
        ],
      };
    }
    return {
      message: t("dashboard.copilot_contacted_meeting_past", g),
      actions: [
        {
          label: t("dashboard.copilot_action_status"),
          section: "project",
          icon: "Flag",
        },
      ],
    };
  }

  if (s === "quote_sent") {
    if (daysToWedding !== null && daysToWedding < 60) {
      return {
        message: t("dashboard.copilot_quote_sent_urgent", {
          ...g,
          days: daysToWedding,
        }),
        actions: [
          {
            label: t("dashboard.copilot_action_status"),
            section: "project",
            icon: "Flag",
          },
        ],
      };
    }
    return {
      message: t("dashboard.copilot_quote_sent", g),
      actions: [],
    };
  }

  if (s === "signed") {
    if (!portalEnabled.value) {
      return {
        message: t("dashboard.copilot_signed_no_portal", g),
        actions: [
          {
            label: t("dashboard.copilot_action_portal"),
            section: "project",
            icon: "Shield",
          },
        ],
      };
    }
    if (moodboardItems.value.length === 0) {
      return {
        message: t("dashboard.copilot_signed_no_moodboard", g),
        actions: [
          {
            label: t("dashboard.copilot_action_moodboard"),
            section: "project",
            icon: "Images",
          },
        ],
      };
    }
    if (proposals.value.length === 0) {
      return {
        message: t("dashboard.copilot_signed_no_proposal", g),
        actions: [
          {
            label: t("dashboard.copilot_action_proposal"),
            section: "project",
            icon: "FileText",
          },
        ],
      };
    }
  }

  if (s === "completed") {
    return {
      message: t("dashboard.copilot_completed", g),
      actions: [],
    };
  }

  if (s === "cancelled") {
    return {
      message: t("dashboard.copilot_cancelled", g),
      actions: [],
    };
  }

  return { message: "", actions: [] };
});

const isUrgent = computed(() => {
  if (!quote.value?.wedding_date) return false;
  const now = new Date();
  const wedding = new Date(quote.value.wedding_date);
  const days = Math.ceil(
    (wedding.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  return days > 0 && days < 30;
});

const handleCopilotAction = (action: { section?: string; action?: string }) => {
  if (action.action === "open-schedule") {
    scheduleModalOpen.value = true;
  } else if (action.section) {
    activeSection.value = action.section;
  }
};

const displayedText = ref("");
const isTyping = ref(true);
let typingInterval: ReturnType<typeof setInterval> | null = null;

watch(
  () => copilotInsight.value.message,
  (fullText) => {
    if (typingInterval) clearInterval(typingInterval);
    // Sans texte, la frappe ne démarre jamais : il faut quand même sortir
    // de l'état "en cours", sinon les boutons restés conditionnés à
    // !isTyping ne s'affichent plus et la page paraît vide.
    if (!fullText) {
      displayedText.value = "";
      isTyping.value = false;
      return;
    }
    displayedText.value = "";
    isTyping.value = true;
    let i = 0;
    typingInterval = setInterval(() => {
      displayedText.value = fullText.slice(0, ++i);
      if (i >= fullText.length) {
        clearInterval(typingInterval!);
        typingInterval = null;
        isTyping.value = false;
      }
    }, 12);
  },
  { immediate: true }
);

const statusIcon = (status: string) => {
  const map: Record<string, string> = {
    new: "Sparkles",
    contacted: "Phone",
    quote_sent: "Send",
    signed: "BadgeCheck",
    completed: "CheckCircle",
    cancelled: "XCircle",
  };
  return map[status] || "Flag";
};

const statusIconBg = (status: string) => {
  const map: Record<string, string> = {
    new: "bg-yellow-500",
    contacted: "bg-blue-500",
    quote_sent: "bg-gray-500",
    signed: "bg-green-500",
    completed: "bg-green-700",
    cancelled: "bg-red-500",
  };
  return map[status] || "bg-gray-500";
};

const selectStatus = (value: string) => {
  if (!quote.value) return;
  quote.value.status = value as QuoteRequestStatus;
  onStatusChange(value);
  statusModalOpen.value = false;
};

/**
 * État d'un devis, tel que la cliente l'a laissé.
 *
 * Le vert est réservé à l'acceptation : c'est le seul état qui mérite
 * d'attirer l'œil. Attention, le portail ne marque comme consulté que le
 * devis le plus récent — un devis antérieur reste donc "pending" même
 * s'il a bien été transmis, d'où le libellé neutre.
 */
const proposalState = (p: {
  status?: string;
  viewed_at?: string;
  responded_at?: string;
}) => {
  const on = (d?: string) => (d ? formatDate(d) : "");
  if (p.status === "accepted") {
    return {
      green: true,
      label: t("dashboard.file_accepted_on", { date: on(p.responded_at) }),
    };
  }
  if (p.status === "revision_requested") {
    return {
      green: false,
      label: t("dashboard.file_revision_on", { date: on(p.responded_at) }),
    };
  }
  if (p.status === "viewed") {
    return {
      green: false,
      label: t("dashboard.file_viewed_on", { date: on(p.viewed_at) }),
    };
  }
  if (p.status === "draft") {
    return { green: false, label: t("dashboard.file_draft") };
  }
  return { green: false, label: t("dashboard.file_awaiting") };
};

// Le pipeline ne se remonte pas : un dossier dont le devis est parti ne
// peut pas redevenir "nouvelle demande". "Annulé" reste toujours
// accessible, dans les deux sens.
const PIPELINE_ORDER = [
  "new",
  "contacted",
  "quote_sent",
  "signed",
  "completed",
];

const isStatusDisabled = (value: string) => {
  const current = quote.value?.status;
  if (!current || current === "cancelled" || value === "cancelled") {
    return false;
  }
  const from = PIPELINE_ORDER.indexOf(current);
  const to = PIPELINE_ORDER.indexOf(value);
  if (from === -1 || to === -1) return false;
  return to < from;
};

const statusOptions = computed(() => [
  { label: t("dashboard.quote_status_new"), value: "new" },
  {
    label: t("dashboard.quote_status_contacted"),
    value: "contacted",
  },
  {
    label: t("dashboard.quote_status_quote_sent"),
    value: "quote_sent",
  },
  { label: t("dashboard.quote_status_signed"), value: "signed" },
  {
    label: t("dashboard.quote_status_completed"),
    value: "completed",
  },
  {
    label: t("dashboard.quote_status_cancelled"),
    value: "cancelled",
  },
]);

// Devis qui ont des messages dans le journal (« Écrire à Laëtitia »)
const proposalsWithMessages = computed(
  () =>
    new Set(
      activityLog.value
        .filter((e) => (e.action as string) === "client_message")
        .map((e) => e.details?.proposal_id as string)
    )
);

// Activity log helpers
const activityIcon = (action: string) => {
  const map: Record<string, string> = {
    status_changed: "Flag",
    note_added: "NotebookPen",
    note_updated: "NotebookPen",
    meeting_scheduled: "CalendarCheck",
    portal_toggled: "UserCheck",
    moodboard_added: "ImagePlus",
    moodboard_removed: "Trash2",
    proposal_created: "FileText",
    client_message: "MessageSquare",
  };
  return map[action] || "Clock";
};

const activityLabel = (entry: QuoteActivityLog) => {
  const d = entry.details || {};
  switch (entry.action) {
    case "status_changed":
      return d.to
        ? t(`dashboard.quote_status_${d.to}`)
        : t("dashboard.activity_status_changed");
    case "meeting_scheduled":
      return d.date
        ? `${t("dashboard.quote_detail_change_meeting")} ${formatDate(d.date)}`
        : t("dashboard.quote_detail_change_meeting");
    case "portal_toggled":
      return d.enabled
        ? t("dashboard.portal_active")
        : t("dashboard.portal_desc_off");
    case "moodboard_added":
      return t("dashboard.moodboard_add_file");
    case "moodboard_removed":
      return d.filename
        ? `${t("dashboard.moodboard_removed")}: ${d.filename}`
        : t("dashboard.moodboard_removed");
    case "proposal_created":
      return d.title || t("dashboard.proposal_created");
    case "note_added":
      return d.text || "";
    case "client_message":
      return d.version
        ? t("dashboard.activity_client_message_version", { version: d.version })
        : t("dashboard.activity_client_message");
    default:
      return entry.action;
  }
};

const formatRelativeDate = (dateStr: string) => {
  const now = new Date();
  const d = new Date(dateStr);
  const diff = now.getTime() - d.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return "Il y a un instant";
  if (mins < 60) return `Il y a ${mins}min`;
  if (hours < 24) return `Il y a ${hours}h`;
  if (days < 7) return `Il y a ${days}j`;
  return formatDate(dateStr);
};

// Fetch activity log
const fetchActivityLog = async () => {
  loadingActivity.value = true;
  try {
    const res = await adminFetch<{
      success: boolean;
      data: QuoteActivityLog[];
    }>(`/api/quotes/${quoteId}/activity`);
    activityLog.value = res.data || [];
  } catch (err) {
    console.error("Error fetching activity log:", err);
  } finally {
    loadingActivity.value = false;
  }
};

// Note interne enregistrée en temps réel : créée dès les premiers mots,
// puis mise à jour pendant la frappe (après une courte pause). Fermer la
// modale termine la note ; la suivante repartira d'une page blanche.
const noteSaved = ref(false);
const noteError = ref(false);
const noteStatus = ref<"idle" | "saving" | "saved">("idle");
const draftNoteId = ref<string | null>(null);
let lastSavedText = "";
let noteSaveTimer: ReturnType<typeof setTimeout> | undefined;
let noteSavedTimer: ReturnType<typeof setTimeout> | undefined;
// Les envois passent l'un après l'autre : jamais deux créations.
let noteSaveChain: Promise<void> = Promise.resolve();

const writeNote = async () => {
  const text = newNoteText.value.trim();
  if (text === lastSavedText) return;
  noteStatus.value = "saving";
  try {
    if (!text && draftNoteId.value) {
      // Texte effacé : la note vide disparaît de la frise.
      await adminFetch(
        `/api/quotes/${quoteId}/activity/${draftNoteId.value}`,
        { method: "DELETE" }
      );
      draftNoteId.value = null;
    } else if (text && !draftNoteId.value) {
      const res = await adminFetch<{ data: { id: string } }>(
        `/api/quotes/${quoteId}/notes`,
        { method: "POST", body: { text } }
      );
      draftNoteId.value = res.data.id;
    } else if (text) {
      await adminFetch(
        `/api/quotes/${quoteId}/activity/${draftNoteId.value}`,
        { method: "PATCH", body: { text } }
      );
    }
    lastSavedText = text;
    noteError.value = false;
    noteStatus.value = "saved";
  } catch (err) {
    console.error("Error saving note:", err);
    noteError.value = true;
    noteStatus.value = "idle";
  }
};

const saveNoteNow = () => {
  clearTimeout(noteSaveTimer);
  noteSaveChain = noteSaveChain.then(writeNote);
  return noteSaveChain;
};

watch(newNoteText, () => {
  if (!showNotePanel.value) return;
  clearTimeout(noteSaveTimer);
  noteSaveTimer = setTimeout(saveNoteNow, 800);
});

// Onglet fermé alors que les derniers mots ne sont pas encore partis :
// on lance l'envoi et le navigateur demande confirmation avant de quitter.
const guardUnsavedNote = (e: BeforeUnloadEvent) => {
  if (newNoteText.value.trim() === lastSavedText) return;
  saveNoteNow();
  e.preventDefault();
};
onMounted(() => window.addEventListener("beforeunload", guardUnsavedNote));
onBeforeUnmount(() =>
  window.removeEventListener("beforeunload", guardUnsavedNote)
);

const closeNotePanel = async () => {
  if (sendingNote.value) return;
  showNotePanel.value = false;
  sendingNote.value = true;
  try {
    await saveNoteNow();
    if (noteError.value) {
      // Dernière version pas enregistrée : on rouvre, texte intact.
      await nextTick();
      showNotePanel.value = true;
      return;
    }
    const hadNote = !!draftNoteId.value;
    draftNoteId.value = null;
    lastSavedText = "";
    newNoteText.value = "";
    noteStatus.value = "idle";
    await fetchActivityLog();
    if (hadNote) {
      noteSaved.value = true;
      clearTimeout(noteSavedTimer);
      noteSavedTimer = setTimeout(() => (noteSaved.value = false), 4000);
    }
  } finally {
    sendingNote.value = false;
  }
};

// Edit note
const startEditNote = (entry: QuoteActivityLog) => {
  editingNoteId.value = entry.id;
  editingNoteText.value = entry.details?.text || "";
  noteMenuOpen.value = null;
};

const saveEditNote = async (id: string) => {
  try {
    await adminFetch(
      `/api/quotes/${quoteId}/activity/${id}`,
      {
        method: "PATCH",
        body: { text: editingNoteText.value.trim() },
      }
    );
    editingNoteId.value = null;
    await fetchActivityLog();
  } catch (err) {
    console.error("Error editing note:", err);
  }
};

// Delete activity
// Suppression en deux temps : le premier clic arme le bouton (rouge,
// « Supprimer ? »), le second supprime. Sans second clic, il se désarme
// au bout de 4 s — une suppression ne part jamais d'un clic distrait.
// Menus « ⋯ » des fichiers en préparation (moodboard, devis)
const fileMenuOpen = ref<string | null>(null);

// Un clic ailleurs referme les menus « ⋯ » (fichiers et notes)
useEventListener(document, "click", (e: MouseEvent) => {
  if (!(e.target as HTMLElement).closest("[data-file-menu]")) {
    fileMenuOpen.value = null;
    noteMenuOpen.value = null;
  }
});

const deleteActivity = async (id: string) => {
  fileMenuOpen.value = null;
  noteMenuOpen.value = null;
  try {
    await adminFetch(
      `/api/quotes/${quoteId}/activity/${id}`,
      { method: "DELETE" }
    );
    activityLog.value = activityLog.value.filter(
      (a) => a.id !== id
    );
  } catch (err) {
    console.error("Error deleting activity:", err);
  }
};

// Moodboard file upload from compose bar
const triggerMoodboardUpload = () => {
  moodboardFileInput.value?.click();
};

const handleMoodboardFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  await handleMoodboardUpload(file);
  input.value = "";
};

// Envoyer le moodboard en préparation : il devient une version figée
// (le serveur envoie l'email à la cliente).
const handleSendMoodboard = async () => {
  if (!quote.value || draftMoodboardItems.value.length === 0) return;
  sendingMoodboard.value = true;
  try {
    const res = await adminFetch<{
      success: boolean;
      data: { version: number; sent_at: string };
    }>(`/api/admin/moodboard/${quoteId}/send`, { method: "POST" });
    quote.value.moodboard_sent_at = res.data.sent_at;
    await fetchPortalData();
    fetchActivityLog();
  } catch (err) {
    console.error("Error sending moodboard:", err);
  } finally {
    sendingMoodboard.value = false;
  }
};

// Envoyer le devis en préparation : il devient une version figée, la
// précédente est marquée remplacée (le serveur gère statut et email).
const handleSendProposal = async () => {
  if (!quote.value || draftProposals.value.length === 0) return;
  sendingProposal.value = true;
  try {
    await adminFetch(`/api/admin/proposals/${quoteId}/send`, {
      method: "POST",
    });
    if (!["quote_sent", "signed", "completed"].includes(quote.value.status)) {
      quote.value.status = "quote_sent" as any;
    }
    await fetchPortalData();
    fetchActivityLog();
  } catch (err) {
    console.error("Error sending proposal:", err);
  } finally {
    sendingProposal.value = false;
  }
};

// Proposal PDF upload from compose bar
const triggerProposalUpload = () => {
  proposalFileInput.value?.click();
};

const handleProposalFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file || !quote.value) return;
  uploadingProposal.value = true;
  try {
    const formData = new FormData();
    formData.append("title", file.name.replace(/\.pdf$/i, ""));
    formData.append("description", "");
    formData.append("file", file);

    const res = await adminFetch<{
      success: boolean;
      data: ProjectProposal;
    }>(`/api/admin/proposals/${quoteId}`, {
      method: "POST",
      body: formData,
    });
    if (res.data) {
      proposals.value.unshift(res.data);
    }
  } catch (err) {
    console.error("Error uploading proposal:", err);
  } finally {
    uploadingProposal.value = false;
    input.value = "";
  }
};

// Fetch quote by ID
const loading = ref(true);
const fetchError = ref(false);

const fetchQuote = async () => {
  loading.value = true;
  fetchError.value = false;
  try {
    const res = await adminFetch<{
      success: boolean;
      data: QuoteRequest;
    }>(`/api/quotes/${quoteId}`);
    quote.value = res.data;
    pageTitle.value = res.data.service_type === "mariage" && res.data.partner2_name
      ? `${res.data.partner1_name} & ${res.data.partner2_name}`
      : res.data.partner1_name;
    adminNotes.value = res.data.admin_notes || "";
    portalEnabled.value = true;
    moodboardNote.value = res.data.moodboard_note || "";
    fetchPortalData();
    fetchActivityLog();
  } catch (err) {
    console.error("Error fetching quote:", err);
    fetchError.value = true;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchQuote();
});

// Update status
const onStatusChange = async (newStatus: string | number) => {
  if (!quote.value) return;
  try {
    const res = await adminFetch<{
      success: boolean;
      data: QuoteRequest;
    }>(`/api/quotes/${quoteId}`, {
      method: "PATCH",
      body: { status: newStatus },
    });
    quote.value = res.data;
  } catch (err) {
    console.error("Error updating status:", err);
  }
};

// Handle meeting confirmed from ScheduleModal
const handleMeetingConfirmed = async (data: {
  date: string;
  time: string;
  displayDate: string;
}) => {
  if (!quote.value) return;
  try {
    const res = await adminFetch<{
      success: boolean;
      data: QuoteRequest;
    }>(`/api/quotes/${quoteId}`, {
      method: "PATCH",
      body: {
        meeting_date: data.date,
        meeting_time: data.time,
      },
    });
    quote.value = res.data;
  } catch (err) {
    console.error("Error updating meeting:", err);
  }
};

// Save notes
const saveNotes = async () => {
  if (!quote.value) return;
  savingNotes.value = true;
  try {
    const res = await adminFetch<{
      success: boolean;
      data: QuoteRequest;
    }>(`/api/quotes/${quoteId}`, {
      method: "PATCH",
      body: { admin_notes: adminNotes.value },
    });
    quote.value = res.data;
  } catch (err) {
    console.error("Error saving notes:", err);
  } finally {
    savingNotes.value = false;
  }
};

// Portal data fetch
const fetchPortalData = async () => {
  loadingInspirations.value = true;
  loadingProposals.value = true;
  moodboardItems.value = [];
  clientInspirations.value = [];
  proposals.value = [];

  try {
    const [moodRes, inspRes, propRes] = await Promise.all([
      adminFetch<{ success: boolean; data: MoodboardItem[] }>(
        `/api/admin/moodboard/${quoteId}`
      ),
      adminFetch<{
        success: boolean;
        data: ClientInspiration[];
      }>(`/api/admin/inspirations/${quoteId}`),
      adminFetch<{
        success: boolean;
        data: ProjectProposal[];
      }>(`/api/admin/proposals/${quoteId}`),
    ]);
    moodboardItems.value = moodRes.data;
    clientInspirations.value = inspRes.data;
    proposals.value = propRes.data;
  } catch (err) {
    console.error("Error fetching portal data:", err);
  } finally {
    loadingInspirations.value = false;
    loadingProposals.value = false;
  }
};

// Portal toggle
const handlePortalToggle = async (value: boolean) => {
  if (!quote.value) return;
  portalEnabled.value = value;
  try {
    await adminFetch(`/api/admin/portal/${quoteId}`, {
      method: "PATCH",
      body: { portal_enabled: value },
    });
    quote.value.portal_enabled = value;
  } catch (err) {
    console.error("Error toggling portal:", err);
    portalEnabled.value = !value;
  }
};

// Send invite
const handleSendInvite = async () => {
  if (!quote.value) return;
  sendingInvite.value = true;
  try {
    await adminFetch("/api/auth/send-magic-link", {
      method: "POST",
      body: { email: quote.value.email },
    });
    inviteSent.value = true;
  } catch (err) {
    console.error("Error sending invite:", err);
  } finally {
    sendingInvite.value = false;
  }
};

// Moodboard note save
const handleSaveMoodboardNote = async () => {
  if (!quote.value) return;
  savingMoodboardNote.value = true;
  try {
    await adminFetch(`/api/admin/portal/${quoteId}`, {
      method: "PATCH",
      body: { moodboard_note: moodboardNote.value },
    });
  } catch (err) {
    console.error("Error saving moodboard note:", err);
  } finally {
    savingMoodboardNote.value = false;
  }
};

// Moodboard upload
const handleMoodboardUpload = async (rawFile: File) => {
  if (!quote.value) return;
  uploadingMoodboard.value = true;
  try {
    const file = await compress(rawFile);
    const formData = new FormData();
    formData.append("file", file);
    const res = await adminFetch<{
      success: boolean;
      data: MoodboardItem;
    }>(`/api/admin/moodboard/${quoteId}`, {
      method: "POST",
      body: formData,
    });
    // Nouvel élément = en préparation ; la version envoyée reste intacte.
    if (res.data) {
      moodboardItems.value.push(res.data);
    }
  } catch (err) {
    console.error("Error uploading moodboard:", err);
  } finally {
    uploadingMoodboard.value = false;
  }
};

// Moodboard add link
const handleMoodboardAddLink = async (
  url: string,
  title: string
) => {
  if (!quote.value) return;
  addingMoodboardLink.value = true;
  try {
    const res = await adminFetch<{
      success: boolean;
      data: MoodboardItem;
    }>(`/api/admin/moodboard/${quoteId}/link`, {
      method: "POST",
      body: { url, title },
    });
    if (res.data) {
      moodboardItems.value.push(res.data);
    }
  } catch (err) {
    console.error("Error adding link:", err);
  } finally {
    addingMoodboardLink.value = false;
  }
};

// Moodboard delete item
const handleMoodboardDelete = async (id: string) => {
  fileMenuOpen.value = null;
  try {
    await adminFetch(`/api/admin/moodboard/item/${id}`, {
      method: "DELETE",
    });
    // Seuls les éléments en préparation se suppriment (le serveur refuse
    // un élément envoyé) : la version envoyée n'est pas touchée.
    moodboardItems.value = moodboardItems.value.filter(
      (i) => i.id !== id
    );
  } catch (err) {
    console.error("Error deleting moodboard item:", err);
  }
};

// Proposal create
const handleCreateProposal = async (data: {
  title: string;
  description: string;
  amount: number;
  status: string;
  file: File | null;
}) => {
  if (!quote.value) return;
  creatingProposal.value = true;
  try {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    if (data.amount) {
      formData.append(
        "total_amount_cents",
        String(Math.round(data.amount * 100))
      );
    }
    formData.append("status", data.status);
    if (data.file) {
      formData.append("file", data.file);
    }

    const res = await adminFetch<{
      success: boolean;
      data: ProjectProposal;
    }>(`/api/admin/proposals/${quoteId}`, {
      method: "POST",
      body: formData,
    });
    if (res.data) {
      proposals.value.unshift(res.data);
    }
  } catch (err) {
    console.error("Error creating proposal:", err);
  } finally {
    creatingProposal.value = false;
  }
};

// Proposal delete
const handleDeleteProposal = async (id: string) => {
  fileMenuOpen.value = null;
  try {
    await adminFetch(`/api/admin/proposals/item/${id}`, {
      method: "DELETE",
    });
    proposals.value = proposals.value.filter(
      (p) => p.id !== id
    );
  } catch (err) {
    console.error("Error deleting proposal:", err);
  }
};

// Date formatting
const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

onUnmounted(() => {
  if (typingInterval) clearInterval(typingInterval);
});

useHead({
  title: computed(() =>
    quote.value
      ? `${quote.value.service_type === "mariage" && quote.value.partner2_name ? `${quote.value.partner1_name} & ${quote.value.partner2_name}` : quote.value.partner1_name} - Boticia`
      : t("dashboard.quotes_title") + " - Boticia"
  ),
});
</script>
