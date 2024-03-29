import { computed, Ref } from "vue";
import {
  convertStyleColorToRGBA,
  convertStyleColorToIntensity,
} from "../utilities/helpers";
import { useTrackComputedStyle } from "./useTrackComputedStyle";

export function useDynamicColor(element: Ref<HTMLElement | undefined>) {
  const shadowPrefix = "0 0 8px";

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
      shadowPrefix + " " + `rgba(${rgba[0]}, ${rgba[1]}, ${rgba[2]}, 0.35)`
    );
  });

  const elementColorIntensity = computed(() => {
    if (!elementBackgroundColor.value) return 0;
    const intensity = convertStyleColorToIntensity(
      elementBackgroundColor.value as string
    );
    return intensity ?? 0;
  });

  const elementBorderColorStyle = computed(() => {
    if (!elementBackgroundColor.value) return "none";
    const intensity = convertStyleColorToIntensity(
      elementBackgroundColor.value as string
    );
    if (intensity === null) return "transparent";

    if (intensity > 0.5) {
      return "var(--color-border-dark)";
    } else {
      return "var(--color-border-light)";
    }
  });

  const elementDropShadowIntensityStyle = computed(() => {
    if (!elementBackgroundColor.value) return "none";
    const intensity = convertStyleColorToIntensity(
      elementBackgroundColor.value as string
    );
    if (intensity === null) return "none";

    if (intensity > 0.5) {
      return "var(--shadow-intensity-high)";
    } else {
      return "var(--shadow-intensity-low)";
    }
  });

  return {
    elementBackgroundColor,
    elementDropShadowStyle,
    elementBorderColorStyle,
    elementColorIntensity,
    elementDropShadowIntensityStyle,
  };
}
