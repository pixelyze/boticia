<template>
  <!-- [COMP-ICON-PHOSPHOR] — Icônes décoratives du site public
       Phosphor, graisse « light » : trait fin, plus haut de gamme que
       Lucide. Lucide (IconLucid) reste pour les icônes fonctionnelles et
       le tableau de bord. Avant d'utiliser une icône, l'ajouter à l'import
       ET à l'objet `icons` ci-dessous. -->
  <component
    :is="icon"
    v-if="icon"
    :weight="weight"
    size="100%"
    class="icon shrink-0"
    :class="[sizeClass, $attrs.class]"
    aria-hidden="true"
  />
</template>

<script setup>
import { computed } from "vue";
import {
  PhArrowRight,
  PhBuildings,
  PhCamera,
  PhChatCircle,
  PhChurch,
  PhClock,
  PhConfetti,
  PhCrown,
  PhFlowerTulip,
  PhForkKnife,
  PhGift,
  PhHandshake,
  PhHeart,
  PhLaptop,
  PhLeaf,
  PhMapPin,
  PhPalette,
  PhSparkle,
  PhUsers,
} from "@phosphor-icons/vue";

defineOptions({
  inheritAttrs: false,
});

const icons = {
  ArrowRight: PhArrowRight,
  Buildings: PhBuildings,
  Camera: PhCamera,
  ChatCircle: PhChatCircle,
  Church: PhChurch,
  Clock: PhClock,
  Confetti: PhConfetti,
  Crown: PhCrown,
  FlowerTulip: PhFlowerTulip,
  ForkKnife: PhForkKnife,
  Gift: PhGift,
  Handshake: PhHandshake,
  Heart: PhHeart,
  Laptop: PhLaptop,
  Leaf: PhLeaf,
  MapPin: PhMapPin,
  Palette: PhPalette,
  Sparkle: PhSparkle,
  Users: PhUsers,
};

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    default: "md",
    validator: (value) => ["xs", "sm", "md", "lg"].includes(value),
  },
  weight: {
    type: String,
    default: "light",
  },
});

const icon = computed(() => icons[props.name]);

const sizeClass = computed(() => ({
  "h-4 w-4": props.size === "xs",
  "h-5 w-5": props.size === "sm",
  "h-6 w-6": props.size === "md",
  "h-7 w-7": props.size === "lg",
}));
</script>
