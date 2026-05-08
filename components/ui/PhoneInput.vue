<template>
  <div class="relative">
    <div
      class="flex items-center h-14 rounded-2xl border-2 transition-all"
      :class="[
        focused ? 'bg-white border-dark/40' : 'bg-cream/30 border-dark/20',
        hasError ? 'border-red-400' : '',
      ]"
    >
      <!-- Country selector -->
      <button
        type="button"
        class="flex items-center gap-1.5 h-full px-3 border-r border-dark/10 rounded-l-2xl hover:bg-dark/5 transition-colors shrink-0"
        @click="dropdownOpen = !dropdownOpen"
      >
        <span class="text-xl leading-none">{{ selectedFlag }}</span>
        <span class="text-xs text-dark/40">{{ selectedDialCode }}</span>
        <IconLucid
          name="ChevronDown"
          size="xs"
          class="text-dark/40 transition-transform"
          :class="dropdownOpen ? 'rotate-180' : ''"
        />
      </button>

      <!-- Phone input -->
      <input
        ref="inputRef"
        v-model="phoneNumber"
        type="tel"
        :placeholder="localPlaceholder"
        class="flex-1 h-full px-4 bg-transparent outline-none text-dark"
        @focus="focused = true"
        @blur="focused = false"
        @input="handleInput"
        @keydown.enter="$emit('enter')"
      />
    </div>

    <!-- Dropdown -->
    <div
      v-if="dropdownOpen"
      class="absolute left-0 top-full mt-1 w-full max-h-52 overflow-y-auto bg-white border border-dark/15 rounded-xl shadow-lg z-50"
    >
      <!-- Search -->
      <div class="sticky top-0 bg-white p-2 border-b border-dark/10">
        <input
          ref="searchRef"
          v-model="search"
          type="text"
          :placeholder="searchPlaceholder"
          class="w-full px-3 py-2 text-sm rounded-lg border border-dark/15 outline-none focus:border-dark/30"
          @keydown.escape="dropdownOpen = false"
        />
      </div>

      <!-- Country list -->
      <button
        v-for="country in filteredCountries"
        :key="country.iso2"
        type="button"
        class="flex items-center gap-3 w-full px-3 py-2.5 hover:bg-cream/50 transition-colors text-left"
        :class="
          country.iso2 === selectedCountry
            ? 'bg-cream/40 font-medium'
            : ''
        "
        @click="selectCountry(country)"
      >
        <span class="text-lg">{{ country.flag }}</span>
        <span class="text-sm text-dark truncate">
          {{ country.name }}
        </span>
        <span class="text-xs text-dark/40 ml-auto shrink-0">
          +{{ country.dialCode }}
        </span>
      </button>
    </div>

    <!-- Backdrop -->
    <div
      v-if="dropdownOpen"
      class="fixed inset-0 z-40"
      @click="dropdownOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  watch,
  nextTick,
  onMounted,
} from "vue";

const props = defineProps<{
  modelValue: string;
  placeholder?: string;
  searchPlaceholder?: string;
  defaultCountry?: string;
  hasError?: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
  validate: [valid: boolean];
  enter: [];
}>();

const inputRef = ref<HTMLInputElement | null>(null);
const searchRef = ref<HTMLInputElement | null>(null);
const focused = ref(false);
const dropdownOpen = ref(false);
const search = ref("");
const phoneNumber = ref("");
const selectedCountry = ref(props.defaultCountry || "FR");

interface Country {
  name: string;
  iso2: string;
  dialCode: string;
  flag: string;
}

// ISO2 to emoji flag
const toFlag = (iso2: string): string => {
  const offset = 127397;
  return [...iso2.toUpperCase()]
    .map((c) => String.fromCodePoint(c.charCodeAt(0) + offset))
    .join("");
};

const countries: Country[] = [
  { name: "France", iso2: "FR", dialCode: "33", flag: "" },
  { name: "Belgium", iso2: "BE", dialCode: "32", flag: "" },
  { name: "Switzerland", iso2: "CH", dialCode: "41", flag: "" },
  { name: "Canada", iso2: "CA", dialCode: "1", flag: "" },
  { name: "United States", iso2: "US", dialCode: "1", flag: "" },
  { name: "United Kingdom", iso2: "GB", dialCode: "44", flag: "" },
  { name: "Japan", iso2: "JP", dialCode: "81", flag: "" },
  { name: "Germany", iso2: "DE", dialCode: "49", flag: "" },
  { name: "Italy", iso2: "IT", dialCode: "39", flag: "" },
  { name: "Spain", iso2: "ES", dialCode: "34", flag: "" },
  { name: "Portugal", iso2: "PT", dialCode: "351", flag: "" },
  { name: "Netherlands", iso2: "NL", dialCode: "31", flag: "" },
  { name: "Luxembourg", iso2: "LU", dialCode: "352", flag: "" },
  { name: "Monaco", iso2: "MC", dialCode: "377", flag: "" },
  { name: "Australia", iso2: "AU", dialCode: "61", flag: "" },
  { name: "Brazil", iso2: "BR", dialCode: "55", flag: "" },
  { name: "China", iso2: "CN", dialCode: "86", flag: "" },
  { name: "India", iso2: "IN", dialCode: "91", flag: "" },
  { name: "Mexico", iso2: "MX", dialCode: "52", flag: "" },
  { name: "Morocco", iso2: "MA", dialCode: "212", flag: "" },
  { name: "Algeria", iso2: "DZ", dialCode: "213", flag: "" },
  { name: "Tunisia", iso2: "TN", dialCode: "216", flag: "" },
  { name: "South Korea", iso2: "KR", dialCode: "82", flag: "" },
  { name: "Ireland", iso2: "IE", dialCode: "353", flag: "" },
  { name: "Austria", iso2: "AT", dialCode: "43", flag: "" },
  { name: "Poland", iso2: "PL", dialCode: "48", flag: "" },
  { name: "Sweden", iso2: "SE", dialCode: "46", flag: "" },
  { name: "Norway", iso2: "NO", dialCode: "47", flag: "" },
  { name: "Denmark", iso2: "DK", dialCode: "45", flag: "" },
  { name: "Finland", iso2: "FI", dialCode: "358", flag: "" },
  { name: "Greece", iso2: "GR", dialCode: "30", flag: "" },
  { name: "Turkey", iso2: "TR", dialCode: "90", flag: "" },
  { name: "Russia", iso2: "RU", dialCode: "7", flag: "" },
  { name: "New Zealand", iso2: "NZ", dialCode: "64", flag: "" },
  { name: "Argentina", iso2: "AR", dialCode: "54", flag: "" },
  { name: "Colombia", iso2: "CO", dialCode: "57", flag: "" },
  { name: "Chile", iso2: "CL", dialCode: "56", flag: "" },
  { name: "Romania", iso2: "RO", dialCode: "40", flag: "" },
  { name: "Czech Republic", iso2: "CZ", dialCode: "420", flag: "" },
  { name: "Hungary", iso2: "HU", dialCode: "36", flag: "" },
  { name: "Croatia", iso2: "HR", dialCode: "385", flag: "" },
  { name: "Singapore", iso2: "SG", dialCode: "65", flag: "" },
  { name: "Thailand", iso2: "TH", dialCode: "66", flag: "" },
  { name: "Vietnam", iso2: "VN", dialCode: "84", flag: "" },
  { name: "Philippines", iso2: "PH", dialCode: "63", flag: "" },
  { name: "Indonesia", iso2: "ID", dialCode: "62", flag: "" },
  { name: "Malaysia", iso2: "MY", dialCode: "60", flag: "" },
  { name: "Israel", iso2: "IL", dialCode: "972", flag: "" },
  { name: "Saudi Arabia", iso2: "SA", dialCode: "966", flag: "" },
  { name: "UAE", iso2: "AE", dialCode: "971", flag: "" },
  { name: "South Africa", iso2: "ZA", dialCode: "27", flag: "" },
  { name: "Egypt", iso2: "EG", dialCode: "20", flag: "" },
  { name: "Nigeria", iso2: "NG", dialCode: "234", flag: "" },
  { name: "Senegal", iso2: "SN", dialCode: "221", flag: "" },
  { name: "Ivory Coast", iso2: "CI", dialCode: "225", flag: "" },
  { name: "Cameroon", iso2: "CM", dialCode: "237", flag: "" },
  { name: "Madagascar", iso2: "MG", dialCode: "261", flag: "" },
  { name: "Mauritius", iso2: "MU", dialCode: "230", flag: "" },
  { name: "Reunion", iso2: "RE", dialCode: "262", flag: "" },
  { name: "Guadeloupe", iso2: "GP", dialCode: "590", flag: "" },
  { name: "Martinique", iso2: "MQ", dialCode: "596", flag: "" },
  { name: "French Guiana", iso2: "GF", dialCode: "594", flag: "" },
  { name: "New Caledonia", iso2: "NC", dialCode: "687", flag: "" },
  { name: "French Polynesia", iso2: "PF", dialCode: "689", flag: "" },
].map((c) => ({ ...c, flag: toFlag(c.iso2) }));

const selectedData = computed(
  () =>
    countries.find((c) => c.iso2 === selectedCountry.value) ||
    countries[0]
);

const phonePlaceholders: Record<string, string> = {
  FR: "6 12 34 56 78",
  BE: "470 12 34 56",
  CH: "78 123 45 67",
  CA: "204 555 0123",
  US: "201 555 0123",
  GB: "7700 900123",
  JP: "90 1234 5678",
  DE: "151 1234 5678",
  IT: "312 345 6789",
  ES: "612 345 678",
  PT: "912 345 678",
  NL: "6 12345678",
  LU: "621 123 456",
  MC: "6 12 34 56 78",
  AU: "412 345 678",
  BR: "11 91234 5678",
  CN: "139 1234 5678",
  IN: "98765 43210",
  MX: "55 1234 5678",
  MA: "612-345678",
  DZ: "551 23 45 67",
  TN: "20 123 456",
  KR: "10-1234-5678",
  IE: "85 123 4567",
  AT: "664 123456",
  PL: "512 345 678",
  SE: "70 123 45 67",
  NO: "406 12 345",
  DK: "20 12 34 56",
  FI: "40 123 4567",
  GR: "691 234 5678",
  TR: "532 123 45 67",
  RU: "912 345-67-89",
  NZ: "21 123 4567",
  AR: "11 1234-5678",
  CO: "300 123 4567",
  CL: "9 1234 5678",
  SG: "8123 4567",
  TH: "81 234 5678",
  JP: "90 1234 5678",
};

const selectedFlag = computed(() => selectedData.value.flag);
const selectedDialCode = computed(
  () => `+${selectedData.value.dialCode}`
);
const localPlaceholder = computed(
  () =>
    phonePlaceholders[selectedCountry.value] ||
    props.placeholder ||
    ""
);

const filteredCountries = computed(() => {
  if (!search.value) return countries;
  const q = search.value.toLowerCase();
  return countries.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.dialCode.includes(q) ||
      c.iso2.toLowerCase().includes(q)
  );
});

const selectCountry = (country: Country) => {
  selectedCountry.value = country.iso2;
  dropdownOpen.value = false;
  search.value = "";
  emitValue();
  nextTick(() => inputRef.value?.focus());
};

const handleInput = () => {
  emitValue();
};

const emitValue = () => {
  const digits = phoneNumber.value.replace(/[^\d]/g, "");
  if (digits.length > 0) {
    const full = `+${selectedData.value.dialCode}${digits}`;
    emit("update:modelValue", full);
    emit("validate", digits.length >= 6);
  } else {
    emit("update:modelValue", "");
    emit("validate", false);
  }
};

watch(dropdownOpen, (open) => {
  if (open) {
    nextTick(() => searchRef.value?.focus());
  }
});

watch(
  () => props.defaultCountry,
  (val) => {
    if (val && !phoneNumber.value) {
      selectedCountry.value = val;
    }
  }
);

onMounted(() => {
  if (props.modelValue) {
    // Parse existing E.164 number
    const match = props.modelValue.match(/^\+(\d+)/);
    if (match) {
      const digits = match[1];
      const found = countries.find((c) =>
        digits.startsWith(c.dialCode)
      );
      if (found) {
        selectedCountry.value = found.iso2;
        phoneNumber.value = digits.slice(
          found.dialCode.length
        );
      }
    }
  }
});
</script>
