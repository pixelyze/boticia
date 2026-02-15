/**
 * Bibliothèque de templates de blocs prédéfinis
 */

import type { BlockTemplate } from "~/types/cms-blocks";

export const blockTemplates: BlockTemplate[] = [
  // === CONTENT BLOCKS ===
  {
    type: "hero",
    name: "Hero Principal",
    description: "Section hero avec titre, sous-titre et call-to-action",
    icon: "Sparkles",
    category: "content",
    defaultContent: {
      title: "Titre Principal",
      subtitle: "Sous-titre Accrocheur",
      description: "Description engageante qui présente votre proposition de valeur.",
      ctaText: "En Savoir Plus",
      ctaLink: "#",
      alignment: "center",
    },
    defaultSettings: {
      visible: true,
      padding: "large",
      margin: "none",
    },
  },
  {
    type: "text",
    name: "Texte Riche",
    description: "Bloc de texte avec formatage",
    icon: "FileText",
    category: "content",
    defaultContent: {
      html: "<p>Écrivez votre contenu ici...</p>",
      alignment: "left",
    },
    defaultSettings: {
      visible: true,
      padding: "medium",
      margin: "medium",
    },
  },
  {
    type: "quote",
    name: "Citation",
    description: "Citation avec auteur",
    icon: "Quote",
    category: "content",
    defaultContent: {
      quote: "Une citation inspirante qui capte l'attention.",
      author: "Nom de l'Auteur",
      role: "Titre ou Rôle",
    },
    defaultSettings: {
      visible: true,
      padding: "large",
      margin: "medium",
      backgroundColor: "#F5F3EE",
    },
  },

  // === MEDIA BLOCKS ===
  {
    type: "image",
    name: "Image",
    description: "Image avec légende optionnelle",
    icon: "Image",
    category: "media",
    defaultContent: {
      url: "https://placehold.co/1200x600/F5F3EE/2B2B2B?text=Votre+Image",
      alt: "Description de l'image",
      caption: "",
      alignment: "center",
    },
    defaultSettings: {
      visible: true,
      padding: "medium",
      margin: "medium",
    },
  },
  {
    type: "gallery",
    name: "Galerie d'Images",
    description: "Grille d'images",
    icon: "Images",
    category: "media",
    defaultContent: {
      images: [
        {
          url: "https://placehold.co/800x600/F5F3EE/2B2B2B?text=Image+1",
          alt: "Image 1",
        },
        {
          url: "https://placehold.co/800x600/F5F3EE/2B2B2B?text=Image+2",
          alt: "Image 2",
        },
        {
          url: "https://placehold.co/800x600/F5F3EE/2B2B2B?text=Image+3",
          alt: "Image 3",
        },
      ],
      layout: "grid",
    },
    defaultSettings: {
      visible: true,
      padding: "medium",
      margin: "medium",
    },
  },
  {
    type: "video",
    name: "Vidéo",
    description: "Lecteur vidéo (YouTube, Vimeo)",
    icon: "Video",
    category: "media",
    defaultContent: {
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      provider: "youtube",
      caption: "",
    },
    defaultSettings: {
      visible: true,
      padding: "medium",
      margin: "medium",
    },
  },

  // === MARKETING BLOCKS ===
  {
    type: "cta",
    name: "Call-to-Action",
    description: "Bloc d'appel à l'action",
    icon: "Megaphone",
    category: "marketing",
    defaultContent: {
      title: "Prêt à Commencer ?",
      description: "Rejoignez-nous dès aujourd'hui et découvrez la différence.",
      buttonText: "Commencer Maintenant",
      buttonLink: "/contact",
      variant: "primary",
    },
    defaultSettings: {
      visible: true,
      padding: "large",
      margin: "medium",
      backgroundColor: "#F5F3EE",
    },
  },
  {
    type: "features",
    name: "Fonctionnalités",
    description: "Grille de fonctionnalités avec icônes",
    icon: "Grid3x3",
    category: "marketing",
    defaultContent: {
      title: "Nos Fonctionnalités",
      subtitle: "Tout ce dont vous avez besoin",
      features: [
        {
          icon: "Sparkles",
          title: "Fonctionnalité 1",
          description: "Description de la première fonctionnalité",
        },
        {
          icon: "Zap",
          title: "Fonctionnalité 2",
          description: "Description de la deuxième fonctionnalité",
        },
        {
          icon: "Shield",
          title: "Fonctionnalité 3",
          description: "Description de la troisième fonctionnalité",
        },
      ],
      columns: 3,
    },
    defaultSettings: {
      visible: true,
      padding: "large",
      margin: "medium",
    },
  },

  // === LAYOUT BLOCKS ===
  {
    type: "columns",
    name: "Colonnes",
    description: "Layout en colonnes",
    icon: "Columns",
    category: "layout",
    defaultContent: {
      columns: [
        { width: 50, content: [] },
        { width: 50, content: [] },
      ],
    },
    defaultSettings: {
      visible: true,
      padding: "medium",
      margin: "medium",
    },
  },
  {
    type: "spacer",
    name: "Espacement",
    description: "Espace vertical",
    icon: "Minus",
    category: "layout",
    defaultContent: {
      height: 80,
    },
    defaultSettings: {
      visible: true,
      padding: "none",
      margin: "none",
    },
  },
];

/**
 * Obtenir un template par type
 */
export const getBlockTemplate = (type: string): BlockTemplate | undefined => {
  return blockTemplates.find((t) => t.type === type);
};

/**
 * Obtenir les templates par catégorie
 */
export const getBlockTemplatesByCategory = (category: BlockTemplate["category"]) => {
  return blockTemplates.filter((t) => t.category === category);
};

/**
 * Catégories de blocs
 */
export const blockCategories = [
  { value: "content", label: "Contenu", icon: "FileText" },
  { value: "media", label: "Média", icon: "Image" },
  { value: "marketing", label: "Marketing", icon: "Megaphone" },
  { value: "layout", label: "Mise en Page", icon: "Layout" },
] as const;
