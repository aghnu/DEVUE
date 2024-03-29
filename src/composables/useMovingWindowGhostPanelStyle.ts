import { onMounted, watch, computed, ref } from "vue";
import { usePointerLocation } from "../composables/usePointerLocation";
import { useWindowsStatesStore } from "../stores/windowsStates";
import { useTopWindowStartedMoving } from "../composables/useMovingWindowConfig";
import { storeToRefs } from "pinia";
import { useDesktopStatesStore } from "../stores/desktopStates";
import { PointerLocation } from "../types/TypeDesktop";
import { WINDOW_CONFIG } from "../constants/WindowManager";

export function useMovingWindowGhostPanelStyle() {
  // vairables
  const windowsState = useWindowsStatesStore();
  const desktopState = useDesktopStatesStore();

  const { sizeWindowsManager } = storeToRefs(desktopState);
  const { topWindow } = storeToRefs(windowsState);
  const { pointerLocation } = usePointerLocation();
  const { isTopWindowStartedMoving } = useTopWindowStartedMoving();

  const ghostPanelShow = computed(() => {
    return (
      isTopWindowStartedMoving.value &&
      pointerLocation.value !== "center" &&
      topWindow.value !== null
    );
  });
  const stylePanelZIndex = computed(() => {
    return String(topWindow.value !== null ? topWindow.value.order : 0);
  });
  const isSnapNarrow = computed(
    () =>
      sizeWindowsManager.value[0] <=
      WINDOW_CONFIG.DEFAULT_SIZE_MIN_WINDOW[0] * 2
  );

  const stylePanelFromWidth = ref("unset");
  const stylePanelFromHeight = ref("unset");
  const stylePanelFromLeft = ref("unset");
  const stylePanelFromTop = ref("unset");

  const stylePanelToWidth = ref("unset");
  const stylePanelToHeight = ref("unset");
  const stylePanelToLeft = ref("unset");
  const stylePanelToTop = ref("unset");

  // life cycles
  onMounted(() => {
    watch(
      ghostPanelShow,
      () => {
        if (topWindow.value !== null && topWindow.value.snapped === "center") {
          stylePanelFromWidth.value = String(topWindow.value.size[0]) + "px";
          stylePanelFromHeight.value = String(topWindow.value.size[1]) + "px";
          stylePanelFromLeft.value = String(topWindow.value.position[0]) + "px";
          stylePanelFromTop.value = String(topWindow.value.position[1]) + "px";
        } else {
          stylePanelFromWidth.value = stylePanelToWidth.value;
          stylePanelFromHeight.value = stylePanelToHeight.value;
          stylePanelFromLeft.value = stylePanelToLeft.value;
          stylePanelFromTop.value = stylePanelToTop.value;
        }
      },
      { immediate: true }
    );

    watch(
      pointerLocation,
      (snapped) => {
        // connect snapped based on desktop width
        // if snapped and width too small, make it top
        const snappedCorrected: PointerLocation =
          snapped === "center"
            ? "center"
            : isSnapNarrow.value
            ? "top"
            : snapped;

        switch (snappedCorrected) {
          case "left":
            stylePanelToWidth.value = "50%";
            stylePanelToHeight.value = "100%";
            stylePanelToLeft.value = "0";
            stylePanelToTop.value = "0";
            break;
          case "right":
            stylePanelToWidth.value = "50%";
            stylePanelToHeight.value = "100%";
            stylePanelToLeft.value = "50%";
            stylePanelToTop.value = "0";
            break;
          case "top":
            stylePanelToWidth.value = "100%";
            stylePanelToHeight.value = "100%";
            stylePanelToLeft.value = "0";
            stylePanelToTop.value = "0";
            break;
        }
      },
      {
        immediate: true,
      }
    );
  });

  return {
    stylePanelFromWidth,
    stylePanelFromHeight,
    stylePanelFromLeft,
    stylePanelFromTop,
    stylePanelToWidth,
    stylePanelToHeight,
    stylePanelToLeft,
    stylePanelToTop,
    stylePanelZIndex,
    ghostPanelShow,
  };
}
