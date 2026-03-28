<template>
  <div class="min-h-screen bg-cream-light flex flex-col">
    <!-- Auth screen -->
    <div v-if="!authenticated" class="flex-1 flex items-center justify-center px-6">
      <div class="max-w-sm w-full text-center">
        <h1 class="font-heading text-2xl font-bold mb-2">Brutal Studio</h1>
        <p class="text-dark/40 mb-6">Chat support Boticia</p>
        <form @submit.prevent="login" class="space-y-4">
          <input
            v-model="token"
            type="password"
            placeholder="Token d'accès"
            class="w-full px-5 py-3 rounded-xl bg-white border border-dark/10 text-sm"
          />
          <button
            type="submit"
            class="w-full px-5 py-3 rounded-full bg-dark text-cream text-sm font-semibold"
          >
            Se connecter
          </button>
          <p v-if="authError" class="text-red-500 text-sm">Token invalide</p>
        </form>
      </div>
    </div>

    <!-- Chat screen -->
    <template v-else>
      <!-- Header -->
      <header class="bg-white border-b border-dark/5 px-6 py-4">
        <div class="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <h1 class="font-heading text-lg font-bold">Boticia · Support</h1>
            <p class="text-xs text-dark/40">Chat avec Laëtitia</p>
          </div>
          <span class="text-xs text-dark/30">Brutal Studio</span>
        </div>
      </header>

      <!-- Messages -->
      <div
        ref="messagesContainer"
        class="flex-1 overflow-y-auto px-6 py-6"
      >
        <div class="max-w-2xl mx-auto space-y-3">
          <div v-if="loading" class="text-center py-16">
            <div class="w-8 h-8 border-2 border-dark/10 border-t-dark/40 rounded-full animate-spin mx-auto"></div>
          </div>

          <div v-else-if="messages.length === 0" class="text-center py-16">
            <p class="text-dark/30">Aucun message</p>
          </div>

          <template v-else>
            <!-- Date separators + messages -->
            <template v-for="(msg, i) in messages" :key="msg.id">
              <div
                v-if="i === 0 || !sameDay(messages[i-1].created_at, msg.created_at)"
                class="text-center"
              >
                <span class="text-xs text-dark/25 bg-cream-light px-3 py-1 rounded-full">
                  {{ formatDate(msg.created_at) }}
                </span>
              </div>

              <div
                class="flex"
                :class="msg.sender_type === 'dev' ? 'justify-end' : 'justify-start'"
              >
                <div
                  class="max-w-[70%] rounded-2xl px-4 py-3"
                  :class="msg.sender_type === 'dev'
                    ? 'bg-dark text-cream rounded-br-md'
                    : 'bg-white text-dark rounded-bl-md shadow-sm'"
                >
                  <p class="text-sm leading-relaxed whitespace-pre-wrap">{{ msg.message }}</p>
                  <div class="flex items-center gap-2 mt-1">
                    <span
                      class="text-[10px]"
                      :class="msg.sender_type === 'dev' ? 'text-cream/40' : 'text-dark/25'"
                    >
                      {{ msg.sender_name }} · {{ formatTime(msg.created_at) }}
                    </span>
                  </div>
                </div>
              </div>
            </template>
          </template>
        </div>
      </div>

      <!-- Input -->
      <div class="bg-white border-t border-dark/5 px-6 py-4">
        <form @submit.prevent="sendMessage" class="max-w-2xl mx-auto flex gap-3">
          <input
            v-model="newMessage"
            placeholder="Répondre..."
            class="flex-1 px-5 py-3 rounded-full bg-cream text-sm border-0 outline-none placeholder:text-dark/30"
            :disabled="sending"
          />
          <button
            type="submit"
            :disabled="!newMessage.trim() || sending"
            class="px-6 py-3 rounded-full bg-dark text-cream text-sm font-semibold disabled:opacity-30 transition-opacity"
          >
            Envoyer
          </button>
        </form>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false, ssr: false });

const route = useRoute();
const authenticated = ref(false);
const token = ref("");
const authError = ref(false);
const loading = ref(true);
const sending = ref(false);
const newMessage = ref("");
const messages = ref<any[]>([]);
const messagesContainer = ref<HTMLElement | null>(null);

// Auto-login if token in URL
onMounted(() => {
  const urlToken = route.query.token as string;
  if (urlToken) {
    token.value = urlToken;
    login();
  }
});

const login = async () => {
  authError.value = false;
  try {
    const res = await $fetch<{ success: boolean; data: any[] }>("/api/chat", {
      params: { token: token.value },
    });
    authenticated.value = true;
    messages.value = res.data;
    loading.value = false;
    markAsRead();
    scrollToBottom();
    // Start polling
    const interval = setInterval(fetchMessages, 10000);
    onUnmounted(() => clearInterval(interval));
  } catch {
    authError.value = true;
  }
};

const fetchMessages = async () => {
  try {
    const res = await $fetch<{ success: boolean; data: any[] }>("/api/chat", {
      params: { token: token.value },
    });
    messages.value = res.data;
  } catch {
    // silent
  }
};

const sendMessage = async () => {
  if (!newMessage.value.trim() || sending.value) return;
  sending.value = true;
  try {
    await $fetch("/api/chat", {
      method: "POST",
      body: {
        message: newMessage.value.trim(),
        token: token.value,
        sender_name: "Brutal Studio",
      },
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
    await $fetch("/api/chat/read", {
      method: "POST",
      body: { token: token.value, sender_type: "dev" },
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
  return new Date(dateStr).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
};

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) return "Aujourd'hui";
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return "Hier";
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
};

const sameDay = (a: string, b: string) =>
  new Date(a).toDateString() === new Date(b).toDateString();
</script>
