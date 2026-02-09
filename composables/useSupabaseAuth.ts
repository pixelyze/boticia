import type { User } from '@supabase/supabase-js';

export const useSupabaseAuth = () => {
  const { getClient } = useSupabase();
  const { locale } = useI18n();

  const user = useState<User | null>('supabase-user', () => null);
  const isLoading = useState<boolean>('supabase-loading', () => true);

  const sendMagicLink = async (email: string): Promise<{ success: boolean; error?: string }> => {
    const client = getClient();
    if (!client) return { success: false, error: 'Client not available' };

    try {
      const redirectUrl = `${window.location.origin}/${locale.value}/dashboard/callback`;

      const { error } = await client.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) {
        console.error('Error sending magic link:', error.message);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err) {
      console.error('Error:', err);
      return { success: false, error: 'An error occurred' };
    }
  };

  const getSession = async () => {
    const client = getClient();
    if (!client) {
      isLoading.value = false;
      return null;
    }

    try {
      const { data: { session }, error } = await client.auth.getSession();

      if (error) {
        console.error('Error getting session:', error.message);
        return null;
      }

      user.value = session?.user ?? null;
      return session;
    } catch (err) {
      console.error('Error:', err);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  const signOut = async (): Promise<boolean> => {
    const client = getClient();
    if (!client) return false;

    try {
      const { error } = await client.auth.signOut();

      if (error) {
        console.error('Error signing out:', error.message);
        return false;
      }

      user.value = null;
      return true;
    } catch (err) {
      console.error('Error:', err);
      return false;
    }
  };

  const initAuthListener = () => {
    const client = getClient();
    if (!client) return;

    client.auth.onAuthStateChange((event, session) => {
      user.value = session?.user ?? null;
      isLoading.value = false;
    });
  };

  return {
    user: readonly(user),
    isLoading: readonly(isLoading),
    isAuthenticated: computed(() => !!user.value),
    sendMagicLink,
    getSession,
    signOut,
    initAuthListener,
    getClient,
  };
};
