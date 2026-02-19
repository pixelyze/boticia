/**
 * Composable pour les appels API client authentifies
 * Ajoute automatiquement le token JWT Supabase aux requetes
 */
export const useClientFetch = () => {
  const client = useSupabaseClient();

  /**
   * Fetch avec authentification client
   * Ajoute le header Authorization avec le token JWT
   */
  const clientFetch = async <T>(
    url: string,
    options: Parameters<typeof $fetch>[1] = {}
  ): Promise<T> => {
    const {
      data: { session },
    } = await client.auth.getSession();

    if (!session?.access_token) {
      throw new Error("Non authentifie");
    }

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
    clientFetch,
  };
};
