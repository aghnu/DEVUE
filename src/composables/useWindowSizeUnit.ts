import { computed, Ref } from "vue";
import { convertStyleUnitPxToNumber } from "../utilities/helpers";
import { useTrackComputedStyle } from "./useTrackComputedStyle";

export function useWindowSizeUnit(element: Ref<HTMLElement | undefined>) {
  const widthStyleComputed = useTrackComputedStyle(
    element,
    "width"
  ).propertyRef;
  const heightStyleComputed = useTrackComputedStyle(
    element,
    "height"
  ).propertyRef;

  // element width unit - width / 100
  const elewidth = computed(() => {
    const size = widthStyleComputed.value
      ? convertStyleUnitPxToNumber(widthStyleComputed.value as string) ?? 0
      : 0;

    return size ? size / 100 : 0;
  });

  // element height unit - height / 100
  const eleheight = computed(() => {
    const size = heightStyleComputed.value
      ? convertStyleUnitPxToNumber(heightStyleComputed.value as string) ?? 0
      : 0;

    return size ? size / 100 : 0;
  });

  const elemin = computed(() => Math.min(eleheight.value, elewidth.value));
  const elemax = computed(() => Math.max(eleheight.value, elewidth.value));

  return { elewidth, eleheight, elemin, elemax };
}
