import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Singleton pour le client Supabase côté client
let supabaseClient: SupabaseClient | null = null;

export const useSupabase = () => {
  const config = useRuntimeConfig();

  const getClient = (): SupabaseClient | null => {
    // Côté serveur, ne pas créer de client
    if (import.meta.server) {
      return null;
    }

    // Réutiliser le client existant
    if (supabaseClient) {
      return supabaseClient;
    }

    const url = config.public.supabaseUrl || config.public.supabase?.url;
    const key = config.public.supabaseKey || config.public.supabase?.key;

    if (!url || !key) {
      console.error('Variables Supabase manquantes');
      return null;
    }

    supabaseClient = createClient(url as string, key as string);
    return supabaseClient;
  };

  const getSession = async () => {
    const client = getClient();
    if (!client) return null;

    const { data: { session } } = await client.auth.getSession();
    return session;
  };

  const getAccessToken = async () => {
    const session = await getSession();
    return session?.access_token || null;
  };

  return {
    getClient,
    getSession,
    getAccessToken,
  };
};
