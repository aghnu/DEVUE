import { Ref, computed, ComputedRef } from "vue";
import {
  MovingWindowCursorType,
  MovingWindowLocalState,
} from "../types/TypeWindows";
import { useWindowsStatesStore } from "../stores/windowsStates";
import { storeToRefs } from "pinia";

export function useMovingWindowConfig(state: Ref<MovingWindowLocalState>) {
  const windowsState = useWindowsStatesStore();
  const { topWindow } = storeToRefs(windowsState);

  const styleWindowPositionLeft = computed(() => {
    switch (state.value.snapped) {
      case "left":
      case "top":
        return "0";
      case "right":
        return "50%";
      default:
        return String(state.value.position[0]) + "px";
    }
  });
  const styleWindowPositionTop = computed(() => {
    switch (state.value.snapped) {
      case "left":
      case "top":
      case "right":
        return "0";
      default:
        return String(state.value.position[1]) + "px";
    }
  });
  const styleWindowSizeWidth = computed(() => {
    switch (state.value.snapped) {
      case "top":
        return "100%";
      case "left":
      case "right":
        return "50%";
      default:
        return String(state.value.size[0]) + "px";
    }
  });
  const styleWindowSizeHeight = computed(() => {
    switch (state.value.snapped) {
      case "left":
      case "top":
      case "right":
        return "100%";
      default:
        return String(state.value.size[1]) + "px";
    }
  });
  const styleWindowZIndex = computed(() => String(state.value.order));
  const isWindowFocused = computed(
    () => topWindow !== null && state.value.id === state.value.id
  );

  return {
    styleWindowPositionLeft,
    styleWindowPositionTop,
    styleWindowSizeWidth,
    styleWindowSizeHeight,
    styleWindowZIndex,
    isWindowFocused,
  };
}

export function useMovingWindowStyleGlobalCursor(
  defaultCursor: string,
  state: Ref<MovingWindowLocalState | null> | undefined = undefined
) {
  const windowsState = useWindowsStatesStore();
  const { actionEvent, topWindow } = storeToRefs(windowsState);
  state = state ?? topWindow;

  const styleWindowCursor: ComputedRef<MovingWindowCursorType | string> =
    computed(() => {
      if (
        state === undefined ||
        state.value === null ||
        actionEvent.value === null ||
        actionEvent.value.id !== state.value.id
      ) {
        return defaultCursor;
      }

      switch (actionEvent.value.type) {
        case "move":
          return "move";
        case "resize":
          switch (actionEvent.value.direction) {
            case "se":
            case "nw":
              return "nwse-resize";
            case "sw":
            case "ne":
              return "nesw-resize";
            case "n":
            case "s":
              return "ns-resize";
            case "w":
            case "e":
              return "ew-resize";
          }
      }

      return defaultCursor;
    });

  return { styleWindowCursor };
}
