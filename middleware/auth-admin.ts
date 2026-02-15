/**
 * Middleware d'authentification pour l'admin CMS
 * Protège les routes /admin/cms
 */

export default defineNuxtRouteMiddleware(async (to, from) => {
  // Côté client uniquement
  if (process.server) return;

  const supabase = useSupabaseClient();
  const user = useSupabaseUser();

  // Vérifier si l'utilisateur est connecté
  if (!user.value) {
    // Sauvegarder la route demandée pour redirection après login
    const redirectTo = to.fullPath;

    return navigateTo({
      path: "/login",
      query: { redirect: redirectTo },
    });
  }

  // TODO: Vérifier le rôle admin dans la base de données
  // const { data: profile } = await supabase
  //   .from('profiles')
  //   .select('role')
  //   .eq('id', user.value.id)
  //   .single();
  //
  // if (profile?.role !== 'admin') {
  //   return navigateTo('/');
  // }
});
