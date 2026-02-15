/**
 * Composable Boticia UI Design System
 * Centralise les tokens et utilitaires du design system
 */

export const useBoticia = () => {
  /**
   * Tokens de design Boticia
   */
  const tokens = {
    colors: {
      cream: "#F5F3EE",
      dark: "#2B2B2B",
    },

    shadows: {
      standard: "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
      hover: "shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
      active: "shadow-none",
      card: "shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]",
      primary: "shadow-[4px_4px_0px_0px_rgba(43,43,43,0.5)]",
      primaryHover: "shadow-[2px_2px_0px_0px_rgba(43,43,43,0.5)]",
    },

    borders: {
      standard: "border-2 border-dark",
      featured: "border-4 border-dark",
      none: "border-transparent",
    },

    spacing: {
      buttonPadding: "px-6 py-3",
      cardPadding: "p-6",
      iconGap: "gap-2",
      formGap: "gap-4",
      sectionGap: "gap-6",
    },

    transitions: {
      standard: "transition-all",
      activeTranslate: "translate-x-[4px] translate-y-[4px]",
      hoverTranslate: "translate-x-[2px] translate-y-[2px]",
    },
  };

  /**
   * Génère les classes pour un effet "brutal" standard
   */
  const brutalEffect = (variant: "button" | "card" = "button") => {
    if (variant === "card") {
      return `${tokens.borders.standard} ${tokens.shadows.card} ${tokens.transitions.standard}`;
    }
    return `${tokens.borders.standard} ${tokens.shadows.standard} ${tokens.transitions.standard}`;
  };

  /**
   * Génère les classes pour un bouton brutal avec états hover/active
   */
  const brutalButton = () => {
    return {
      base: brutalEffect("button"),
      hover: tokens.shadows.hover,
      active: `${tokens.shadows.active} ${tokens.transitions.activeTranslate}`,
    };
  };

  /**
   * Génère les classes pour une carte brutale
   */
  const brutalCard = (featured = false) => {
    const border = featured ? tokens.borders.featured : tokens.borders.standard;
    return `${border} ${tokens.shadows.card} ${tokens.transitions.standard} bg-white`;
  };

  return {
    tokens,
    brutalEffect,
    brutalButton,
    brutalCard,
  };
};
