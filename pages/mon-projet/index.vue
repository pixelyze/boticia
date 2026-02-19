<template>
  <div class="flex-1 flex flex-col bg-white">
    <section class="py-12 md:py-16">
      <div class="px-4 md:px-10">
        <div
          class="rounded-[2rem] border-2 border-dark/10
            p-8 md:p-10"
        >
          <!-- Loading -->
          <div v-if="loading" class="py-16 text-center">
            <IconLucid
              name="Loader2"
              size="lg"
              class="animate-spin mx-auto text-dark/30"
            />
            <p class="text-dark/40 mt-4">
              {{ t("common.loading") }}
            </p>
          </div>

          <template v-else-if="project">
            <!-- Welcome -->
            <div class="mb-10">
              <h1
                class="text-2xl md:text-3xl font-bold
                  text-dark mb-2"
              >
                {{
                  t("client.project_title", {
                    partner1:
                      project.quote.partner1_name,
                    partner2:
                      project.quote.partner2_name,
                  })
                }}
              </h1>
              <p class="text-dark/50">
                {{ t("client.project_subtitle") }}
              </p>
            </div>

            <!-- Wedding summary -->
            <div
              class="grid grid-cols-1 md:grid-cols-3
                gap-4 mb-10"
            >
              <div
                class="rounded-[1.5rem] border-2
                  border-dark/10 p-5"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="w-9 h-9 rounded-full bg-cream
                      flex items-center justify-center
                      shrink-0"
                  >
                    <IconLucid
                      name="Calendar"
                      size="sm"
                      class="text-dark/40"
                    />
                  </div>
                  <div>
                    <p
                      class="text-xs text-dark/40
                        uppercase tracking-wider"
                    >
                      {{ t("client.project_date") }}
                    </p>
                    <p class="font-medium text-dark">
                      {{
                        project.quote.wedding_date
                          ? formatDate(
                              project.quote.wedding_date
                            )
                          : t("client.project_tbd")
                      }}
                    </p>
                  </div>
                </div>
              </div>
              <div
                class="rounded-[1.5rem] border-2
                  border-dark/10 p-5"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="w-9 h-9 rounded-full bg-cream
                      flex items-center justify-center
                      shrink-0"
                  >
                    <IconLucid
                      name="Target"
                      size="sm"
                      class="text-dark/40"
                    />
                  </div>
                  <div>
                    <p
                      class="text-xs text-dark/40
                        uppercase tracking-wider"
                    >
                      {{ t("client.project_venue") }}
                    </p>
                    <p class="font-medium text-dark">
                      {{
                        project.quote.venue ||
                        t("client.project_tbd")
                      }}
                    </p>
                  </div>
                </div>
              </div>
              <div
                class="rounded-[1.5rem] border-2
                  border-dark/10 p-5"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="w-9 h-9 rounded-full bg-cream
                      flex items-center justify-center
                      shrink-0"
                  >
                    <IconLucid
                      name="Flower2"
                      size="sm"
                      class="text-dark/40"
                    />
                  </div>
                  <div>
                    <p
                      class="text-xs text-dark/40
                        uppercase tracking-wider"
                    >
                      {{ t("client.project_services") }}
                    </p>
                    <p class="font-medium text-dark">
                      {{
                        project.quote.floral_needs?.length ||
                        0
                      }}
                      {{
                        t("client.project_services_count")
                      }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Meeting -->
            <div
              class="rounded-[1.5rem] border-2
                border-dark/10 p-5 mb-10"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div
                    class="w-9 h-9 rounded-full bg-cream
                      flex items-center justify-center
                      shrink-0"
                  >
                    <IconLucid
                      name="CalendarCheck"
                      size="sm"
                      class="text-dark"
                    />
                  </div>
                  <div>
                    <p
                      class="text-xs text-dark/40
                        uppercase tracking-wider"
                    >
                      {{ t("client.meeting_title") }}
                    </p>
                    <p class="font-medium text-dark">
                      {{
                        project.quote.meeting_date
                          ? formatDate(project.quote.meeting_date)
                            + (project.quote.meeting_time
                              ? ` — ${project.quote.meeting_time}`
                              : "")
                          : t("client.meeting_none")
                      }}
                    </p>
                  </div>
                </div>
                <button
                  @click="scheduleModalOpen = true"
                  class="px-4 py-2 rounded-full bg-dark text-cream
                    text-sm font-semibold transition-all
                    hover:bg-dark/80 flex items-center gap-2"
                >
                  <IconLucid name="CalendarClock" size="xs" />
                  {{
                    project.quote.meeting_date
                      ? t("client.meeting_reschedule")
                      : t("client.meeting_schedule")
                  }}
                </button>
              </div>
            </div>

            <!-- Timeline -->
            <div
              class="rounded-[1.5rem] border-2
                border-dark/10 p-6 md:p-8 mb-10"
            >
              <h2
                class="font-heading text-sm text-dark/50
                  uppercase tracking-wider mb-6"
              >
                {{ t("client.project_timeline") }}
              </h2>
              <ProjectTimeline
                :status="project.quote.status"
                :hasMoodboard="
                  project.counts.moodboard > 0
                "
                :hasProposalAccepted="
                  project.latestProposal?.status ===
                  'accepted'
                "
              />
            </div>

            <!-- Quick links -->
            <div
              class="grid grid-cols-1 md:grid-cols-3
                gap-4"
            >
              <NuxtLink
                :to="
                  localePath('/mon-projet/inspirations')
                "
                class="rounded-[1.5rem] border-2
                  border-dark/10 p-5 hover:bg-cream/50
                  transition-colors group"
              >
                <div
                  class="flex items-center justify-between"
                >
                  <div class="flex items-center gap-3">
                    <div
                      class="w-9 h-9 rounded-full bg-cream
                        flex items-center justify-center"
                    >
                      <IconLucid
                        name="ImagePlus"
                        size="sm"
                        class="text-dark/40"
                      />
                    </div>
                    <div>
                      <p class="font-medium text-dark">
                        {{
                          t("client.nav_inspirations")
                        }}
                      </p>
                      <p class="text-xs text-dark/40">
                        {{ project.counts.inspirations }}
                        {{ t("client.project_photos") }}
                      </p>
                    </div>
                  </div>
                  <IconLucid
                    name="ChevronRight"
                    size="sm"
                    class="text-dark/20
                      group-hover:text-dark/50
                      transition-colors"
                  />
                </div>
              </NuxtLink>
              <NuxtLink
                :to="localePath('/mon-projet/moodboard')"
                class="rounded-[1.5rem] border-2
                  border-dark/10 p-5 hover:bg-cream/50
                  transition-colors group"
              >
                <div
                  class="flex items-center justify-between"
                >
                  <div class="flex items-center gap-3">
                    <div
                      class="w-9 h-9 rounded-full bg-cream
                        flex items-center justify-center"
                    >
                      <IconLucid
                        name="Palette"
                        size="sm"
                        class="text-dark/40"
                      />
                    </div>
                    <div>
                      <p class="font-medium text-dark">
                        {{ t("client.nav_moodboard") }}
                      </p>
                      <p class="text-xs text-dark/40">
                        {{ project.counts.moodboard }}
                        {{ t("client.project_items") }}
                      </p>
                    </div>
                  </div>
                  <IconLucid
                    name="ChevronRight"
                    size="sm"
                    class="text-dark/20
                      group-hover:text-dark/50
                      transition-colors"
                  />
                </div>
              </NuxtLink>
              <NuxtLink
                :to="
                  localePath('/mon-projet/proposition')
                "
                class="rounded-[1.5rem] border-2
                  border-dark/10 p-5 hover:bg-cream/50
                  transition-colors group"
              >
                <div
                  class="flex items-center justify-between"
                >
                  <div class="flex items-center gap-3">
                    <div
                      class="w-9 h-9 rounded-full bg-cream
                        flex items-center justify-center"
                    >
                      <IconLucid
                        name="FileCheck"
                        size="sm"
                        class="text-dark/40"
                      />
                    </div>
                    <div>
                      <p class="font-medium text-dark">
                        {{ t("client.nav_proposal") }}
                      </p>
                      <p class="text-xs text-dark/40">
                        {{
                          project.latestProposal
                            ? t(
                                `client.proposal_status_${project.latestProposal.status}`
                              )
                            : t(
                                "client.proposal_empty_short"
                              )
                        }}
                      </p>
                    </div>
                  </div>
                  <IconLucid
                    name="ChevronRight"
                    size="sm"
                    class="text-dark/20
                      group-hover:text-dark/50
                      transition-colors"
                  />
                </div>
              </NuxtLink>
            </div>
          </template>
        </div>
      </div>
    </section>

    <!-- Schedule modal -->
    <ScheduleModal
      :isOpen="scheduleModalOpen"
      @close="scheduleModalOpen = false"
      @confirmed="handleMeetingConfirmed"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  ssr: false,
  layout: "client",
  middleware: ["auth-client"],
});

const { t } = useI18n();
const localePath = useLocalePath();
const user = useSupabaseUser();
const router = useRouter();
const { clientFetch } = useClientFetch();

useHead({
  title: t("client.page_title") + " - Boticia",
});

watch(
  user,
  (val) => {
    if (val === null) {
      router.push(localePath("/login"));
    }
  },
  { immediate: true }
);

const loading = ref(true);
const project = ref<any>(null);
const scheduleModalOpen = ref(false);

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const handleMeetingConfirmed = async (data: {
  date: string;
  time: string;
  displayDate: string;
}) => {
  try {
    await clientFetch("/api/client/meeting", {
      method: "PATCH",
      body: { date: data.date, time: data.time },
    });
    if (project.value?.quote) {
      project.value.quote.meeting_date = data.date;
      project.value.quote.meeting_time = data.time;
    }
  } catch (err) {
    console.error("Error updating meeting:", err);
  }
};

onMounted(async () => {
  try {
    const res = await clientFetch<{
      success: boolean;
      data: any;
    }>("/api/client/project");
    project.value = res.data;
  } catch (err) {
    console.error("Error loading project:", err);
  } finally {
    loading.value = false;
  }
});
</script>
