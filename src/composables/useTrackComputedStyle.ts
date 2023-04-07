import { onMounted, onUnmounted, Ref, ref } from "vue";
import GlobalAnimation from "../utilities/globalAnimation";

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
