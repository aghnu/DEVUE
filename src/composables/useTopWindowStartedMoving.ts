import { computed } from "vue";
import { useWindowsStatesStore } from "../stores/windowsStates";
import { useDesktopStatesStore } from "../stores/desktopStates";
import { storeToRefs } from "pinia";

export function useTopWindowStartedMoving() {
  const windowsState = useWindowsStatesStore();
  const desktopState = useDesktopStatesStore();
  const { topWindow, actionEvent } = storeToRefs(windowsState);

  var isWindowMoved: boolean = false;
  const isTopWindowStartedMoving = computed(() => {
    if (
      actionEvent.value !== null &&
      actionEvent.value.type === "move" &&
      topWindow.value
    ) {
      if (isWindowMoved) {
        return true;
      }

      if (
        desktopState.relativePosXPointer !==
          actionEvent.value.pointerPositionSnapshot[0] ||
        desktopState.relativePosYPointer !==
          actionEvent.value.pointerPositionSnapshot[1]
      ) {
        isWindowMoved = true;
        return true;
      }
    }
    isWindowMoved = false;
    return false;
  });

  return { isTopWindowStartedMoving };
}
