/**
 * Composable pour les appels API admin authentifiés
 * Ajoute automatiquement le token JWT Supabase aux requêtes
 */
export const useAdminFetch = () => {
  const { getClient } = useSupabaseAuth();

  /**
   * Fetch avec authentification admin
   * Ajoute le header Authorization avec le token JWT
   */
  const adminFetch = async <T>(
    url: string,
    options: Parameters<typeof $fetch>[1] = {}
  ): Promise<T> => {
    const client = getClient();

    if (!client) {
      throw new Error('Client Supabase non disponible');
    }

    // Récupérer la session et le token
    const { data: { session } } = await client.auth.getSession();

    if (!session?.access_token) {
      throw new Error('Non authentifié');
    }

    // Ajouter le header Authorization
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${session.access_token}`,
    };

    return $fetch<T>(url, {
      ...options,
      headers,
    });
  };

  return {
    adminFetch,
  };
};
