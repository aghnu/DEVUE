import { Ref, computed, ComputedRef } from "vue";
import {
  MovingWindowCursorType,
  MovingWindowLocalState,
} from "../types/TypeWindows";
import { useWindowsStatesStore } from "../stores/windowsStates";
import { storeToRefs } from "pinia";

export function useMovingWindowConfig(state: Ref<MovingWindowLocalState>) {
  const windowsState = useWindowsStatesStore();
  const { topWindow, actionEvent } = storeToRefs(windowsState);

  const styleWindowZIndex = computed(() => String(state.value.order));
  const isWindowFocused = computed(
    () => topWindow.value !== null && state.value.id === topWindow.value.id
  );
  const isWindowMoving = computed(() => {
    if (
      topWindow.value &&
      topWindow.value.id === state.value.id &&
      actionEvent.value !== null
    ) {
      switch (actionEvent.value.type) {
        case "move":
          return true;
      }
      return false;
    }

    return false;
  });

  return {
    styleWindowZIndex,
    isWindowFocused,
    isWindowMoving,
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
