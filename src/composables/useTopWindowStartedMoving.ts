import { computed } from "vue";
import { useWindowsStatesStore } from "../stores/windowsStates";
import { storeToRefs } from "pinia";

export function useTopWindowStartedMoving() {
  const windowsState = useWindowsStatesStore();
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
        topWindow.value.position[0] !==
          actionEvent.value.windowPositionSnapshot[0] ||
        topWindow.value.position[1] !==
          actionEvent.value.windowPositionSnapshot[1]
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
