import { onMounted, watch } from "vue";
import { useTopWindowStartedMoving } from "../composables/useTopWindowStartedMoving";
import { useWindowsStatesStore } from "../stores/windowsStates";
import { useDesktopStatesStore } from "../stores/desktopStates";
import { usePointerLocation } from "../composables/usePointerLocation";
import { storeToRefs } from "pinia";
import { Tuple } from "../types/TypeBasic";
import { MovingWindowLocalState } from "../types/TypeWindows";

export function getSnappedWindowPosition(
  windowState: MovingWindowLocalState
): Tuple<number> {
  const desktopState = useDesktopStatesStore();
  const windowManagerSize = desktopState.sizeWindowsManager;
  switch (windowState.snapped) {
    case "left":
    case "top":
      return [0, 0];
    case "right":
      return [windowManagerSize[0] * 0.5, 0];
    case "center":
      return windowState.position;
  }
}

export function getSnappedWindowSize(
  windowState: MovingWindowLocalState
): Tuple<number> {
  const desktopState = useDesktopStatesStore();
  const windowManagerSize = desktopState.sizeWindowsManager;
  switch (windowState.snapped) {
    case "left":
    case "right":
      return [windowManagerSize[0] * 0.5, windowManagerSize[1]];
    case "top":
      return [windowManagerSize[0], windowManagerSize[1]];
    case "center":
      return windowState.size;
  }
}

export function connectWindowSnapping() {
  const desktopState = useDesktopStatesStore();
  const windowsState = useWindowsStatesStore();
  const { topWindow, actionEvent } = storeToRefs(windowsState);
  const { isTopWindowStartedMoving } = useTopWindowStartedMoving();
  const { pointerLocation } = usePointerLocation();

  const doSnapping = () => {
    if (topWindow.value === null) {
      return;
    }
    topWindow.value.snapped = pointerLocation.value;
  };

  const removeSnapping = () => {
    if (topWindow.value === null || topWindow.value.snapped === "center") {
      return;
    }
    if (actionEvent.value !== null && actionEvent.value.type === 'move') {
      // before leaving snap, change position of the window
      const pointerPosition = desktopState.relativePositionPointer;
      const topWindowCurrentSize = getSnappedWindowSize(topWindow.value);
      const topWindowCurrentPosition = getSnappedWindowPosition(topWindow.value);
      const topWindowOriginalSize = topWindow.value.size;

      const posX =
        pointerPosition[0] -
        ((pointerPosition[0] - topWindowCurrentPosition[0]) /
          topWindowCurrentSize[0]) *
          topWindowOriginalSize[0];
      const posY = topWindowCurrentPosition[1];   
      
      actionEvent.value.windowPositionSnapshot = [posX, posY];
    }


    // leaving snap
    topWindow.value.snapped = "center";
  };

  onMounted(() => {
    watch(isTopWindowStartedMoving, (newValue, oldValue) => {
      console.log("ok");
      if (!newValue || oldValue) {
        // stop moving, pointer released by user
        doSnapping();
      } else if (newValue || !oldValue) {
        // start moving
        removeSnapping();
      }
    });
  });
}
