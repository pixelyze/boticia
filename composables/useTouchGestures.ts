import { ref } from "vue";
import type { Ref } from "vue";

// Constantes pour les positions des modales
const TRANSFORM_NORMAL = 0; // Position normale
const TRANSFORM_FULLSCREEN = 0; // Position légèrement remontée (en pixels) - réduite à -20px pour être plus sûr
const TRANSFORM_CLOSED = 100; // Position fermée (en pourcentage)

/**
 * Composable pour gérer les gestes tactiles et le comportement swipeable des éléments
 * @param modalRef Référence à l'élément modal
 * @param onClose Fonction à appeler lorsque l'utilisateur ferme la modale par swipe
 * @returns Méthodes et état pour gérer les interactions tactiles
 */
export const useTouchGestures = (
  modalRef: Ref<HTMLElement | null>,
  onClose: () => void
) => {
  // État pour les interactions tactiles
  const touchStart = ref(0);
  const touchMove = ref(0);
  const touchVelocity = ref(0);
  const lastTouchTime = ref(0);
  const isFullScreen = ref(false); // État indiquant si la modale est en mode plein écran
  const isSwiping = ref(false);

  /**
   * Gère le début d'un geste tactile
   */
  const onTouchStart = (e: TouchEvent) => {
    touchStart.value = e.touches[0].clientY;
    lastTouchTime.value = Date.now();
    touchVelocity.value = 0;
    isSwiping.value = true;
  };

  /**
   * Gère le mouvement lors d'un geste tactile
   */
  const onTouchMove = (e: TouchEvent) => {
    if (!isSwiping.value || touchStart.value === 0) return;

    e.preventDefault();

    // Calcul de la vélocité
    const currentY = e.touches[0].clientY;
    const currentTime = Date.now();
    if (lastTouchTime.value > 0) {
      const timeDiff = currentTime - lastTouchTime.value;
      if (timeDiff > 0) {
        touchVelocity.value = (currentY - touchMove.value) / timeDiff;
      }
    }

    touchMove.value = currentY;
    lastTouchTime.value = currentTime;

    // Transformation en temps réel
    const diff = touchMove.value - touchStart.value;
    const element = modalRef.value;

    if (element) {
      // Approche simplifiée avec une limite stricte
      if (diff <= TRANSFORM_FULLSCREEN) {
        // Si on dépasse la limite haute, bloquer strictement à TRANSFORM_FULLSCREEN
        element.style.transform = `translateY(${TRANSFORM_FULLSCREEN}px)`;
      } else {
        // Sinon appliquer le mouvement normalement
        element.style.transform = `translateY(${diff}px)`;
      }
      element.style.transition = "none";
    }
  };

  /**
   * Gère la fin d'un geste tactile
   */
  const onTouchEnd = () => {
    if (!isSwiping.value || touchStart.value === 0) return;

    const diff = touchMove.value - touchStart.value;
    const element = modalRef.value;

    // Vitesse en pixels par milliseconde
    const velocity = touchVelocity.value;
    const isQuickSwipeUp = velocity < -0.4; // Swipe rapide vers le haut
    const isQuickSwipeDown = velocity > 0.3; // Swipe rapide vers le bas

    if (element) {
      // Toujours rétablir la transition pour l'animation finale
      element.style.transition = "transform 0.3s ease-out";

      // Utiliser une valeur limitée du diff pour les calculs suivants
      const limitedDiff = Math.max(diff, TRANSFORM_FULLSCREEN);

      // Prioriser la vélocité sur la position absolue
      if (isQuickSwipeUp && !isFullScreen.value) {
        // Passer en mode plein écran, mais jamais au-delà de TRANSFORM_FULLSCREEN
        element.style.transform = `translateY(${TRANSFORM_FULLSCREEN}px)`;
        isFullScreen.value = true;
      }
      // Si le swipe final est rapidement vers le bas, fermer la modale
      else if (isQuickSwipeDown) {
        element.style.transform = `translateY(${TRANSFORM_CLOSED}%)`;
        setTimeout(() => {
          onClose();
        }, 300);
      }
      // Si pas de swipe rapide, se baser sur la position
      else if (limitedDiff > element.clientHeight * 0.2 && !isQuickSwipeUp) {
        // Déplacement suffisant vers le bas et pas de swipe rapide vers le haut -> fermer
        element.style.transform = `translateY(${TRANSFORM_CLOSED}%)`;
        setTimeout(() => {
          onClose();
        }, 300);
      } else if (
        limitedDiff < -element.clientHeight * 0.1 &&
        !isFullScreen.value
      ) {
        // Déplacement suffisant vers le haut pour passer en plein écran
        // Mais jamais au-delà de TRANSFORM_FULLSCREEN
        element.style.transform = `translateY(${TRANSFORM_FULLSCREEN}px)`;
        isFullScreen.value = true;
      } else {
        // Retour à la position normale
        element.style.transform = `translateY(${TRANSFORM_NORMAL}px)`;
        isFullScreen.value = false;
      }
    }

    // Réinitialiser les valeurs
    touchStart.value = 0;
    touchMove.value = 0;
    isSwiping.value = false;
  };

  return {
    touchStart,
    touchMove,
    touchVelocity,
    isFullScreen,
    isSwiping,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
};
