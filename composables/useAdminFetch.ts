/**
 * Composable pour les appels API admin authentifiés
 * Ajoute automatiquement le token JWT Supabase aux requêtes
 */
export const useAdminFetch = () => {
  const session = useSupabaseSession();

  /**
   * Fetch avec authentification admin
   * Ajoute le header Authorization avec le token JWT
   */
  const adminFetch = async <T>(
    url: string,
    options: Parameters<typeof $fetch>[1] = {}
  ): Promise<T> => {
    const token = session.value?.access_token;

    if (!token) {
      throw new Error('Non authentifié');
    }

    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
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
