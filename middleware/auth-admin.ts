/**
 * Middleware d'authentification admin
 * Protège les routes /admin et /dashboard
 */

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.server) return;

  const user = useSupabaseUser();

  if (!user.value) {
    return navigateTo({
      path: "/login",
      query: { redirect: to.fullPath },
    });
  }

  try {
    const { role } = await $fetch<{
      role: string;
      isAdmin: boolean;
    }>("/api/user/role", {
      params: { email: user.value.email },
    });

    if (role === "client") {
      return navigateTo("/mon-projet");
    }
    if (role !== "admin") {
      return navigateTo("/login");
    }
  } catch (err) {
    console.error("Error checking admin role:", err);
    return navigateTo("/");
  }
});
