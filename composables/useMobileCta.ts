export const useMobileCta = () => {
  const visible = ref(false);
  const footerVisible = ref(false);

  const onScroll = () => {
    visible.value = window.scrollY > 300;
  };

  let observer: IntersectionObserver | null = null;

  onMounted(() => {
    window.addEventListener("scroll", onScroll, { passive: true });

    const footer = document.querySelector("footer");
    if (footer) {
      observer = new IntersectionObserver(
        ([entry]) => {
          footerVisible.value = entry.isIntersecting;
        },
        { threshold: 0 }
      );
      observer.observe(footer);
    }
  });

  onUnmounted(() => {
    window.removeEventListener("scroll", onScroll);
    observer?.disconnect();
  });

  const show = computed(() => visible.value && !footerVisible.value);

  return { show };
};
