export const HERO_DEFAULT_IMAGE = "/bouquet_mariee_boticia._1.webp";

/**
 * Photo du hero de l'accueil, choisie dans le tableau de bord.
 * Partagée avec la carte devis du menu mobile : la clé commune évite
 * un second appel quand les deux sont sur la même page.
 */
export const useHeroImage = () => {
  const { data } = useFetch<{ data?: { value?: { url?: string } } }>(
    "/api/cms/config",
    { key: "hero-image", params: { key: "hero_image" } },
  );
  return computed(() => data.value?.data?.value?.url || HERO_DEFAULT_IMAGE);
};
