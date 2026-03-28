<template>
  <div class="flex-1 flex flex-col bg-white">
    <section class="pt-4 pb-12 md:pt-6 md:pb-16">
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
              class="animate-spin mx-auto text-gray-300"
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
                    couple: project.quote.partner2_name
                      ? `${project.quote.partner1_name} & ${project.quote.partner2_name}`
                      : project.quote.partner1_name,
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
                      class="text-gray-400"
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
                      class="text-gray-400"
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
                <div class="flex items-start gap-3">
                  <div
                    class="w-9 h-9 rounded-full bg-cream
                      flex items-center justify-center
                      shrink-0 mt-0.5"
                  >
                    <IconLucid
                      name="Flower2"
                      size="sm"
                      class="text-gray-400"
                    />
                  </div>
                  <div>
                    <p
                      class="text-xs text-dark/40
                        uppercase tracking-wider mb-1"
                    >
                      {{ t("client.project_services") }}
                    </p>
                    <ul
                      v-if="project.quote.floral_needs?.length"
                      class="space-y-0.5"
                    >
                      <li
                        v-for="need in project.quote.floral_needs"
                        :key="need"
                        class="text-sm font-medium text-dark"
                      >
                        {{ t(`quote_form.need_${need}`) }}
                      </li>
                    </ul>
                    <p v-else class="text-sm font-medium text-dark">
                      {{ t("client.project_tbd") }}
                    </p>
                  </div>
                </div>
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
                :meetingDate="project.quote.meeting_date"
                :meetingTime="project.quote.meeting_time"
              />
            </div>
          </template>
        </div>
      </div>
    </section>

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
const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
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
