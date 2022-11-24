import { PointerLocation } from "../types/TypeDesktop";
import { POINTER_CONFIG } from "../constants/WindowManager";
import { useDesktopStatesStore } from "../stores/desktopStates";
import { computed, ComputedRef } from "vue";

export function usePointerLocation() {
  const desktopState = useDesktopStatesStore();
  const pointerLocation: ComputedRef<PointerLocation> = computed(() => {
    if (
      desktopState.relativePosXPointer >= 0 &&
      desktopState.relativePosXPointer <= POINTER_CONFIG.POINTER_LOCATION_OFFSET
    ) {
      // left
      return "left";
    } else if (
      desktopState.relativePosXPointer >=
        desktopState.sizeWindowsManager[0] -
          POINTER_CONFIG.POINTER_LOCATION_OFFSET &&
      desktopState.relativePosXPointer <= desktopState.sizeWindowsManager[0]
    ) {
      // right
      return "right";
    } else if (desktopState.relativePosYPointer <= 0) {
      // top
      return "top";
    } else {
      // close
      return "center";
    }
  });

  return { pointerLocation };
}
