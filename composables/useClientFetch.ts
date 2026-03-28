/**
 * Composable pour les appels API client authentifies
 * Ajoute automatiquement le token JWT Supabase aux requetes
 */
export const useClientFetch = () => {
  const session = useSupabaseSession();

  /**
   * Fetch avec authentification client
   * Ajoute le header Authorization avec le token JWT
   */
  const clientFetch = async <T>(
    url: string,
    options: Parameters<typeof $fetch>[1] = {}
  ): Promise<T> => {
    const token = session.value?.access_token;

    if (!token) {
      throw new Error("Non authentifie");
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
    clientFetch,
  };
};
