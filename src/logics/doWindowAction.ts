import { Tuple } from "../types/TypeBasic";
import { useWindowsStatesStore } from "../stores/windowsStates";
import { useDesktopStatesStore } from "../stores/desktopStates";
import {
  calculateWindowPositionWithConstrain,
  calculateWindowSizeWithConstrain,
} from "./doWindowCreation";
import { MovingWindowID } from "../types/TypeWindows";
import { onMounted } from "vue";

const windowsStates = useWindowsStatesStore();
const desktopStates = useDesktopStatesStore();

function updateMovingWindowPosition(
  movingWindowID: MovingWindowID,
  position: Tuple<number>
) {
  const movingWindowState = windowsStates.getMovingWindowFromID(movingWindowID);
  if (movingWindowState !== null) {
    // update position
    const newPosition = calculateWindowPositionWithConstrain(
      movingWindowState,
      position
    );
    windowsStates.updateMovingWindowState(movingWindowState.id, {
      size: newPosition,
    });
    return position;
  } else {
    console.error(
      "Error: movingWindow not tracked when updating window position"
    );
  }
}

function updateMovingWindowSize(movingWindowID: string, size: Tuple<number>) {
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

function executeWindowsActionEvent() {
  const helperWindowActionExecuteFuncMove = (
    currentWindowActionState: CurrentWindowActionState,
    movingWindowState: MovingWindowLocalState
  ) => {
    // move window relative to original pointer snapshot
    const windowPositionSnapshot =
      currentWindowActionState.windowPositionSnapshot;
    const pointerPositionCurrent = desktopStates.relativePositionPointer;
    const pointerPositionSnapshot =
      currentWindowActionState.pointerPositionSnapshot;

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
    currentWindowActionState: CurrentWindowActionState,
    movingWindowState: MovingWindowLocalState
  ) => {
    // direction

    const helperFuncResizeToDirection = (
      direction: MovingWindowResizeDirection
    ) => {
      // port code from the old project, may need refactor later
      const windowStateSnapshotPosition =
        currentWindowActionState.windowPositionSnapshot;
      const windowStateSnapshotSize =
        currentWindowActionState.windowSizeSnapshot;
      const pointerStateSnapshotPosition =
        currentWindowActionState.pointerPositionSnapshot;

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
    switch (currentWindowActionState.event.direction!) {
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
    if (currentWindowAction.value !== null) {
      const movingWindowState: MovingWindowLocalState | undefined =
        movingWindows.value.get(currentWindowAction.value.event.id);

      if (movingWindowState !== undefined) {
        // move window to top
        windowOrderStackOperationMoveToTop(movingWindowState.id);
        switch (currentWindowAction.value.event.type) {
          case "move":
            windowActionExecuteFuncMove(
              currentWindowAction.value,
              movingWindowState
            );
            break;
          case "resize":
            windowActionExecuteFuncResize(
              currentWindowAction.value,
              movingWindowState
            );
            break;
        }
      } else {
        console.error(
          `Error: window action requested on MovingWindow object id:${currentWindowAction.value.event.id}, but its state is not tracked inside WindowsManager`
        );
        resetWindowActionState();
      }
    }
  };

  onMounted(() => {});
}
