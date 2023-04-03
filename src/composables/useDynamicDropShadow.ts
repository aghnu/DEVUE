import { computed, Ref } from "vue";
import { convertStyleColorToRGBA } from "../utilities/helpers";
import { useTrackComputedStyle } from "./useTrackComputedStyle";

export function useDynamicDropShadow(element: Ref<HTMLDivElement | undefined>) {
  const shadowPrefix = "0 0 1rem";

  const elementBackgroundColor = useTrackComputedStyle(
    element,
    "backgroundColor"
  ).propertyRef;

  const elementDropShadowStyle = computed(() => {
    if (!elementBackgroundColor.value) return "none";
    const rgba = convertStyleColorToRGBA(
      elementBackgroundColor.value as string
    );
    if (!rgba) return "none";

    return (
      shadowPrefix + " " + `rgba(${rgba[0]}, ${rgba[1]}, ${rgba[2]}, 0.25)`
    );
  });

  return { elementBackgroundColor, elementDropShadowStyle };
}
