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
                <button
                  v-if="quote.meeting_date && !isMeetingPast"
                  @click="openCalendarEvent"
                  class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border-2 border-dark/10 text-dark text-sm font-semibold hover:bg-cream transition-all"
                >
                  <IconLucid name="CalendarPlus" size="xs" />
                  {{ t("dashboard.copilot_add_calendar") }}
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
                    transition-all text-dark/60"
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
                      <button
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
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
              <!-- Moodboard section -->
              <div class="rounded-xl border-2 border-dark/10 p-4">
                <div class="flex items-center justify-between mb-3">
                  <h3 class="font-heading text-sm text-dark/60 uppercase tracking-wider">
                    Moodboard
                  </h3>
                  <button
                    @click="triggerMoodboardUpload"
                    :disabled="uploadingMoodboard"
                    class="text-sm text-dark/60 hover:text-dark flex items-center gap-1 transition-colors disabled:opacity-50"
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
                <!-- Mini-list -->
                <div v-if="moodboardItems.length > 0" class="space-y-2 mb-3">
                  <div
                    v-for="item in moodboardItems"
                    :key="item.id"
                    class="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-cream/50"
                  >
                    <div class="w-6 h-6 rounded-md overflow-hidden bg-cream shrink-0">
                      <img
                        v-if="item.type === 'image'"
                        :src="item.public_url"
                        :alt="item.original_filename"
                        class="w-full h-full object-cover"
                      />
                      <div v-else class="w-full h-full flex items-center justify-center">
                        <IconLucid name="FileText" size="xs" class="text-gray-500" />
                      </div>
                    </div>
                    <span class="text-sm text-dark/80 truncate flex-1">
                      {{ item.original_filename }}
                    </span>
                    <button
                      @click="handleMoodboardDelete(item.id)"
                      class="text-dark/30 hover:text-red-500 transition-colors shrink-0"
                    >
                      <IconLucid name="X" size="xs" />
                    </button>
                  </div>
                </div>
                <p v-else class="text-sm text-dark/40 mb-3">
                  {{ $t("dashboard.moodboard_empty") }}
                </p>
                <!-- Send moodboard button -->
                <button
                  @click="handleSendMoodboard"
                  :disabled="moodboardItems.length === 0 || sendingMoodboard"
                  class="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40"
                  :class="quote.status === 'moodboard_sent' && moodboardItems.length > 0
                    ? 'bg-green-50 text-green-600 border-2 border-green-200'
                    : 'bg-dark text-cream hover:bg-dark/80'"
                >
                  <IconLucid
                    :name="quote.status === 'moodboard_sent' && moodboardItems.length > 0 ? 'Check' : sendingMoodboard ? 'Loader2' : 'Send'"
                    size="xs"
                    :class="sendingMoodboard ? 'animate-spin' : ''"
                  />
                  {{
                    quote.status === 'moodboard_sent' && moodboardItems.length > 0
                      ? $t("dashboard.moodboard_sent")
                      : $t("dashboard.moodboard_send")
                  }}
                </button>
              </div>

              <!-- Devis section -->
              <div class="rounded-xl border-2 border-dark/10 p-4">
                <div class="flex items-center justify-between mb-3">
                  <h3 class="font-heading text-sm text-dark/60 uppercase tracking-wider">
                    {{ $t("dashboard.proposal_title") }}
                  </h3>
                  <button
                    @click="triggerProposalUpload"
                    :disabled="uploadingProposal"
                    class="text-sm text-dark/60 hover:text-dark flex items-center gap-1 transition-colors disabled:opacity-50"
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
                <!-- Mini-list -->
                <div v-if="proposals.length > 0" class="space-y-2 mb-3">
                  <div
                    v-for="prop in proposals"
                    :key="prop.id"
                    class="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-cream/50"
                  >
                    <div class="w-6 h-6 rounded-md bg-cream flex items-center justify-center shrink-0">
                      <IconLucid name="FileText" size="xs" class="text-gray-500" />
                    </div>
                    <span class="text-sm text-dark/80 truncate flex-1">
                      {{ prop.original_filename || prop.title }}
                    </span>
                    <button
                      @click="handleDeleteProposal(prop.id)"
                      class="text-dark/30 hover:text-red-500 transition-colors shrink-0"
                    >
                      <IconLucid name="X" size="xs" />
                    </button>
                  </div>
                </div>
                <p v-else class="text-sm text-dark/40 mb-3">
                  {{ $t("dashboard.proposal_empty") }}
                </p>
                <!-- Send proposal button -->
                <button
                  @click="handleSendProposal"
                  :disabled="proposals.length === 0 || sendingProposal || quote.status === 'quote_sent'"
                  class="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40"
                  :class="quote.status === 'quote_sent'
                    ? 'bg-green-50 text-green-600 border-2 border-green-200'
                    : 'bg-dark text-cream hover:bg-dark/80'"
                >
                  <IconLucid
                    :name="quote.status === 'quote_sent' ? 'Check' : sendingProposal ? 'Loader2' : 'Send'"
                    size="xs"
                    :class="sendingProposal ? 'animate-spin' : ''"
                  />
                  {{
                    quote.status === 'quote_sent'
                      ? $t("dashboard.proposal_sent")
                      : $t("dashboard.proposal_send")
                  }}
                </button>
              </div>
              </div>

              <!-- Portal toggle -->
              <PortalToggle
                :enabled="portalEnabled"
                :quoteEmail="quote.email"
                @toggle="handlePortalToggle"
                class="mt-4"
              />

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
                  class="h-full overflow-y-auto space-y-3 pb-28"
                >
                  <!-- Empty -->
                  <div
                    v-if="activityLog.length === 0"
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
                  <!-- Activity log entries -->
                  <div
                    v-for="entry in activityLog"
                    :key="entry.id"
                    class="px-3 py-2.5 rounded-xl border border-dark/10"
                  >
                    <!-- Note with menu -->
                    <div
                      v-if="entry.action === 'note_added'"
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
                          <div v-if="editingNoteId === entry.id">
                            <textarea
                              v-model="editingNoteText"
                              class="w-full text-sm text-dark/80 bg-cream rounded-lg px-3 py-2 border border-dark/10 focus:outline-none focus:border-dark/30 resize-none"
                              rows="3"
                            />
                            <div class="flex gap-2 mt-2">
                              <button
                                @click="saveEditNote(entry.id)"
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
                            <p class="text-sm text-dark/80 leading-snug">
                              {{ entry.details?.text }}
                            </p>
                            <p class="text-[11px] text-dark/40 mt-1">
                              {{ formatRelativeDate(entry.created_at) }}
                            </p>
                          </div>
                        </div>
                      </div>
                      <!-- Menu button -->
                      <div class="absolute top-0 right-0">
                        <button
                          @click="
                            noteMenuOpen === entry.id
                              ? (noteMenuOpen = null)
                              : (noteMenuOpen = entry.id)
                          "
                          class="w-7 h-7 rounded-full flex items-center justify-center text-dark/30 hover:text-dark/60 hover:bg-cream transition-all"
                        >
                          <IconLucid
                            name="MoreHorizontal"
                            size="xs"
                          />
                        </button>
                        <!-- Dropdown -->
                        <div
                          v-if="noteMenuOpen === entry.id"
                          class="absolute right-0 top-8 bg-white rounded-xl shadow-lg border border-dark/10 py-1 z-10 min-w-[120px]"
                        >
                          <button
                            @click="startEditNote(entry)"
                            class="w-full text-left px-4 py-2 text-sm text-dark/70 hover:bg-cream transition-colors"
                          >
                            {{ t("common.edit") }}
                          </button>
                          <button
                            @click="deleteActivity(entry.id)"
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
                          :name="activityIcon(entry.action)"
                          size="xs"
                          class="text-gray-500"
                        />
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-sm text-dark/80 leading-tight">
                          {{ activityLabel(entry) }}
                        </p>
                        <p class="text-[11px] text-dark/40 mt-0.5">
                          {{ formatRelativeDate(entry.created_at) }}
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
                <!-- Compose bar (floating) -->
                <div class="absolute bottom-0 left-0 right-0">
                  <div class="rounded-2xl bg-cream-light p-3">
                    <button
                      @click="showNotePanel = true"
                      class="flex items-center gap-2.5 w-full px-3.5 py-2.5 rounded-xl bg-white text-left hover:bg-cream active:bg-cream-dark transition-all"
                    >
                      <div
                        class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-green-100 text-green-600"
                      >
                        <IconLucid name="NotebookPen" size="xs" />
                      </div>
                      <span class="text-sm text-dark/60">
                        {{ $t("dashboard.timeline_note_label") }}
                      </span>
                    </button>
                  </div>
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
      :showCloseButton="true"
      :closeButtonText="t('common.close')"
      @close="showNotePanel = false"
    >
      <div>
        <textarea
          v-model="newNoteText"
          :placeholder="t('dashboard.timeline_note_placeholder')"
          class="w-full h-32 px-4 py-3 rounded-xl border-0 bg-cream-light focus:outline-none focus:ring-2 focus:ring-dark/10 transition-all resize-none text-dark"
          autofocus
        />
        <div class="mt-4">
          <Button
            variant="primary"
            icon="Send"
            :loading="sendingNote"
            :disabled="!newNoteText.trim()"
            @click="sendNote"
          >
            {{ t("dashboard.timeline_note_send") }}
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
          class="flex items-center gap-4 w-full px-4 py-3.5 rounded-2xl border-2 transition-all text-left"
          :class="
            quote?.status === opt.value
              ? 'bg-dark text-cream border-dark'
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
                  : 'text-dark/50'
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

const quoteId = route.params.id as string;
const pageTitle = useState<string | null>("dashboard-page-title", () => null);

// State
const quote = ref<QuoteRequest | null>(null);
const adminNotes = ref("");
const savingNotes = ref(false);

// Portal state
const portalEnabled = ref(false);
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

const isMeetingPast = computed(() => {
  if (!quote.value?.meeting_date) return false;
  const meeting = new Date(quote.value.meeting_date);
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
    moodboard_sent: "bg-fuchsia-500",
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

  if (s === "moodboard_sent") {
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
    if (!fullText) return;
    if (typingInterval) clearInterval(typingInterval);
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
    moodboard_sent: "Palette",
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
    moodboard_sent: "bg-fuchsia-500",
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

const statusOptions = computed(() => [
  { label: t("dashboard.quote_status_new"), value: "new" },
  {
    label: t("dashboard.quote_status_contacted"),
    value: "contacted",
  },
  {
    label: t("dashboard.quote_status_moodboard_sent"),
    value: "moodboard_sent",
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

// Send note
const sendNote = async () => {
  if (!newNoteText.value.trim()) return;
  sendingNote.value = true;
  try {
    await adminFetch(`/api/quotes/${quoteId}/notes`, {
      method: "POST",
      body: { text: newNoteText.value.trim() },
    });
    newNoteText.value = "";
    showNotePanel.value = false;
    await fetchActivityLog();
  } catch (err) {
    console.error("Error sending note:", err);
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
const deleteActivity = async (id: string) => {
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

// Send moodboard: change status + log activity
const handleSendMoodboard = async () => {
  if (!quote.value || moodboardItems.value.length === 0) return;
  sendingMoodboard.value = true;
  try {
    await adminFetch(`/api/quotes/${quoteId}`, {
      method: "PATCH",
      body: { status: "moodboard_sent" },
    });
    quote.value.status = "moodboard_sent" as any;
    fetchActivityLog();
  } catch (err) {
    console.error("Error sending moodboard:", err);
  } finally {
    sendingMoodboard.value = false;
  }
};

// Send proposal: change status + log activity
const handleSendProposal = async () => {
  if (!quote.value || proposals.value.length === 0) return;
  sendingProposal.value = true;
  try {
    await adminFetch(`/api/quotes/${quoteId}`, {
      method: "PATCH",
      body: { status: "quote_sent" },
    });
    quote.value.status = "quote_sent" as any;
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
    formData.append("status", "pending");
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
    portalEnabled.value = res.data.portal_enabled || false;
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
const handleMoodboardUpload = async (file: File) => {
  if (!quote.value) return;
  uploadingMoodboard.value = true;
  try {
    const formData = new FormData();
    formData.append("file", file);
    const res = await adminFetch<{
      success: boolean;
      data: MoodboardItem;
    }>(`/api/admin/moodboard/${quoteId}`, {
      method: "POST",
      body: formData,
    });
    if (res.data) {
      moodboardItems.value.push(res.data);
      // Reset status if moodboard was already sent (content changed)
      if (quote.value?.status === "moodboard_sent") {
        await adminFetch(`/api/quotes/${quoteId}`, {
          method: "PATCH",
          body: { status: "contacted" },
        });
        quote.value.status = "contacted" as any;
      }
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
  try {
    await adminFetch(`/api/admin/moodboard/item/${id}`, {
      method: "DELETE",
    });
    moodboardItems.value = moodboardItems.value.filter(
      (i) => i.id !== id
    );
    // Reset status if moodboard was already sent
    if (
      quote.value?.status === "moodboard_sent" &&
      moodboardItems.value.length === 0
    ) {
      await adminFetch(`/api/quotes/${quoteId}`, {
        method: "PATCH",
        body: { status: "contacted" },
      });
      quote.value.status = "contacted" as any;
    }
    fetchActivityLog();
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
