import { computed, Ref } from "vue";
import { useTrackComputedWidthHeightNumber } from "./useTrackComputedStyle";

export function useWindowSizeUnit(element: Ref<HTMLElement | undefined>) {
  const { widthNumber, heightNumber } =
    useTrackComputedWidthHeightNumber(element);

  // element width unit - width / 100
  const elewidth = computed(() =>
    widthNumber.value ? widthNumber.value / 100 : 0
  );

  // element height unit - height / 100
  const eleheight = computed(() =>
    heightNumber.value ? heightNumber.value / 100 : 0
  );

  const elemin = computed(() => Math.min(eleheight.value, elewidth.value));
  const elemax = computed(() => Math.max(eleheight.value, elewidth.value));

  return { elewidth, eleheight, elemin, elemax };
}
