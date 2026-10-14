/**
 * useAuthRedirect
 *
 * Après une connexion (lien magique ou code à 6 chiffres), envoie chacun
 * au bon endroit : l'admin vers le tableau de bord (ou la destination
 * demandée avant la connexion), la cliente vers son espace projet.
 */
export function useAuthRedirect() {
  const route = useRoute();
  const router = useRouter();
  const { locale } = useI18n();

  // Destination demandée avant la connexion (ex : la fiche devis du lien
  // magique). Validée pour éviter toute redirection hors du site.
  const redirectTarget = computed(() =>
    safeRedirectPath(route.query.redirect)
  );

  /**
   * Redirige selon le rôle de la personne connectée.
   * Renvoie false si l'adresse n'a ni profil admin ni projet.
   */
  async function redirectByRole(): Promise<boolean> {
    try {
      const { role } = await $fetch<{ role: string }>("/api/user/role");

      if (role === "admin") {
        await router.replace(
          redirectTarget.value || `/${locale.value}/dashboard`
        );
        return true;
      }
      if (role === "client") {
        await router.replace(`/${locale.value}/mon-projet`);
        return true;
      }
      return false;
    } catch {
      await router.replace(`/${locale.value}/dashboard`);
      return true;
    }
  }

  return { redirectTarget, redirectByRole };
}
