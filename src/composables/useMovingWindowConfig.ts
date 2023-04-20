import { Ref, computed, ComputedRef, toRaw } from "vue";
import {
  MovingWindowCursorType,
  MovingWindowLocalState,
  MovingWindowResizeDirection,
} from "../types/TypeWindows";
import { useWindowsStatesStore } from "../stores/windowsStates";
import { storeToRefs } from "pinia";
import { useDesktopStatesStore } from "../stores/desktopStates";

export function useDesktopPointerDown() {
  const desktopStates = useDesktopStatesStore();

  function handlerMouseMove(e: MouseEvent) {
    e.preventDefault();
    desktopStates.updatePointerOperationType("move");
    desktopStates.updatePositionPointer([e.clientX, e.clientY]);
  }

  function handlerTouchMove(e: TouchEvent) {
    e.preventDefault();
    desktopStates.updatePointerOperationType("move");
    desktopStates.updatePositionPointer([
      e.touches[0].clientX,
      e.touches[0].clientY,
    ]);
  }

  function handlerMouseDown(e: MouseEvent) {
    e.preventDefault();
    desktopStates.updatePointerOperationType("down");
    desktopStates.updatePositionPointer([e.clientX, e.clientY]);
  }

  function handlerTouchStart(e: TouchEvent) {
    e.preventDefault();
    desktopStates.updatePointerOperationType("down");
    desktopStates.updatePositionPointer([
      e.touches[0].clientX,
      e.touches[0].clientY,
    ]);
  }

  return {
    handlerMouseDown,
    handlerTouchStart,
    handlerMouseMove,
    handlerTouchMove,
  };
}

export function useMovingWindowActionEvent(state: Ref<MovingWindowLocalState>) {
  const windowsStates = useWindowsStatesStore();
  const desktopStates = useDesktopStatesStore();
  const { actionEvent } = storeToRefs(windowsStates);

  function updateActionEventMoving() {
    windowsStates.updateMovingWindowAction({
      id: state.value.id,
      type: "move",
      windowPositionSnapshot: toRaw(state.value.position),
      windowSizeSnapshot: toRaw(state.value.size),
      pointerPositionSnapshot: toRaw(desktopStates.relativePositionPointer),
    });
  }

  function updateActionEventFocus() {
    windowsStates.updateMovingWindowAction({
      id: state.value.id,
      type: "focus",
      windowPositionSnapshot: toRaw(state.value.position),
      windowSizeSnapshot: toRaw(state.value.size),
      pointerPositionSnapshot: toRaw(desktopStates.relativePositionPointer),
    });
  }

  function updateActionEventResize(direction: MovingWindowResizeDirection) {
    windowsStates.updateMovingWindowAction({
      id: state.value.id,
      direction: direction,
      type: "resize",
      windowPositionSnapshot: toRaw(state.value.position),
      windowSizeSnapshot: toRaw(state.value.size),
      pointerPositionSnapshot: toRaw(desktopStates.relativePositionPointer),
    });
  }

  function resetActionEvent() {
    windowsStates.resetMovingWindowAction();
  }

  return {
    actionEvent,
    updateActionEventMoving,
    updateActionEventFocus,
    updateActionEventResize,
    resetActionEvent,
  };
}

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

export function useTopWindowStartedMoving() {
  const windowsState = useWindowsStatesStore();
  const desktopState = useDesktopStatesStore();
  const { topWindow, actionEvent } = storeToRefs(windowsState);

  let isWindowMoved = false;
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
