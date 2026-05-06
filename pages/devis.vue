<template>
  <div>
    <!-- Success state -->
    <template v-if="submitted">
      <section class="py-20 md:py-28 bg-white">
        <div class="container mx-auto px-6 max-w-2xl text-center">
          <div
            class="w-20 h-20 mx-auto mb-8 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center"
          >
            <IconLucid name="Check" size="lg" class="text-green-600" />
          </div>

          <h1 class="section-title-lg">
            {{ t("quote_form.success_title") }}
          </h1>
          <p class="text-dark/60 text-lg md:text-xl mt-4">
            {{ t("quote_form.success_message") }}
          </p>

          <!-- Meeting confirmation -->
          <div
            class="mt-8 rounded-2xl border-2 border-green-200 bg-green-50 px-6 py-5 text-left"
          >
            <div class="flex items-center gap-4">
              <div
                class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0"
              >
                <IconLucid
                  name="CalendarCheck"
                  size="sm"
                  class="text-green-600"
                />
              </div>
              <p class="text-lg text-green-800">
                {{
                  t("quote_form.success_with_meeting", {
                    date: formatDisplayDate(form.meeting_date),
                    time: form.meeting_time || "—",
                  })
                }}
              </p>
            </div>
          </div>

          <!-- Process steps -->
          <div
            class="mt-10 rounded-[2rem] border-2 border-dark/10 bg-cream/50 px-8 md:px-12 py-10 text-left"
          >
            <div class="space-y-8">
              <div
                v-for="(step, i) in successSteps"
                :key="i"
                class="flex gap-5"
              >
                <span
                  class="w-11 h-11 rounded-full flex items-center justify-center text-base font-heading leading-none shrink-0"
                  :class="
                    i === 0
                      ? 'bg-terracotta/15 text-terracotta font-bold'
                      : 'bg-dark/5 text-dark/40'
                  "
                >
                  {{ i + 1 }}
                </span>
                <div>
                  <span class="text-dark font-medium text-lg block">
                    {{ step.title }}
                  </span>
                  <span class="text-fuchsia-500 text-base mt-1 block">
                    {{ step.desc }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-12">
            <Button variant="primary" :to="localePath('/')">
              {{ t("common.back_to_home") }}
            </Button>
          </div>
        </div>
      </section>
    </template>

    <!-- Form -->
    <template v-else>
      <!-- Chat conversational form -->
      <section class="pt-10 md:pt-16 pb-16 md:pb-20 bg-white">
        <div class="container mx-auto px-6 md:pl-16 max-w-2xl">
          <!-- Chat messages container -->
          <div
            ref="chatContainer"
            class="space-y-6 mb-8"
          >
            <div
              v-for="msg in chatMessages"
              :key="msg.id"
              :class="
                msg.type === 'bot'
                  ? 'flex gap-3 items-start'
                  : 'flex justify-end'
              "
            >
              <!-- Bot message -->
              <template v-if="msg.type === 'bot'">
                <div
                  class="w-10 h-10 rounded-full bg-cream-dark flex items-center justify-center shrink-0 mt-0.5"
                >
                  <span
                    class="font-heading text-lg font-bold text-fuchsia-500 leading-none"
                  >B</span>
                </div>
                <div
                  class="bg-cream/60 rounded-2xl rounded-tl-md px-5 py-4 max-w-md"
                >
                  <p class="text-dark text-lg leading-relaxed">
                    {{ msg.text }}
                  </p>
                </div>
              </template>

              <!-- User message -->
              <template v-else>
                <div
                  class="bg-dark text-cream rounded-2xl rounded-tr-md px-5 py-4 max-w-md"
                >
                  <p class="text-lg leading-relaxed">
                    {{ msg.text }}
                  </p>
                </div>
              </template>
            </div>

            <!-- Typing indicator (bot is typing) -->
            <div
              v-if="isTyping"
              class="flex gap-3 items-start"
            >
              <div
                class="w-10 h-10 rounded-full bg-cream-dark flex items-center justify-center shrink-0 mt-0.5"
              >
                <span
                  class="font-heading text-lg font-bold text-fuchsia-500 leading-none animate-pulse"
                >B</span>
              </div>
              <div
                class="bg-cream/60 rounded-2xl rounded-tl-md px-5 py-4 max-w-md"
              >
                <p class="text-dark text-lg leading-relaxed">
                  <span>{{ displayedText }}</span>
                  <span class="copilot-cursor">|</span>
                </p>
              </div>
            </div>

          </div>

          <!-- Input area (changes per step) -->
          <div
            v-if="!isTyping && currentStep <= 9"
            class="ml-[52px] max-w-md"
          >
            <!-- Step 1: Service type -->
            <div v-if="currentStep === 1" class="space-y-3">
              <button
                v-for="opt in serviceTypeOptions"
                :key="opt.value"
                type="button"
                class="group w-full flex items-center gap-4 px-5 py-4 rounded-2xl border-2 text-left transition-all duration-200"
                :class="
                  form.service_type === opt.value
                    ? 'bg-dark border-dark'
                    : 'bg-white border-dark/10 hover:border-dark/30'
                "
                @click="form.service_type = opt.value"
              >
                <div
                  class="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all"
                  :class="
                    form.service_type === opt.value
                      ? 'bg-cream/20'
                      : 'bg-cream'
                  "
                >
                  <IconLucid
                    :name="opt.icon"
                    size="sm"
                    :class="
                      form.service_type === opt.value
                        ? 'text-cream'
                        : 'text-terracotta'
                    "
                  />
                </div>
                <div>
                  <span
                    class="font-medium text-base block transition-colors"
                    :class="
                      form.service_type === opt.value
                        ? 'text-cream'
                        : 'text-dark'
                    "
                  >
                    {{ opt.label }}
                  </span>
                  <span
                    class="text-sm transition-colors"
                    :class="
                      form.service_type === opt.value
                        ? 'text-cream/70'
                        : 'text-dark/50'
                    "
                  >
                    {{ opt.desc }}
                  </span>
                </div>
              </button>
              <div v-if="form.service_type" class="flex justify-center pt-1">
                <Button
                  variant="primary"
                  rightIcon="MoveRight"
                  @click="nextStep"
                >
                  {{ t("quote_form.chat_next") }}
                </Button>
              </div>
            </div>

            <!-- Step 2: Name -->
            <div v-if="currentStep === 2" class="space-y-4">
              <div>
                <label
                  class="block text-sm uppercase tracking-[0.15em] text-fuchsia-500 mb-2"
                >
                  {{ t("quote_form.name_label") }}
                </label>
                <input
                  v-model="form.name"
                  type="text"
                  :placeholder="t('quote_form.name_placeholder')"
                  class="w-full h-14 px-5 rounded-2xl border-2 bg-cream/30 focus:bg-white focus:outline-none transition-all"
                  :class="
                    errors.name
                      ? 'border-red-400'
                      : 'border-dark/20 focus:border-dark/40'
                  "
                  @keydown.enter="nextStep"
                />
                <p
                  v-if="errors.name"
                  class="mt-2 text-sm text-red-500"
                >
                  {{ errors.name }}
                </p>
              </div>
              <div class="flex justify-center">
                <Button
                  variant="primary"
                  rightIcon="MoveRight"
                  @click="nextStep"
                >
                  {{ t("quote_form.chat_next") }}
                </Button>
              </div>
            </div>

            <!-- Step 3: Email + phone -->
            <div v-if="currentStep === 3" class="space-y-4">
              <div class="space-y-4">
                <div>
                  <label
                    class="block text-sm uppercase tracking-[0.15em] text-fuchsia-500 mb-2"
                  >
                    {{ t("quote_form.email_label") }}
                  </label>
                  <input
                    v-model="form.email"
                    type="email"
                    :placeholder="t('quote_form.email_placeholder')"
                    class="w-full h-14 px-5 rounded-2xl border-2 bg-cream/30 focus:bg-white focus:outline-none transition-all"
                    :class="
                      errors.email
                        ? 'border-red-400'
                        : 'border-dark/20 focus:border-dark/40'
                    "
                    @keydown.enter="nextStep"
                  />
                  <p
                    v-if="errors.email"
                    class="mt-2 text-sm text-red-500"
                  >
                    {{ errors.email }}
                  </p>
                </div>
                <div>
                  <label
                    class="block text-sm uppercase tracking-[0.15em] text-fuchsia-500 mb-2"
                  >
                    {{ t("quote_form.phone_label") }}
                  </label>
                  <PhoneInput
                    v-model="form.phone"
                    :placeholder="t('quote_form.phone_placeholder')"
                    :searchPlaceholder="t('quote_form.phone_search_country')"
                    :defaultCountry="phoneDefaultCountry"
                    :hasError="!!errors.phone"
                    @validate="(v: boolean) => phoneValid = v"
                    @enter="nextStep"
                  />
                  <p
                    v-if="errors.phone"
                    class="mt-2 text-sm text-red-500"
                  >
                    {{ errors.phone }}
                  </p>
                  <p class="mt-1.5 text-xs text-dark/40">
                    {{ t("quote_form.phone_hint") }}
                  </p>
                </div>
              </div>
              <div class="flex justify-center">
                <Button
                  variant="primary"
                  rightIcon="MoveRight"
                  @click="nextStep"
                >
                  {{ t("quote_form.chat_next") }}
                </Button>
              </div>
            </div>

            <!-- Step 4: Date + venue/guest_count/event_type -->
            <div v-if="currentStep === 4" class="space-y-4">
              <div class="space-y-4">
                <div>
                  <label
                    class="block text-sm uppercase tracking-[0.15em] text-fuchsia-500 mb-2"
                  >
                    {{ dateLabelText }}
                    <span class="text-dark/30 normal-case tracking-normal">
                      — {{ t("quote_form.chat_optional") }}
                    </span>
                  </label>
                  <input
                    v-model="form.wedding_date"
                    type="date"
                    :min="minDate"
                    class="w-full h-14 px-5 rounded-2xl border-2 border-dark/20 bg-cream/30 focus:bg-white focus:border-dark/40 focus:outline-none transition-all"
                  />
                </div>

                <!-- Mariage: venue -->
                <div v-if="form.service_type === 'mariage' || form.service_type === 'evenement'">
                  <label
                    class="block text-sm uppercase tracking-[0.15em] text-fuchsia-500 mb-2"
                  >
                    {{ t("quote_form.venue_label") }}
                    <span class="text-dark/30 normal-case tracking-normal">
                      — {{ t("quote_form.chat_optional") }}
                    </span>
                  </label>
                  <input
                    v-model="form.venue"
                    type="text"
                    :placeholder="t('quote_form.venue_placeholder')"
                    class="w-full h-14 px-5 rounded-2xl border-2 border-dark/20 bg-cream/30 focus:bg-white focus:border-dark/40 focus:outline-none transition-all"
                    @keydown.enter="nextStep"
                  />
                </div>

                <!-- Evenement: event type -->
                <div v-if="form.service_type === 'evenement'">
                  <label
                    class="block text-sm uppercase tracking-[0.15em] text-fuchsia-500 mb-2"
                  >
                    {{ t("quote_form.event_type_label") }}
                    <span class="text-dark/30 normal-case tracking-normal">
                      — {{ t("quote_form.chat_optional") }}
                    </span>
                  </label>
                  <input
                    v-model="form.event_type"
                    type="text"
                    :placeholder="t('quote_form.event_type_placeholder')"
                    class="w-full h-14 px-5 rounded-2xl border-2 border-dark/20 bg-cream/30 focus:bg-white focus:border-dark/40 focus:outline-none transition-all"
                    @keydown.enter="nextStep"
                  />
                </div>

                <!-- Atelier: guest count -->
                <div v-if="form.service_type === 'atelier'">
                  <label
                    class="block text-sm uppercase tracking-[0.15em] text-fuchsia-500 mb-2"
                  >
                    {{ t("quote_form.guest_count_label") }}
                    <span class="text-dark/30 normal-case tracking-normal">
                      — {{ t("quote_form.chat_optional") }}
                    </span>
                  </label>
                  <input
                    v-model="form.guest_count"
                    type="number"
                    min="1"
                    :placeholder="t('quote_form.guest_count_placeholder')"
                    class="w-full h-14 px-5 rounded-2xl border-2 border-dark/20 bg-cream/30 focus:bg-white focus:border-dark/40 focus:outline-none transition-all"
                    @keydown.enter="nextStep"
                  />
                </div>
              </div>
              <div class="flex justify-center">
                <Button
                  variant="primary"
                  rightIcon="MoveRight"
                  @click="nextStep"
                >
                  {{ t("quote_form.chat_next") }}
                </Button>
              </div>
            </div>

            <!-- Step 5: Budget -->
            <div v-if="currentStep === 5" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  v-for="opt in budgetOptions"
                  :key="opt.value"
                  type="button"
                  class="h-14 px-6 rounded-2xl border-2 font-medium transition-all duration-200"
                  :class="
                    form.budget === opt.value
                      ? 'bg-dark text-cream border-dark'
                      : 'bg-cream/30 text-dark/60 border-dark/10 hover:border-dark/30 hover:text-dark'
                  "
                  @click="
                    form.budget =
                      form.budget === opt.value ? '' : opt.value
                  "
                >
                  {{ opt.label }}
                </button>
              </div>
              <div class="flex justify-center">
                <Button
                  variant="primary"
                  rightIcon="MoveRight"
                  @click="nextStep"
                >
                  {{ t("quote_form.chat_next") }}
                </Button>
              </div>
            </div>

            <!-- Step 6: Needs (service-specific) -->
            <div v-if="currentStep === 6" class="space-y-4">
              <!-- Mariage: floral needs grouped -->
              <template v-if="form.service_type === 'mariage'">
                <div class="space-y-5">
                  <div
                    v-for="group in floralNeedGroups"
                    :key="group.label"
                  >
                    <div
                      class="flex items-center gap-2 mb-2"
                    >
                      <IconLucid
                        :name="group.icon"
                        size="xs"
                        class="text-terracotta"
                      />
                      <span
                        class="text-xs uppercase tracking-[0.15em] text-dark/40 font-medium"
                      >
                        {{ group.label }}
                      </span>
                    </div>
                    <div class="space-y-2">
                      <button
                        v-for="need in group.needs"
                        :key="need"
                        type="button"
                        class="group w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl border-2 text-left transition-all duration-200"
                        :class="
                          selectedNeeds.has(need)
                            ? 'bg-dark border-dark'
                            : 'bg-white border-dark/10 hover:border-dark/30'
                        "
                        @click="toggleNeed(need)"
                      >
                        <span
                          class="w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all duration-200"
                          :class="
                            selectedNeeds.has(need)
                              ? 'bg-cream border-cream'
                              : 'border-dark/20 group-hover:border-dark/40'
                          "
                        >
                          <IconLucid
                            v-if="selectedNeeds.has(need)"
                            name="Check"
                            size="xs"
                            class="text-dark"
                          />
                        </span>
                        <span
                          class="font-medium text-base transition-colors duration-200"
                          :class="
                            selectedNeeds.has(need)
                              ? 'text-cream'
                              : 'text-dark/70 group-hover:text-dark'
                          "
                        >
                          {{ t(`quote_form.need_${need}`) }}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </template>

              <!-- Evenement: event needs -->
              <template v-else-if="form.service_type === 'evenement'">
                <div class="space-y-5">
                  <div>
                    <div class="flex items-center gap-2 mb-2">
                      <IconLucid
                        name="Sparkles"
                        size="xs"
                        class="text-terracotta"
                      />
                      <span
                        class="text-xs uppercase tracking-[0.15em] text-dark/40 font-medium"
                      >
                        {{ t("quote_form.need_group_event") }}
                      </span>
                    </div>
                    <div class="space-y-2">
                      <button
                        v-for="need in eventNeeds"
                        :key="need"
                        type="button"
                        class="group w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl border-2 text-left transition-all duration-200"
                        :class="
                          selectedNeeds.has(need)
                            ? 'bg-dark border-dark'
                            : 'bg-white border-dark/10 hover:border-dark/30'
                        "
                        @click="toggleNeed(need)"
                      >
                        <span
                          class="w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all duration-200"
                          :class="
                            selectedNeeds.has(need)
                              ? 'bg-cream border-cream'
                              : 'border-dark/20 group-hover:border-dark/40'
                          "
                        >
                          <IconLucid
                            v-if="selectedNeeds.has(need)"
                            name="Check"
                            size="xs"
                            class="text-dark"
                          />
                        </span>
                        <span
                          class="font-medium text-base transition-colors duration-200"
                          :class="
                            selectedNeeds.has(need)
                              ? 'text-cream'
                              : 'text-dark/70 group-hover:text-dark'
                          "
                        >
                          {{ t(`quote_form.need_${need}`) }}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </template>

              <!-- Atelier: workshop type -->
              <template v-else-if="form.service_type === 'atelier'">
                <div class="space-y-2">
                  <button
                    v-for="ws in workshopTypes"
                    :key="ws"
                    type="button"
                    class="group w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl border-2 text-left transition-all duration-200"
                    :class="
                      form.workshop_type === ws
                        ? 'bg-dark border-dark'
                        : 'bg-white border-dark/10 hover:border-dark/30'
                    "
                    @click="form.workshop_type = form.workshop_type === ws ? '' : ws"
                  >
                    <span
                      class="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200"
                      :class="
                        form.workshop_type === ws
                          ? 'bg-cream border-cream'
                          : 'border-dark/20 group-hover:border-dark/40'
                      "
                    >
                      <span
                        v-if="form.workshop_type === ws"
                        class="w-2 h-2 rounded-full bg-dark"
                      ></span>
                    </span>
                    <span
                      class="font-medium text-base transition-colors duration-200"
                      :class="
                        form.workshop_type === ws
                          ? 'text-cream'
                          : 'text-dark/70 group-hover:text-dark'
                      "
                    >
                      {{ t(`quote_form.workshop_${ws}`) }}
                    </span>
                  </button>
                </div>
              </template>

              <p
                v-if="errors.floral_needs"
                class="text-sm text-red-500"
              >
                {{ errors.floral_needs }}
              </p>
              <div class="flex justify-center">
                <Button
                  variant="primary"
                  rightIcon="MoveRight"
                  @click="nextStep"
                >
                  {{ t("quote_form.chat_next") }}
                </Button>
              </div>
            </div>

            <!-- Step 7: Inspirations (optional) -->
            <div v-if="currentStep === 7" class="space-y-4">
              <!-- Drop zone -->
              <div
                v-if="inspirationFiles.length < MAX_INSPIRATION_FILES"
                class="relative rounded-2xl border-2 border-dashed border-dark/20 hover:border-dark/40 bg-cream/30 hover:bg-cream/50 transition-all cursor-pointer p-6 text-center"
                @click="($refs.inspirationInput as HTMLInputElement)?.click()"
                @dragover.prevent="($event.currentTarget as HTMLElement).classList.add('border-dark/40', 'bg-cream/50')"
                @dragleave.prevent="($event.currentTarget as HTMLElement).classList.remove('border-dark/40', 'bg-cream/50')"
                @drop.prevent="handleInspirationDrop($event)"
              >
                <input
                  ref="inspirationInput"
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/heic"
                  multiple
                  class="hidden"
                  @change="handleInspirationSelect"
                />
                <IconLucid
                  name="ImagePlus"
                  size="lg"
                  class="mx-auto text-dark/30 mb-3"
                />
                <p class="text-dark/60 text-sm">
                  {{ t("quote_form.chat_step6_drop") }}
                </p>
                <p class="text-dark/30 text-xs mt-1">
                  {{ t("quote_form.chat_step6_upload_hint") }}
                </p>
              </div>

              <!-- Previews grid -->
              <div
                v-if="inspirationPreviews.length > 0"
                class="grid grid-cols-3 sm:grid-cols-5 gap-3"
              >
                <div
                  v-for="(preview, idx) in inspirationPreviews"
                  :key="idx"
                  class="relative group aspect-square rounded-xl overflow-hidden border-2 border-dark/10"
                >
                  <img
                    :src="preview"
                    class="w-full h-full object-cover"
                    alt=""
                  />
                  <button
                    type="button"
                    class="absolute top-1 right-1 w-6 h-6 rounded-full bg-dark/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    @click="removeInspirationFile(idx)"
                  >
                    <IconLucid name="X" size="xs" />
                  </button>
                </div>
              </div>

              <!-- Counter -->
              <p
                v-if="inspirationFiles.length > 0"
                class="text-sm text-dark/50 text-center"
              >
                {{ inspirationFiles.length }}/{{ MAX_INSPIRATION_FILES }}
                {{ t("quote_form.chat_step6_max", { max: MAX_INSPIRATION_FILES }) }}
              </p>

              <!-- Action buttons -->
              <div class="flex justify-center gap-3">
                <Button
                  v-if="inspirationFiles.length > 0"
                  variant="primary"
                  rightIcon="MoveRight"
                  @click="nextStep"
                >
                  {{ t("quote_form.chat_next") }}
                </Button>
                <Button
                  variant="ghost"
                  @click="nextStep"
                >
                  {{ t("quote_form.chat_step6_skip") }}
                </Button>
              </div>
            </div>

            <!-- Step 8: Meeting -->
            <div v-if="currentStep === 8" class="space-y-4">
              <!-- Selected slot display -->
              <div
                v-if="form.meeting_date"
                class="rounded-2xl border-2 border-green-200 bg-green-50 px-6 py-5"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-4">
                    <div
                      class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0"
                    >
                      <IconLucid
                        name="CalendarCheck"
                        size="sm"
                        class="text-green-600"
                      />
                    </div>
                    <div>
                      <p class="font-medium text-green-800">
                        {{ formatDisplayDate(form.meeting_date) }}
                      </p>
                      <p
                        v-if="form.meeting_time"
                        class="text-sm text-green-600"
                      >
                        {{ form.meeting_time }}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    @click="scheduleModalOpen = true"
                    class="px-4 py-2 rounded-full bg-green-700 text-white text-sm font-semibold transition-all hover:bg-green-800 flex items-center gap-2"
                  >
                    <IconLucid name="Edit" size="xs" />
                    {{ t("quote_form.meeting_change") }}
                  </button>
                </div>
              </div>

              <div v-else class="space-y-3">
                <Button
                  variant="primary"
                  icon="CalendarClock"
                  @click="scheduleModalOpen = true"
                  class="w-full"
                >
                  {{ t("quote_form.meeting_choose_slot") }}
                </Button>
                <p
                  v-if="errors.meeting"
                  class="text-sm text-red-500 text-center"
                >
                  {{ errors.meeting }}
                </p>
              </div>

              <div
                v-if="form.meeting_date"
                class="flex justify-end"
              >
                <Button
                  variant="primary"
                  rightIcon="MoveRight"
                  @click="nextStep"
                >
                  {{ t("quote_form.chat_next") }}
                </Button>
              </div>
            </div>

            <!-- Step 9: Recap + submit -->
            <div v-if="currentStep === 9" class="space-y-4">
              <div
                class="rounded-2xl border-2 border-dark/10 bg-cream/30 px-6 py-5 space-y-3 text-sm"
              >
                <!-- Service type -->
                <div class="flex justify-between">
                  <span class="text-fuchsia-500">
                    {{ t("quote_form.service_type_label") }}
                  </span>
                  <span class="font-medium text-dark">
                    {{ t(`quote_form.service_type_${form.service_type}`) }}
                  </span>
                </div>
                <div class="h-px bg-dark/5"></div>

                <div class="flex justify-between">
                  <span class="text-fuchsia-500">
                    {{ t("quote_form.name_label") }}
                  </span>
                  <span class="font-medium text-dark">
                    {{ form.name }}
                  </span>
                </div>
                <div class="h-px bg-dark/5"></div>
                <div class="flex justify-between">
                  <span class="text-fuchsia-500">
                    {{ t("quote_form.email_label") }}
                  </span>
                  <span class="font-medium text-dark">
                    {{ form.email }}
                  </span>
                </div>
                <div v-if="form.phone" class="flex justify-between">
                  <span class="text-fuchsia-500">
                    {{ t("quote_form.phone_label") }}
                  </span>
                  <span class="font-medium text-dark">
                    {{ form.phone }}
                  </span>
                </div>
                <div class="h-px bg-dark/5"></div>
                <div
                  v-if="form.wedding_date"
                  class="flex justify-between"
                >
                  <span class="text-fuchsia-500">
                    {{ dateLabelText }}
                  </span>
                  <span class="font-medium text-dark">
                    {{ formatDisplayDate(form.wedding_date) }}
                  </span>
                </div>
                <div v-if="form.venue" class="flex justify-between">
                  <span class="text-fuchsia-500">
                    {{ t("quote_form.venue_label") }}
                  </span>
                  <span class="font-medium text-dark">
                    {{ form.venue }}
                  </span>
                </div>
                <div v-if="form.event_type" class="flex justify-between">
                  <span class="text-fuchsia-500">
                    {{ t("quote_form.event_type_label") }}
                  </span>
                  <span class="font-medium text-dark">
                    {{ form.event_type }}
                  </span>
                </div>
                <div v-if="form.guest_count" class="flex justify-between">
                  <span class="text-fuchsia-500">
                    {{ t("quote_form.guest_count_label") }}
                  </span>
                  <span class="font-medium text-dark">
                    {{ form.guest_count }}
                  </span>
                </div>
                <div v-if="form.budget" class="flex justify-between">
                  <span class="text-fuchsia-500">
                    {{ t("quote_form.budget_label") }}
                  </span>
                  <span class="font-medium text-dark">
                    {{ budgetLabel }}
                  </span>
                </div>

                <!-- Floral/event needs -->
                <div
                  v-if="selectedNeeds.size > 0"
                  class="pt-1"
                >
                  <span class="text-fuchsia-500 block mb-2">
                    {{ t("quote_form.section_floral") }}
                  </span>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="need in selectedNeeds"
                      :key="need"
                      class="px-3 py-1 rounded-full bg-dark/5 text-dark/70 text-xs font-medium"
                    >
                      {{ t(`quote_form.need_${need}`) }}
                    </span>
                  </div>
                </div>

                <!-- Workshop type -->
                <div
                  v-if="form.workshop_type"
                  class="flex justify-between"
                >
                  <span class="text-fuchsia-500">
                    {{ t("quote_form.workshop_type_label") }}
                  </span>
                  <span class="font-medium text-dark">
                    {{ t(`quote_form.workshop_${form.workshop_type}`) }}
                  </span>
                </div>

                <div
                  v-if="inspirationFiles.length > 0"
                  class="pt-1"
                >
                  <div class="flex justify-between">
                    <span class="text-fuchsia-500">
                      Inspirations
                    </span>
                    <span class="font-medium text-dark">
                      {{ inspirationFiles.length }} photo{{ inspirationFiles.length > 1 ? "s" : "" }}
                    </span>
                  </div>
                </div>
                <div class="pt-1">
                  <div class="flex justify-between">
                    <span class="text-fuchsia-500">
                      {{ t("quote_form.section_meeting") }}
                    </span>
                    <span class="font-medium text-dark">
                      {{ formatDisplayDate(form.meeting_date) }}
                      <span v-if="form.meeting_time">
                        — {{ form.meeting_time }}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <p
                v-if="errors.generic"
                class="text-sm text-red-500 text-center"
              >
                {{ errors.generic }}
              </p>

              <div class="flex justify-center">
                <Button
                  variant="primary"
                  icon="Send"
                  :loading="loading"
                  @click="handleSubmit"
                >
                  {{ t("quote_form.chat_send") }}
                </Button>
              </div>
            </div>
          </div>

          <!-- Scroll anchor (after input area) -->
          <div ref="scrollAnchor" class="h-16"></div>
        </div>
      </section>
    </template>

    <!-- Schedule modal -->
    <ScheduleModal
      :isOpen="scheduleModalOpen"
      @close="scheduleModalOpen = false"
      @confirmed="handleSlotConfirmed"
    />
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  reactive,
  computed,
  nextTick,
  onMounted,
  onUnmounted,
} from "vue";
import { useI18n } from "vue-i18n";
import type {
  ServiceType,
  FloralNeedKey,
  EventNeedKey,
  WorkshopTypeKey,
} from "~/server/utils/quotes-types";

definePageMeta({
  layout: "minimal",
});

const { t, locale } = useI18n();
const localePath = useLocalePath();
const { compress } = useImageCompression();

useHead({
  title: t("quote_form.page_title") + " - Boticia",
  meta: [
    {
      key: "description",
      name: "description",
      content: t("seo.devis_description"),
    },
  ],
});

// ── Chat state ──────────────────────────────────────
interface ChatMessage {
  type: "bot" | "user";
  text: string;
  id: number;
}

const currentStep = ref(0);
const chatMessages = ref<ChatMessage[]>([]);
const isTyping = ref(false);
const displayedText = ref("");
const chatContainer = ref<HTMLElement | null>(null);
const scrollAnchor = ref<HTMLElement | null>(null);
let msgCounter = 0;
let typingInterval: ReturnType<typeof setInterval> | null = null;

// ── Form state ──────────────────────────────────────
const form = reactive({
  service_type: "" as ServiceType | "",
  name: "",
  email: "",
  phone: "",
  wedding_date: "",
  venue: "",
  budget: "",
  event_type: "",
  guest_count: "",
  workshop_type: "",
  meeting_date: "",
  meeting_time: "",
});

const selectedNeeds = ref<Set<FloralNeedKey | EventNeedKey>>(new Set());
const loading = ref(false);
const submitted = ref(false);
const scheduleModalOpen = ref(false);

// Phone input state
const phoneValid = ref(false);
const detectedCountry = ref("");
const phoneDefaultCountry = computed(() => {
  if (detectedCountry.value) return detectedCountry.value;
  const map: Record<string, string> = {
    fr: "FR",
    en: "US",
    ja: "JP",
  };
  return map[locale.value] || "FR";
});

// Detect country from browser timezone
if (import.meta.client) {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const tzToCountry: Record<string, string> = {
      "America/New_York": "US",
      "America/Chicago": "US",
      "America/Denver": "US",
      "America/Los_Angeles": "US",
      "America/Phoenix": "US",
      "America/Anchorage": "US",
      "Pacific/Honolulu": "US",
      "America/Toronto": "CA",
      "America/Vancouver": "CA",
      "Europe/London": "GB",
      "Europe/Paris": "FR",
      "Europe/Brussels": "BE",
      "Europe/Zurich": "CH",
      "Europe/Berlin": "DE",
      "Europe/Rome": "IT",
      "Europe/Madrid": "ES",
      "Europe/Amsterdam": "NL",
      "Europe/Luxembourg": "LU",
      "Asia/Tokyo": "JP",
      "Australia/Sydney": "AU",
      "Pacific/Auckland": "NZ",
    };
    if (tzToCountry[tz]) {
      detectedCountry.value = tzToCountry[tz];
    }
  } catch {
    // Fallback to locale-based detection
  }
}

// Inspiration files state
const inspirationFiles = ref<File[]>([]);
const inspirationPreviews = ref<string[]>([]);
const inspirationUploading = ref(false);
const MAX_INSPIRATION_FILES = 5;

const errors = reactive({
  name: "",
  email: "",
  phone: "",
  floral_needs: "",
  meeting: "",
  generic: "",
});

// Min date = today
const minDate = computed(() => {
  const d = new Date();
  return d.toISOString().split("T")[0];
});

// ── Service type options ────────────────────────────
const serviceTypeOptions = computed(() => [
  {
    value: "mariage" as ServiceType,
    label: t("quote_form.service_type_mariage"),
    desc: t("quote_form.service_type_mariage_desc"),
    icon: "Heart",
  },
  {
    value: "evenement" as ServiceType,
    label: t("quote_form.service_type_evenement"),
    desc: t("quote_form.service_type_evenement_desc"),
    icon: "Sparkles",
  },
  {
    value: "atelier" as ServiceType,
    label: t("quote_form.service_type_atelier"),
    desc: t("quote_form.service_type_atelier_desc"),
    icon: "Palette",
  },
]);

// Budget options
const budgetOptions = computed(() => [
  { label: t("quote_form.budget_lt_2500"), value: "lt_2500" },
  { label: t("quote_form.budget_lt_4000"), value: "lt_4000" },
  { label: t("quote_form.budget_lt_10000"), value: "lt_10000" },
]);

// Date label (adapts to service type)
const dateLabelText = computed(() => {
  if (form.service_type === "evenement")
    return t("quote_form.date_label_evenement");
  if (form.service_type === "atelier")
    return t("quote_form.date_label_atelier");
  return t("quote_form.date_label");
});

// Budget label for recap
const budgetLabel = computed(() => {
  const opt = budgetOptions.value.find(
    (o) => o.value === form.budget
  );
  return opt?.label || "";
});

// ── Floral needs (mariage) ──────────────────────────
const floralNeedGroups = computed(() => [
  {
    label: t("quote_form.need_group_personal"),
    icon: "Heart",
    needs: [
      "bridal_bouquet",
      "bridesmaid_bouquet",
      "boutonnieres",
      "hair_flowers",
    ] as FloralNeedKey[],
  },
  {
    label: t("quote_form.need_group_ceremony"),
    icon: "Sparkles",
    needs: [
      "ceremony_arch",
      "ceremony_aisle",
      "welcome_sign",
    ] as FloralNeedKey[],
  },
  {
    label: t("quote_form.need_group_reception"),
    icon: "Star",
    needs: [
      "table_centerpieces",
      "table_runner",
      "cocktail_decor",
      "cake_flowers",
      "venue_entrance",
    ] as FloralNeedKey[],
  },
]);

// ── Event needs (evenement) ─────────────────────────
const eventNeeds: EventNeedKey[] = [
  "scenographie",
  "corner_floral",
  "suspended_installations",
  "stage_decor",
  "table_decor",
  "welcome_compositions",
];

// ── Workshop types (atelier) ────────────────────────
const workshopTypes: WorkshopTypeKey[] = [
  "bouquet_composition",
  "wreath",
  "terrarium",
  "seasonal",
];

const toggleNeed = (key: FloralNeedKey | EventNeedKey) => {
  if (selectedNeeds.value.has(key)) {
    selectedNeeds.value.delete(key);
  } else {
    selectedNeeds.value.add(key);
  }
  errors.floral_needs = "";
};

// Success steps
const successSteps = computed(() =>
  [1, 2, 3, 4, 5].map((n) => ({
    title: t(`quote_form.success_step_${n}_title`),
    desc: t(`quote_form.success_step_${n}_desc`),
  }))
);

// Format display date
const formatDisplayDate = (dateStr: string) => {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString(locale.value, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// ── Scroll to bottom ────────────────────────────────
const scrollToBottom = () => {
  nextTick(() => {
    setTimeout(() => {
      scrollAnchor.value?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 50);
  });
};

// ── Typewriter ──────────────────────────────────────
const addBotMessage = (text: string): Promise<void> => {
  return new Promise((resolve) => {
    if (typingInterval) clearInterval(typingInterval);
    displayedText.value = "";
    isTyping.value = true;

    nextTick(() => scrollToBottom());

    let i = 0;
    typingInterval = setInterval(() => {
      displayedText.value = text.slice(0, ++i);
      if (i >= text.length) {
        clearInterval(typingInterval!);
        typingInterval = null;
        chatMessages.value.push({
          type: "bot",
          text,
          id: ++msgCounter,
        });
        displayedText.value = "";
        isTyping.value = false;
        nextTick(() => {
          scrollToBottom();
          resolve();
        });
      }
    }, 12);
  });
};

const addUserMessage = (text: string) => {
  chatMessages.value.push({
    type: "user",
    text,
    id: ++msgCounter,
  });
  nextTick(() => scrollToBottom());
};

// ── Step messages ───────────────────────────────────
const getStepMessage = (step: number): string => {
  switch (step) {
    case 1:
      return t("quote_form.chat_step_service");
    case 2:
      return t("quote_form.chat_step1");
    case 3:
      return t("quote_form.chat_step2", {
        name: form.name,
      });
    case 4: {
      const key = `quote_form.chat_step3_${form.service_type}`;
      return t(key);
    }
    case 5:
      return t(`quote_form.chat_step4_${form.service_type}`);
    case 6: {
      const key = `quote_form.chat_step5_${form.service_type}`;
      return t(key);
    }
    case 7:
      return t("quote_form.chat_step6_inspirations");
    case 8:
      return t("quote_form.chat_step7");
    case 9:
      return t("quote_form.chat_step8");
    default:
      return "";
  }
};

// ── Step user summary ───────────────────────────────
const getStepSummary = (step: number): string => {
  switch (step) {
    case 1:
      return t(`quote_form.service_type_${form.service_type}`);
    case 2:
      return form.name;
    case 3: {
      let summary = form.email;
      if (form.phone) summary += ` • ${form.phone}`;
      return summary;
    }
    case 4: {
      const parts: string[] = [];
      if (form.wedding_date)
        parts.push(formatDisplayDate(form.wedding_date));
      if (form.venue) parts.push(form.venue);
      if (form.event_type) parts.push(form.event_type);
      if (form.guest_count)
        parts.push(`${form.guest_count} ${t("quote_form.guest_count_label").toLowerCase()}`);
      return parts.length > 0 ? parts.join(" • ") : "—";
    }
    case 5:
      return budgetLabel.value || "—";
    case 6: {
      if (form.service_type === "atelier" && form.workshop_type) {
        return t(`quote_form.workshop_${form.workshop_type}`);
      }
      return Array.from(selectedNeeds.value)
        .map((k) => t(`quote_form.need_${k}`))
        .join(", ");
    }
    case 7:
      if (inspirationFiles.value.length > 0) {
        return `${inspirationFiles.value.length} photo${inspirationFiles.value.length > 1 ? "s" : ""}`;
      }
      return t("quote_form.chat_step6_skip");
    case 8: {
      let summary = formatDisplayDate(form.meeting_date);
      if (form.meeting_time) summary += ` — ${form.meeting_time}`;
      return summary;
    }
    default:
      return "";
  }
};

// ── Validation per step ─────────────────────────────
const validateStep = (step: number): boolean => {
  errors.name = "";
  errors.email = "";
  errors.phone = "";
  errors.floral_needs = "";
  errors.meeting = "";

  switch (step) {
    case 1:
      return !!form.service_type;
    case 2:
      if (!form.name.trim()) {
        errors.name = t("quote_form.error_name");
        return false;
      }
      return true;
    case 3: {
      let valid = true;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!form.email.trim() || !emailRegex.test(form.email)) {
        errors.email = t("quote_form.error_email");
        valid = false;
      }
      if (!form.phone.trim() || !phoneValid.value) {
        errors.phone = t("quote_form.error_phone");
        valid = false;
      }
      return valid;
    }
    case 6: {
      if (form.service_type === "atelier") {
        if (!form.workshop_type) {
          errors.floral_needs = t("quote_form.error_needs");
          return false;
        }
        return true;
      }
      if (selectedNeeds.value.size === 0) {
        errors.floral_needs = t("quote_form.error_needs");
        return false;
      }
      return true;
    }
    case 8:
      if (!form.meeting_date) {
        errors.meeting = t("quote_form.error_meeting");
        return false;
      }
      return true;
    default:
      return true;
  }
};

// ── Next step ───────────────────────────────────────
const nextStep = async () => {
  if (isTyping.value) return;

  if (currentStep.value > 0 && !validateStep(currentStep.value)) {
    return;
  }

  if (currentStep.value > 0) {
    addUserMessage(getStepSummary(currentStep.value));
  }

  currentStep.value++;

  // Skip budget step for non-mariage
  if (currentStep.value === 5 && form.service_type !== "mariage") {
    currentStep.value++;
  }

  if (currentStep.value <= 9) {
    await addBotMessage(getStepMessage(currentStep.value));
  }
};

// ── Handle slot confirmed ───────────────────────────
const handleSlotConfirmed = (data: {
  date: string;
  time: string;
  displayDate: string;
}) => {
  form.meeting_date = data.date;
  form.meeting_time = data.time;
  errors.meeting = "";
  scheduleModalOpen.value = false;
  nextTick(() => nextStep());
};

// ── Submit ──────────────────────────────────────────
const handleSubmit = async () => {
  loading.value = true;
  errors.generic = "";

  try {
    const body: Record<string, any> = {
      service_type: form.service_type,
      partner1_name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      wedding_date: form.wedding_date || undefined,
      venue: form.venue.trim() || undefined,
      budget: form.budget || undefined,
      floral_needs: Array.from(selectedNeeds.value),
      meeting_date: form.meeting_date,
      meeting_time: form.meeting_time,
      locale: locale.value,
    };

    if (form.service_type === "evenement") {
      body.event_type = form.event_type.trim() || undefined;
    }
    if (form.service_type === "atelier") {
      body.guest_count = form.guest_count
        ? parseInt(form.guest_count)
        : undefined;
      body.workshop_type = form.workshop_type || undefined;
    }

    const result = await $fetch<{
      success: boolean;
      data: { id: string };
    }>("/api/quotes", {
      method: "POST",
      body,
    });

    // Upload inspiration files (non-blocking)
    if (inspirationFiles.value.length > 0 && result.data?.id) {
      inspirationUploading.value = true;
      for (const rawFile of inspirationFiles.value) {
        try {
          const file = await compress(rawFile);
          const fd = new FormData();
          fd.append("file", file);
          await $fetch(
            `/api/quotes/${result.data.id}/inspirations`,
            { method: "POST", body: fd }
          );
        } catch (err) {
          console.error("Failed to upload inspiration:", err);
        }
      }
      inspirationUploading.value = false;
    }

    submitted.value = true;
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch {
    errors.generic = t("quote_form.error_generic");
  } finally {
    loading.value = false;
  }
};

// ── Inspiration file handling ────────────────────────
const addInspirationFiles = (files: FileList | File[]) => {
  const allowed = [
    "image/png",
    "image/jpeg",
    "image/webp",
    "image/heic",
  ];
  for (const file of Array.from(files)) {
    if (inspirationFiles.value.length >= MAX_INSPIRATION_FILES) break;
    if (!allowed.includes(file.type)) continue;
    inspirationFiles.value.push(file);
    inspirationPreviews.value.push(URL.createObjectURL(file));
  }
};

const handleInspirationSelect = (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (input.files) {
    addInspirationFiles(input.files);
    input.value = "";
  }
};

const handleInspirationDrop = (e: DragEvent) => {
  (e.currentTarget as HTMLElement).classList.remove(
    "border-dark/40",
    "bg-cream/50"
  );
  if (e.dataTransfer?.files) {
    addInspirationFiles(e.dataTransfer.files);
  }
};

const removeInspirationFile = (idx: number) => {
  URL.revokeObjectURL(inspirationPreviews.value[idx]);
  inspirationFiles.value.splice(idx, 1);
  inspirationPreviews.value.splice(idx, 1);
};

// ── Start the conversation ──────────────────────────
onMounted(async () => {
  await addBotMessage(t("quote_form.chat_intro"));
  nextStep();
});

onUnmounted(() => {
  inspirationPreviews.value.forEach((url) => URL.revokeObjectURL(url));
});
</script>
