<template>
  <div class="flex-1 flex flex-col bg-white">
    <section class="py-12 md:py-16">
      <div class="px-4 md:px-10">
        <div
          class="rounded-[2rem] border-2 border-dark/10
            p-8 md:p-10"
        >
          <!-- Header -->
          <div class="mb-8">
            <h1 class="text-2xl md:text-3xl font-bold">
              {{ t("client.proposal_title") }}
            </h1>
          </div>

          <!-- Loading -->
          <div v-if="loading" class="py-16 text-center">
            <IconLucid
              name="Loader2"
              size="lg"
              class="animate-spin mx-auto text-dark/30"
            />
          </div>

          <template v-else>
            <template v-if="proposal">
              <!-- Proposal card -->
              <ProposalCard
                :proposal="proposal"
                class="mb-6"
              />

              <!-- Response section -->
              <ProposalResponse
                v-if="canRespond"
                :accepting="accepting"
                :requesting="requesting"
                @accept="handleAccept"
                @revision="handleRevision"
              />

              <!-- Accepted message -->
              <div
                v-if="proposal.status === 'accepted'"
                class="rounded-[1.5rem] border-2
                  border-green-200 bg-green-50 p-6
                  text-center"
              >
                <IconLucid
                  name="CheckCircle"
                  size="lg"
                  class="mx-auto text-green-500 mb-3"
                />
                <p
                  class="font-medium text-green-800"
                >
                  {{
                    t("client.proposal_accepted_message")
                  }}
                </p>
              </div>
            </template>

            <!-- Empty state -->
            <div
              v-else
              class="py-16 text-center"
            >
              <IconLucid
                name="FileCheck"
                size="lg"
                class="mx-auto text-dark/20 mb-4"
              />
              <p class="text-dark/40 max-w-sm mx-auto">
                {{ t("client.proposal_empty") }}
              </p>
            </div>
          </template>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { ProjectProposal } from "~/server/utils/client-portal-types";

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
  title: t("client.proposal_title") + " - Boticia",
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
const accepting = ref(false);
const requesting = ref(false);
const proposal = ref<ProjectProposal | null>(null);

const canRespond = computed(() => {
  if (!proposal.value) return false;
  return ["pending", "viewed"].includes(
    proposal.value.status
  );
});

const handleAccept = async () => {
  accepting.value = true;
  try {
    const res = await clientFetch<{
      success: boolean;
      data: ProjectProposal;
    }>("/api/client/proposal", {
      method: "PATCH",
      body: { action: "accept" },
    });
    proposal.value = res.data;
  } catch (err) {
    console.error("Error accepting:", err);
  } finally {
    accepting.value = false;
  }
};

const handleRevision = async (comment: string) => {
  requesting.value = true;
  try {
    const res = await clientFetch<{
      success: boolean;
      data: ProjectProposal;
    }>("/api/client/proposal", {
      method: "PATCH",
      body: { action: "revision", comment },
    });
    proposal.value = res.data;
  } catch (err) {
    console.error("Error requesting revision:", err);
  } finally {
    requesting.value = false;
  }
};

onMounted(async () => {
  try {
    const res = await clientFetch<{
      success: boolean;
      data: ProjectProposal | null;
    }>("/api/client/proposal");
    proposal.value = res.data;
  } catch (err) {
    console.error("Error loading proposal:", err);
  } finally {
    loading.value = false;
  }
});
</script>
