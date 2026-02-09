/**
 * Composable pour gérer les transitions des modales
 * Fournit des classes de transition cohérentes pour les différentes parties des modales
 */
export const useModalTransitions = () => {
  // Transition pour l'overlay (fond avec blur)
  const overlayTransition = {
    appear: true,
    enterActiveClass: "transition-opacity duration-300 ease-out",
    enterFromClass: "opacity-0",
    enterToClass: "opacity-100",
    leaveActiveClass: "transition-opacity duration-200 ease-in",
    leaveFromClass: "opacity-100",
    leaveToClass: "opacity-0",
  };

  // Transition pour le contenu de la modale (slide up/down)
  const contentTransition = {
    appear: true,
    enterActiveClass: "transition-transform duration-140 ease-out",
    enterFromClass: "translate-y-full",
    enterToClass: "translate-y-0",
    leaveActiveClass: "transition-transform duration-120 ease-in",
    leaveFromClass: "translate-y-0",
    leaveToClass: "translate-y-full",
  };

  // Classes CSS pour l'animation initiale (utilisée avec v-bind)
  const initialAnimationClass = {
    "animate-slide-up": true,
  };

  return {
    overlayTransition,
    contentTransition,
    initialAnimationClass,
  };
};
