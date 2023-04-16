import { computed, onMounted, onUnmounted, Ref, ref } from "vue";
import GlobalAnimation from "../utilities/globalAnimation";
import { convertStyleUnitPxToNumber } from "../utilities/helpers";

export function useTrackComputedStyle(
  elRef: Ref<HTMLElement | undefined>,
  property: keyof CSSStyleDeclaration,
  pseudoElement: string | null = null
) {
  const propertyRef = ref<CSSStyleDeclaration[typeof property]>();

  const updateProperty = () => {
    if (!elRef.value) return;
    propertyRef.value = window.getComputedStyle(elRef.value, pseudoElement)[
      property
    ];
  };

  onMounted(() => {
    GlobalAnimation.getInstance().subscribe(updateProperty);
  });

  onUnmounted(() => {
    GlobalAnimation.getInstance().unsubscribe(updateProperty);
  });

  return { propertyRef };
}

export function useTrackComputedWidthHeightNumber(
  elRef: Ref<HTMLElement | undefined>,
  pseudoElement: string | null = null
) {
  const widthStyle = useTrackComputedStyle(
    elRef,
    "width",
    pseudoElement
  ).propertyRef;
  const heightStyle = useTrackComputedStyle(
    elRef,
    "height",
    pseudoElement
  ).propertyRef;

  const widthNumber = computed(() => {
    if (!widthStyle.value) return 0;
    return convertStyleUnitPxToNumber(widthStyle.value as string) ?? 0;
  });

  const heightNumber = computed(() => {
    if (!heightStyle.value) return 0;
    return convertStyleUnitPxToNumber(heightStyle.value as string) ?? 0;
  });

  return { widthNumber, heightNumber };
}
