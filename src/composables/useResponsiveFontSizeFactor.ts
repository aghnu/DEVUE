import { ComputedRef, onMounted, ref, Ref, watch } from "vue";

export function useResponsiveFontSizeFactor(
  widthText: Ref<number>,
  widthContainer: Ref<number>,
  stopSideAffect: boolean = true
) {
  const fontSizeFactor = ref(1);
  let stopTextSize = false;

  function updateFontSizeFactor(factor: number) {
    if (factor === fontSizeFactor.value) return;

    stopTextSize = stopSideAffect ? true : false;
    fontSizeFactor.value = factor;
  }

  function handleSizeChange(widthText: number, widthContainer: number) {
    const newFactor = widthContainer / (widthText / fontSizeFactor.value);

    updateFontSizeFactor(Math.min(newFactor, 1));
  }

  onMounted(() => {
    watch(widthContainer, (value) => {
      handleSizeChange(widthText.value, value);
    });
    watch(widthText, (value) => {
      if (stopTextSize) {
        stopTextSize = false;
        return;
      }
      handleSizeChange(value, widthContainer.value);
    });
  });

  return { fontSizeFactor };
}
