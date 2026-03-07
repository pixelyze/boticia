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
    enterActiveClass: "modal-slide-enter",
    enterFromClass: "translate-y-full",
    enterToClass: "translate-y-0",
    leaveActiveClass: "modal-slide-leave",
    leaveFromClass: "translate-y-0",
    leaveToClass: "translate-y-full",
  };

  // Classes CSS pour l'animation initiale (plus utilisé, la Transition Vue suffit)
  const initialAnimationClass = {};

  return {
    overlayTransition,
    contentTransition,
    initialAnimationClass,
  };
};
