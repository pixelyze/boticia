<template>
  <!-- [COMP-EDITORIAL-SERVICES] — Les quatre prestations,
       chacune avec sa gravure de Redouté -->
  <section
    aria-labelledby="editorial-services"
    class="border-t-[1.5px] border-ed-ink"
  >
    <h2
      id="editorial-services"
      class="px-[5%] pt-14 text-[13px] font-bold uppercase tracking-[0.32em]"
    >
      {{ $t("editorial.services.title") }}
    </h2>
    <div
      class="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-y-12 px-[5%] pb-[72px] pt-8"
    >
      <article
        v-for="(service, index) in services"
        :key="service.key"
        class="flex flex-col gap-4 border-l-[1.5px] border-ed-ink px-6 pb-2"
      >
        <EditorialEngraving
          :src="service.image"
          :alt="$t(`editorial.services.${service.key}_alt`)"
          class="h-[320px]"
          circle-class="left-1/2 top-10 -ml-20 h-[200px] w-[200px]"
        />
        <p class="text-[15px] italic text-ed-accent">
          0{{ index + 1 }}
        </p>
        <h3 class="text-[34px] font-normal leading-tight">
          {{ $t(`editorial.services.${service.key}_title`) }}
        </h3>
        <p class="text-[17px] leading-relaxed">
          {{ $t(`editorial.services.${service.key}_text`) }}
        </p>
        <Button
          variant="link"
          right-icon="MoveRight"
          :to="localePath(service.to)"
          class="mt-auto text-lg"
        >
          {{ $t("editorial.services.discover") }}
        </Button>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
const localePath = useLocalePath();

const services = [
  { key: "weddings", to: "/mariages", image: "/images/redoute/pivoine.webp" },
  { key: "events", to: "/evenements", image: "/images/redoute/anemones.webp" },
  { key: "subscription", to: "/evenements", image: "/images/redoute/iris.webp" },
  { key: "workshops", to: "/ateliers", image: "/images/redoute/tulipe-sauvage.webp" },
];
</script>
