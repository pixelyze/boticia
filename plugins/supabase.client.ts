/**
 * Plugin pour initialiser et maintenir la session Supabase
 */

export default defineNuxtPlugin(async () => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();

  // Restaurer la session au chargement de la page
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.user) {
    user.value = session.user;
  }

  // Écouter les changements d'état d'authentification
  supabase.auth.onAuthStateChange((_event, session) => {
    user.value = session?.user ?? null;
  });
});
