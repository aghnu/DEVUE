import { toRaw } from "vue";
import { Tuple } from "../types/TypeBasic";
import { useWindowsStatesStore } from "../stores/windowsStates";
import { useDesktopStatesStore } from "../stores/desktopStates";
import {
  calculateWindowPositionWithConstrain,
  calculateWindowSizeWithConstrain,
} from "./doWindowCreation";
import {
  MovingWindowActionEvent,
  MovingWindowActionEventResize,
  MovingWindowID,
  MovingWindowLocalState,
  MovingWindowResizeDirection,
} from "../types/TypeWindows";
import { onMounted, onUnmounted, Ref, watch } from "vue";

export function updateMovingWindowPosition(
  movingWindowID: MovingWindowID,
  position: Tuple<number>
) {
  const windowsStates = useWindowsStatesStore();
  const movingWindowState = windowsStates.getMovingWindowFromID(movingWindowID);
  if (movingWindowState !== null) {
    // update position
    const newPosition = calculateWindowPositionWithConstrain(
      movingWindowState,
      position
    );
    windowsStates.updateMovingWindowState(movingWindowState.id, {
      position: newPosition,
    });
    return position;
  } else {
    console.error(
      "Error: movingWindow not tracked when updating window position"
    );
  }
}

export function updateMovingWindowSize(
  movingWindowID: string,
  size: Tuple<number>
) {
  const windowsStates = useWindowsStatesStore();
  const movingWindowState = windowsStates.getMovingWindowFromID(movingWindowID);
  if (movingWindowState !== null) {
    const newSize = calculateWindowSizeWithConstrain(movingWindowState, size);
    windowsStates.updateMovingWindowState(movingWindowState.id, {
      size: newSize,
    });
    return newSize;
  } else {
    console.error(
      "Error: movingWindow not tracked when updating window position"
    );
    return null;
  }
}

export function connectWindowsActionEvent() {
  const windowsStates = useWindowsStatesStore();
  const desktopStates = useDesktopStatesStore();

  const helperWindowActionExecuteFuncMove = (
    actionEvent: MovingWindowActionEvent,
    movingWindowState: MovingWindowLocalState
  ) => {
    // move window relative to original pointer snapshot
    const windowPositionSnapshot = actionEvent.windowPositionSnapshot;
    const pointerPositionCurrent = toRaw(desktopStates.relativePositionPointer);
    const pointerPositionSnapshot = actionEvent.pointerPositionSnapshot;

    const windowsPosXNew =
      windowPositionSnapshot[0] +
      pointerPositionCurrent[0] -
      pointerPositionSnapshot[0];
    const windowsPosYNew =
      windowPositionSnapshot[1] +
      pointerPositionCurrent[1] -
      pointerPositionSnapshot[1];

    // set new
    updateMovingWindowPosition(movingWindowState.id, [
      windowsPosXNew,
      windowsPosYNew,
    ]);
  };

  const helperWindowActionExecuteFuncResize = (
    actionEvent: MovingWindowActionEventResize,
    movingWindowState: MovingWindowLocalState
  ) => {
    // disable resize if window is snapped
    if (movingWindowState.snapped !== "center") {
      return;
    }

    // direction
    const helperFuncResizeToDirection = (
      direction: MovingWindowResizeDirection
    ) => {
      // port code from the old project, may need refactor later
      const windowStateSnapshotPosition = actionEvent.windowPositionSnapshot;
      const windowStateSnapshotSize = actionEvent.windowSizeSnapshot;
      const pointerStateSnapshotPosition = actionEvent.pointerPositionSnapshot;

      const windowStateCurrentPosition = movingWindowState.position;
      const windowStateCurrentSize = movingWindowState.size;
      const pointerStateCurrentPosition = desktopStates.relativePositionPointer;

      switch (direction) {
        case "n":
          {
            const newPosY =
              windowStateSnapshotPosition[1] +
              pointerStateCurrentPosition[1] -
              pointerStateSnapshotPosition[1];
            const positionNew = updateMovingWindowPosition(
              movingWindowState.id,
              [windowStateCurrentPosition[0], newPosY]
            )!;

            const newSizeY =
              windowStateSnapshotSize[1] -
              (positionNew[1] - windowStateSnapshotPosition[1]);
            const sizeNew = updateMovingWindowSize(movingWindowState.id, [
              windowStateCurrentSize[0],
              newSizeY,
            ])!;

            if (sizeNew[1] !== newSizeY) {
              // this.windowState = windowStateCurrentPosition;
              const newPosYCorrected =
                windowStateSnapshotPosition[1] +
                (windowStateSnapshotSize[1] - sizeNew[1]);
              updateMovingWindowPosition(movingWindowState.id, [
                windowStateCurrentPosition[0],
                newPosYCorrected,
              ]);
              updateMovingWindowSize(movingWindowState.id, [
                windowStateCurrentSize[0],
                sizeNew[1],
              ]);
            }
          }
          break;
        case "w":
          {
            const newPosX =
              windowStateSnapshotPosition[0] +
              pointerStateCurrentPosition[0] -
              pointerStateSnapshotPosition[0];
            const positionNew = updateMovingWindowPosition(
              movingWindowState.id,
              [newPosX, windowStateCurrentPosition[1]]
            )!;

            const newSizeX =
              windowStateSnapshotSize[0] -
              (positionNew[0] - windowStateSnapshotPosition[0]);
            const sizeNew = updateMovingWindowSize(movingWindowState.id, [
              newSizeX,
              windowStateCurrentSize[1],
            ])!;

            if (sizeNew[0] !== newSizeX) {
              // this.windowState = windowStateCurrentPosition;
              const newPosXCorrected =
                windowStateSnapshotPosition[0] +
                (windowStateSnapshotSize[0] - sizeNew[0]);
              updateMovingWindowPosition(movingWindowState.id, [
                newPosXCorrected,
                windowStateCurrentPosition[1],
              ]);
              updateMovingWindowSize(movingWindowState.id, [
                sizeNew[0],
                windowStateCurrentSize[1],
              ]);
            }
          }
          break;
        case "s":
          // south edge
          updateMovingWindowSize(movingWindowState.id, [
            windowStateCurrentSize[0],
            windowStateSnapshotSize[1] +
              pointerStateCurrentPosition[1] -
              pointerStateSnapshotPosition[1],
          ]);
          break;
        case "e":
          // east edge
          updateMovingWindowSize(movingWindowState.id, [
            windowStateSnapshotSize[0] +
              pointerStateCurrentPosition[0] -
              pointerStateSnapshotPosition[0],
            windowStateCurrentSize[1],
          ]);
          break;
      }
    };

    // execute the operation
    switch (actionEvent.direction) {
      case "se":
        helperFuncResizeToDirection("s");
        helperFuncResizeToDirection("e");
        break;
      case "sw":
        helperFuncResizeToDirection("s");
        helperFuncResizeToDirection("w");
        break;
      case "ne":
        helperFuncResizeToDirection("n");
        helperFuncResizeToDirection("e");
        break;
      case "nw":
        helperFuncResizeToDirection("n");
        helperFuncResizeToDirection("w");
        break;

      case "n":
        helperFuncResizeToDirection("n");
        break;
      case "w":
        helperFuncResizeToDirection("w");
        break;
      case "s":
        helperFuncResizeToDirection("s");
        break;
      case "e":
        helperFuncResizeToDirection("e");
        break;
    }
  };

  const helperExecuteWindowAction = () => {
    const actionEvent = toRaw(windowsStates.actionEvent);

    if (actionEvent !== null) {
      windowsStates.focusMovingWindow(actionEvent.id);
      const targetWindow = windowsStates.getMovingWindowFromID(actionEvent.id);
      if (targetWindow !== null) {
        switch (actionEvent.type) {
          case "move":
            helperWindowActionExecuteFuncMove(actionEvent, targetWindow);
            break;
          case "resize":
            helperWindowActionExecuteFuncResize(actionEvent, targetWindow);
            break;
        }
      }
    }
  };

  const handlerResetWindowActionEvent = () => {
    windowsStates.resetMovingWindowAction();
  };

  onMounted(() => {
    // clear action when some events happends
    window.addEventListener("blur", handlerResetWindowActionEvent);
    document.addEventListener("touchend", handlerResetWindowActionEvent);
    document.addEventListener("mouseup", handlerResetWindowActionEvent);

    // when potential action event depended event happends, process action event
    watch(
      () => desktopStates.relativePositionPointer,
      () => {
        helperExecuteWindowAction();
      }
    );
  });

  onUnmounted(() => {
    window.removeEventListener("blur", handlerResetWindowActionEvent);
    document.removeEventListener("touchend", handlerResetWindowActionEvent);
    document.removeEventListener("mouseup", handlerResetWindowActionEvent);
  });
}

export function connectWindowResizeStateUpdate(
  desktopElement: Ref<HTMLDivElement | undefined>
) {
  const windowsStates = useWindowsStatesStore();
  const desktopStates = useDesktopStatesStore();

  const helperHandlerWindowResizeUpdateWindowsManagerState = () => {
    if (desktopElement.value !== undefined && desktopElement.value !== null) {
      const rect = desktopElement.value.getBoundingClientRect();
      desktopStates.updateSizeWindowsManager([
        desktopElement.value.offsetWidth,
        desktopElement.value.offsetHeight,
      ]);
      desktopStates.updatePositionWindowsManager([rect.left, rect.top]);
    }
  };

  const helperSpreadDesktopSizeStateChangeToMovingWindows = (
    newDesktopSize: Tuple<number>,
    oldDesktopSize: Tuple<number>
  ) => {
    const changeIndividualMovingWindowState = (
      movingWindowState: MovingWindowLocalState
    ) => {
      const movingWindowPosition = movingWindowState.position;
      // const movingWindowSize = movingWindowState.size;

      const newWindowPosX =
        movingWindowPosition[0] >= 0
          ? (movingWindowPosition[0] / oldDesktopSize[0]) * newDesktopSize[0]
          : (() => {
              // special case left is out of desktop's left edge
              // make the change reverse
              const posXDiff =
                (movingWindowPosition[0] / oldDesktopSize[0]) *
                  newDesktopSize[0] -
                movingWindowPosition[0];
              return movingWindowPosition[0] - posXDiff;
            })();
      const newWindowPosY =
        (movingWindowPosition[1] / oldDesktopSize[1]) * newDesktopSize[1];

      // const newWindowSizeX =
      //   (movingWindowSize[0] / oldDesktopSize[0]) * newDesktopSize[0];
      // const newWindowSizeY =
      //   (movingWindowSize[1] / oldDesktopSize[1]) * newDesktopSize[1];

      return { position: [newWindowPosX, newWindowPosY] as Tuple<number> };
    };

    windowsStates.updateAllMovingWindowsStateMap((s) =>
      changeIndividualMovingWindowState(s)
    );
  };

  onMounted(() => {
    if (desktopElement.value !== undefined && desktopElement.value !== null) {
      helperHandlerWindowResizeUpdateWindowsManagerState();
      // resize event handler
      window.addEventListener(
        "resize",
        helperHandlerWindowResizeUpdateWindowsManagerState
      );

      // update size for all moving windows
      watch(
        () => desktopStates.sizeWindowsManager,
        (newSize, oldSize) => {
          helperSpreadDesktopSizeStateChangeToMovingWindows(newSize, oldSize);
        }
      );
    }
  });

  onUnmounted(() => {
    if (desktopElement.value !== undefined && desktopElement.value !== null) {
      window.removeEventListener(
        "resize",
        helperHandlerWindowResizeUpdateWindowsManagerState
      );
    }
  });
}
