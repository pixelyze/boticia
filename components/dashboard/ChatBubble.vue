<template>
  <!-- Floating button -->
  <button
    @click="open = true"
    class="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-dark text-cream flex items-center justify-center shadow-lg hover:bg-dark/90 transition-all"
  >
    <IconLucid name="MessageSquare" size="md" />
    <span
      v-if="unreadCount > 0"
      class="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-fuchsia-500 text-white text-xs flex items-center justify-center font-bold"
    >
      {{ unreadCount }}
    </span>
  </button>

  <!-- Chat panel -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-4"
    >
      <div
        v-if="open"
        class="fixed bottom-24 left-6 z-[60] w-[360px] max-h-[500px] bg-white rounded-2xl shadow-2xl border border-dark/10 flex flex-col overflow-hidden"
      >
        <!-- Header -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-dark/5">
          <div>
            <h3 class="font-heading font-bold text-dark">{{ t("chat.title") }}</h3>
            <p class="text-xs text-dark/40">{{ t("chat.subtitle") }}</p>
          </div>
          <button
            @click="open = false"
            class="w-8 h-8 rounded-full hover:bg-cream flex items-center justify-center"
          >
            <IconLucid name="X" size="xs" class="text-gray-500" />
          </button>
        </div>

        <!-- Messages -->
        <div
          ref="messagesContainer"
          class="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-[200px] max-h-[320px]"
        >
          <div v-if="loading" class="text-center py-8">
            <IconLucid name="Loader2" size="sm" class="animate-spin mx-auto text-gray-300" />
          </div>

          <div v-else-if="messages.length === 0" class="text-center py-8">
            <p class="text-dark/30 text-sm">{{ t("chat.empty") }}</p>
          </div>

          <template v-else>
            <div
              v-for="msg in messages"
              :key="msg.id"
              class="flex"
              :class="msg.sender_type === 'admin' ? 'justify-end' : 'justify-start'"
            >
              <div
                class="max-w-[80%] rounded-2xl px-4 py-2.5"
                :class="msg.sender_type === 'admin'
                  ? 'bg-dark text-cream rounded-br-md'
                  : 'bg-cream text-dark rounded-bl-md'"
              >
                <p class="text-sm leading-relaxed whitespace-pre-wrap">{{ msg.message }}</p>
                <div class="flex items-center gap-2 mt-1">
                  <span
                    class="text-[10px]"
                    :class="msg.sender_type === 'admin' ? 'text-cream/40' : 'text-dark/30'"
                  >
                    {{ msg.sender_name }} · {{ formatTime(msg.created_at) }}
                  </span>
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- Input -->
        <div class="px-4 py-3 border-t border-dark/5">
          <form @submit.prevent="sendMessage" class="flex gap-2">
            <input
              v-model="newMessage"
              :placeholder="t('chat.placeholder')"
              class="flex-1 px-4 py-2.5 rounded-full bg-cream text-sm border-0 outline-none placeholder:text-dark/30"
              :disabled="sending"
            />
            <button
              type="submit"
              :disabled="!newMessage.trim() || sending"
              class="w-10 h-10 rounded-full bg-dark text-cream flex items-center justify-center shrink-0 disabled:opacity-30 transition-opacity"
            >
              <IconLucid name="Send" size="xs" />
            </button>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const { t } = useI18n();
const { adminFetch } = useAdminFetch();

const open = ref(false);
const loading = ref(true);
const sending = ref(false);
const newMessage = ref("");
const messages = ref<any[]>([]);
const messagesContainer = ref<HTMLElement | null>(null);

const unreadCount = computed(() =>
  messages.value.filter((m) => m.sender_type === "dev" && !m.is_read).length
);

const fetchMessages = async () => {
  try {
    const res = await adminFetch<{ success: boolean; data: any[] }>("/api/chat");
    messages.value = res.data;
  } catch (err) {
    console.error("Error fetching chat:", err);
  } finally {
    loading.value = false;
  }
};

const sendMessage = async () => {
  if (!newMessage.value.trim() || sending.value) return;
  sending.value = true;
  try {
    await adminFetch("/api/chat", {
      method: "POST",
      body: { message: newMessage.value.trim() },
    });
    newMessage.value = "";
    await fetchMessages();
    scrollToBottom();
  } catch (err) {
    console.error("Error sending:", err);
  } finally {
    sending.value = false;
  }
};

const markAsRead = async () => {
  try {
    await adminFetch("/api/chat/read", {
      method: "POST",
      body: { sender_type: "admin" },
    });
  } catch {
    // silent
  }
};

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

const formatTime = (dateStr: string) => {
  const d = new Date(dateStr);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) {
    return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  }
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" }) +
    " " + d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
};

watch(open, async (isOpen) => {
  if (isOpen) {
    await fetchMessages();
    await markAsRead();
    scrollToBottom();
  }
});

onMounted(() => {
  fetchMessages();
  // Poll every 30s for new messages
  const interval = setInterval(fetchMessages, 30000);
  onUnmounted(() => clearInterval(interval));
});
</script>
