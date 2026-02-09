import { ref, onMounted, onUnmounted } from "vue";

/**
 * Composable pour gérer l'état et les actions d'une fenêtre modale
 * @returns Objet contenant l'état et les méthodes pour manipuler la modale
 */
export const useModal = () => {
  // État de la modale (ouverte/fermée)
  const isOpen = ref(false);

  // État pour gérer les transitions
  const showModal = ref(false);

  /**
   * Empêche le défilement du body
   */
  const preventBodyScroll = () => {
    if (typeof window !== "undefined") {
      document.body.style.overflow = "hidden";
    }
  };

  /**
   * Réactive le défilement du body
   */
  const enableBodyScroll = () => {
    if (typeof window !== "undefined") {
      document.body.style.overflow = "auto";
    }
  };

  /**
   * Méthode pour ouvrir la modale
   */
  const open = () => {
    preventBodyScroll();
    isOpen.value = true;
    showModal.value = true;
  };

  /**
   * Méthode pour fermer la modale
   */
  const close = () => {
    showModal.value = false;
    // isOpen sera mis à false après la transition via onTransitionComplete
  };

  /**
   * Méthode appelée à la fin de la transition de fermeture
   */
  const onTransitionComplete = () => {
    if (!showModal.value) {
      isOpen.value = false;
      enableBodyScroll();
    }
  };

  // Nettoyage lors du démontage du composant
  onUnmounted(() => {
    enableBodyScroll();
  });

  return {
    isOpen,
    showModal,
    open,
    close,
    onTransitionComplete,
    preventBodyScroll,
    enableBodyScroll,
  };
};
