/**
 * Middleware d'authentification pour le portail client
 * Protege les routes /mon-projet/*
 */

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.server) return;

  const localePath = useLocalePath();
  const user = useSupabaseUser();

  if (!user.value) {
    const redirectTo = to.fullPath;

    return navigateTo({
      path: localePath("/login"),
      query: { redirect: redirectTo },
    });
  }
});
