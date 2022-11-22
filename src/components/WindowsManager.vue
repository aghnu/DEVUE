<script setup lang="ts">
import { ref, Ref, onMounted, onUnmounted, watch, readonly } from "vue";
import { useDesktopStatesStore } from "../stores/desktopStates";
import { v4 as uuid } from "uuid";
import MovingWindow from "./MovingWindow.vue";
import {
  MovingWindowResizeDirection,
  MovingWindowActionEvent,
} from "./MovingWindow.vue";

// types
interface CurrentWindowActionState {
  windowPositionSnapshot: [number, number];
  windowSizeSnapshot: [number, number];
  pointerPositionSnapshot: [number, number];
  event: MovingWindowActionEvent;
}

interface MovingWindowLocalState {
  id: string;
  order: number;
  position: [number, number];
  size: [number, number];
  sizeMin: [number, number] | null;
  sizeMax: [number, number] | null;
}

const WINDOW_CONFIG = {
  MIN_WINDOW_VISIABLE_BOARDER: 50, // minial visual parts of a moving window within window manager
  DEFAULT_SIZE_MIN_WINDOW: [125, 200] as [number, number],
  WIN_INIT_SIZE_PERC: [0.75, 0.75] as [number, number],
  WIN_INIT_SIZE_RATIO: (16 / 9) as number,
  WIN_INIT_STACK_POSITION_OFFSET: [20, 35] as [number, number],
} as const;

// functions related to window creation, mockup for now
const movingWindows: Ref<Map<string, MovingWindowLocalState>> = ref(new Map());
const movingWindowsOrderStack: Ref<string[]> = ref([]); // when changing order, make sure its atomic, change will trigger a watch

// variables
const desktopStates = useDesktopStatesStore();
const windowsManagerElement = ref<HTMLDivElement>();
let currentWindowActionState: CurrentWindowActionState | null = null;

function initMovingWindowState(
  movingWindowStateDetached: MovingWindowLocalState
) {
  const topWindow: MovingWindowLocalState | null =
    movingWindowsOrderStack.value.length !== 0
      ? movingWindows.value.get(
          movingWindowsOrderStack.value[
            movingWindowsOrderStack.value.length - 1
          ]
        )!
      : null;
  const areaSize = desktopStates.sizeWindowsManager;

  const helperCheckMovingWindowInsideDesktop = () => {
    if (
      movingWindowStateDetached.position[1] < 0 ||
      movingWindowStateDetached.position[0] < 0 ||
      movingWindowStateDetached.position[1] +
        movingWindowStateDetached.size[1] >
        areaSize[1] ||
      movingWindowStateDetached.position[0] +
        movingWindowStateDetached.size[0] >
        areaSize[0]
    ) {
      return false;
    } else {
      return true;
    }
  };

  const generateInitSize = () => {
    const initSizeY = WINDOW_CONFIG.WIN_INIT_SIZE_PERC[1] * areaSize[1];
    const initSizeX = Math.min(
      WINDOW_CONFIG.WIN_INIT_SIZE_PERC[0] * areaSize[0],
      WINDOW_CONFIG.WIN_INIT_SIZE_RATIO * initSizeY
    );

    movingWindowStateDetached.size = calculateWindowSize(
      movingWindowStateDetached,
      [initSizeX, initSizeY]
    );
  };

  const generateInitPos = () => {
    const initPosX = (areaSize[0] - movingWindowStateDetached.size[0]) / 2;
    const initPosY = (areaSize[1] - movingWindowStateDetached.size[1]) / 3;

    movingWindowStateDetached.position = calculateWindowPosition(
      movingWindowStateDetached,
      [initPosX, initPosY]
    );
  };

  if (topWindow !== null) {
    console.log("COOL");
    // calculate size and pos from top window
    const initPosX =
      topWindow.position[0] + WINDOW_CONFIG.WIN_INIT_STACK_POSITION_OFFSET[0];
    const initPosY =
      topWindow.position[1] + WINDOW_CONFIG.WIN_INIT_STACK_POSITION_OFFSET[1];
    const initSizeX = topWindow.size[0];
    const initSizeY = topWindow.size[1];

    // set size and pos
    movingWindowStateDetached.size = calculateWindowSize(
      movingWindowStateDetached,
      [initSizeX, initSizeY]
    );
    movingWindowStateDetached.position = calculateWindowPosition(
      movingWindowStateDetached,
      [initPosX, initPosY]
    );

    if (helperCheckMovingWindowInsideDesktop() === false) {
      // calculate size and pos from top window
      const initPosX =
        topWindow.position[0] + WINDOW_CONFIG.WIN_INIT_STACK_POSITION_OFFSET[0];
      const initPosY = topWindow.position[1];

      // set size and pos
      movingWindowStateDetached.size = calculateWindowSize(
        movingWindowStateDetached,
        [initSizeX, initSizeY]
      );
      movingWindowStateDetached.position = calculateWindowPosition(
        movingWindowStateDetached,
        [initPosX, initPosY]
      );

      if (helperCheckMovingWindowInsideDesktop() === false) {
        // calculate size and pos from top window
        const initPosX = topWindow.position[0];
        const initPosY =
          topWindow.position[1] +
          WINDOW_CONFIG.WIN_INIT_STACK_POSITION_OFFSET[1];

        // set size and pos
        movingWindowStateDetached.size = calculateWindowSize(
          movingWindowStateDetached,
          [initSizeX, initSizeY]
        );
        movingWindowStateDetached.position = calculateWindowPosition(
          movingWindowStateDetached,
          [initPosX, initPosY]
        );

        // try if valid init position
        if (helperCheckMovingWindowInsideDesktop() === false) {
          // not valid
          // try to keep size and retry
          generateInitPos();

          // same position with old top window or size not valid
          if (
            (topWindow.position[0] === movingWindowStateDetached.position[0] &&
              topWindow.position[1] ===
                movingWindowStateDetached.position[1]) ||
            helperCheckMovingWindowInsideDesktop() === false
          ) {
            generateInitSize();
            generateInitPos();
          }
        }
      }
    }
  } else {
    console.log("ok");
    generateInitSize();
    generateInitPos();
  }

  return movingWindowStateDetached;
}

function trackMovingWindowState(movingWindowState: MovingWindowLocalState) {
  // add moving window state to windowsManager and make respective updates
  movingWindows.value.set(movingWindowState.id, movingWindowState);
  windowOrderStackOperationAddNew(movingWindowState.id);
}
function createMovingWindowState(): MovingWindowLocalState {
  // mockup for now
  var orderCount = 0;
  const movingWindowState: MovingWindowLocalState = {
    id: uuid(),
    order: orderCount++,
    position: [0, 0],
    size: [0, 0],
    sizeMin: null,
    sizeMax: null,
  };

  return initMovingWindowState(movingWindowState);
}

// handlers
function handlerWindowResizeUpdateWindowsManagerState() {
  if (
    windowsManagerElement.value !== undefined &&
    windowsManagerElement.value !== null
  ) {
    const rect = windowsManagerElement.value.getBoundingClientRect();
    desktopStates.updateSizeWindowsManager([
      windowsManagerElement.value.offsetWidth,
      windowsManagerElement.value.offsetHeight,
    ]);
    desktopStates.updatePositionWindowsManager([rect.left, rect.top]);
  }
}
function handlerWindowActionStart(e: MovingWindowActionEvent) {
  const movingWindowState: MovingWindowLocalState | undefined =
    movingWindows.value.get(e.id);
  if (movingWindowState === undefined) {
    // MovingWindow does not exist in movingWindows, this should never happend
    console.error(
      `Error: MovingWindow id:${e.id} triggered an event but it is not tracked by WindowsManager`
    );
  } else {
    currentWindowActionState = {
      event: e,
      pointerPositionSnapshot: [
        desktopStates.relativePosXPointer,
        desktopStates.relativePosYPointer,
      ],
      windowPositionSnapshot: movingWindowState.position,
      windowSizeSnapshot: movingWindowState.size,
    };
  }
}
function handlerWindowActionEnd(e: MovingWindowActionEvent) {
  if (
    currentWindowActionState !== null &&
    currentWindowActionState.event.id === e.id
  ) {
    resetWindowActionState();
  }
}

// other functions
function calculateWindowPosition(
  movingWindowState: MovingWindowLocalState,
  position: [number, number]
) {
  // porting the original logic here. change later?
  const desktopSize = desktopStates.sizeWindowsManager;
  const movingWindowSize = movingWindowState.size;

  const maxX = desktopSize[0] - WINDOW_CONFIG.MIN_WINDOW_VISIABLE_BOARDER;
  const maxY = desktopSize[1] - WINDOW_CONFIG.MIN_WINDOW_VISIABLE_BOARDER;

  const minX =
    0 - (movingWindowSize[0] - WINDOW_CONFIG.MIN_WINDOW_VISIABLE_BOARDER);
  const minY = 0;

  const newPosX = Math.min(Math.max(position[0], minX), maxX);
  const newPosY = Math.min(Math.max(position[1], minY), maxY);

  return [newPosX, newPosY] as [number, number];
}

function calculateWindowSize(
  movingWindowState: MovingWindowLocalState,
  size: [number, number]
) {
  // porting the original logic here. change later?
  const windowStateCurrentSizeMin =
    movingWindowState.sizeMin !== null
      ? movingWindowState.sizeMin
      : WINDOW_CONFIG.DEFAULT_SIZE_MIN_WINDOW;
  const windowStateCurrentSizeMax = movingWindowState.sizeMax;

  const newSizeX =
    windowStateCurrentSizeMax !== null
      ? Math.min(
          Math.max(size[0], windowStateCurrentSizeMin[0]),
          windowStateCurrentSizeMax[0]
        )
      : Math.max(size[0], windowStateCurrentSizeMin[0]);

  const newSizeY =
    windowStateCurrentSizeMax !== null
      ? Math.min(
          Math.max(size[1], windowStateCurrentSizeMin[1]),
          windowStateCurrentSizeMax[1]
        )
      : Math.max(size[1], windowStateCurrentSizeMin[1]);

  return [newSizeX, newSizeY] as [number, number];
}

function updateMovingWindowPosition(
  movingWindowID: string,
  position: [number, number]
) {
  const movingWindowState = movingWindows.value.get(movingWindowID);
  if (movingWindowState !== undefined) {
    // update position
    const newPosition = calculateWindowPosition(movingWindowState, position);
    movingWindowState.position = newPosition;
    return position;
  } else {
    console.error(
      "Error: movingWindow not tracked when updating window position"
    );
    return null;
  }
}
function updateMovingWindowSize(
  movingWindowID: string,
  size: [number, number]
) {
  const movingWindowState = movingWindows.value.get(movingWindowID);
  if (movingWindowState !== undefined) {
    const newSize = calculateWindowSize(movingWindowState, size);
    movingWindowState.size = newSize;
    return newSize;
  } else {
    console.error(
      "Error: movingWindow not tracked when updating window position"
    );
    return null;
  }
}
function updateMovingWindowOrder(movingWindowID: string, order: number) {
  const movingWindowState = movingWindows.value.get(movingWindowID);
  if (movingWindowState !== undefined) {
    movingWindowState.order = order;
    return order;
  } else {
    console.error(
      "Error: movingWindow not tracked when updating window position"
    );
    return null;
  }
}
function windowOrderStackOperationAddNew(movingWindowID: string) {
  const movingWindowState = movingWindows.value.get(movingWindowID);
  if (movingWindowState !== undefined) {
    movingWindowsOrderStack.value.push(movingWindowState.id);
  }
}
function windowOrderStackOperationMoveToTop(movingWindowID: string) {
  // check if already on top
  if (
    movingWindowsOrderStack.value.length === 0 ||
    movingWindowsOrderStack.value[movingWindowsOrderStack.value.length - 1] ===
      movingWindowID
  ) {
    return;
  }

  // else, do the operation
  const newMovingWindowOrderStack: string[] = [];
  for (let i = 0; i < movingWindowsOrderStack.value.length; i++) {
    const id = movingWindowsOrderStack.value[i];
    if (id !== movingWindowID) {
      newMovingWindowOrderStack.push(id);
    }
  }
  if (
    newMovingWindowOrderStack.length ===
    movingWindowsOrderStack.value.length - 1
  ) {
    // making sure movingWindowID is tracked
    newMovingWindowOrderStack.push(movingWindowID);
    // update stack
    movingWindowsOrderStack.value = newMovingWindowOrderStack;
  }
}
function resetWindowActionState() {
  currentWindowActionState = null;
}
function windowActionExecuteFuncMove(
  currentWindowActionState: CurrentWindowActionState,
  movingWindowState: MovingWindowLocalState
) {
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
}
function windowActionExecuteFuncResize(
  currentWindowActionState: CurrentWindowActionState,
  movingWindowState: MovingWindowLocalState
) {
  // direction

  const helperFuncResizeToDirection = (
    direction: MovingWindowResizeDirection
  ) => {
    // port code from the old project, may need refactor later
    const windowStateSnapshotPosition =
      currentWindowActionState.windowPositionSnapshot;
    const windowStateSnapshotSize = currentWindowActionState.windowSizeSnapshot;
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
          const positionNew = updateMovingWindowPosition(movingWindowState.id, [
            windowStateCurrentPosition[0],
            newPosY,
          ])!;

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
          const positionNew = updateMovingWindowPosition(movingWindowState.id, [
            newPosX,
            windowStateCurrentPosition[1],
          ])!;

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
}
function executeWindowAction() {
  if (currentWindowActionState !== null) {
    const movingWindowState: MovingWindowLocalState | undefined =
      movingWindows.value.get(currentWindowActionState.event.id);

    if (movingWindowState !== undefined) {
      // move window to top
      windowOrderStackOperationMoveToTop(movingWindowState.id);
      switch (currentWindowActionState.event.type) {
        case "move":
          windowActionExecuteFuncMove(
            currentWindowActionState,
            movingWindowState
          );
          break;
        case "resize":
          windowActionExecuteFuncResize(
            currentWindowActionState,
            movingWindowState
          );
          break;
      }
    } else {
      console.error(
        `Error: window action requested on MovingWindow object id:${currentWindowActionState.event.id}, but its state is not tracked inside WindowsManager`
      );
      resetWindowActionState();
    }
  }
}
function spreadDesktopSizeStateChangeToMovingWindows(
  newDesktopSize: [number, number],
  oldDesktopSize: [number, number]
) {
  const changeIndividualMovingWindowState = (
    movingWindowState: MovingWindowLocalState
  ) => {
    const movingWindowPosition = movingWindowState.position;
    const movingWindowSize = movingWindowState.size;

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

    updateMovingWindowPosition(movingWindowState.id, [
      newWindowPosX,
      newWindowPosY,
    ]);
  };

  movingWindows.value.forEach((movingWindowState, id) => {
    new Promise(() => {
      changeIndividualMovingWindowState(movingWindowState);
    });
  });
}

// life cycle
onMounted(() => {
  // init
  handlerWindowResizeUpdateWindowsManagerState();
  window.addEventListener(
    "resize",
    handlerWindowResizeUpdateWindowsManagerState
  );
  window.addEventListener("blur", resetWindowActionState);
  document.addEventListener("touchend", resetWindowActionState);
  document.addEventListener("mouseup", resetWindowActionState);

  // reactive watch
  // watch pointer state update
  watch(
    () => desktopStates.relativePositionPointer,
    () => {
      executeWindowAction();
    }
  );
  // watch desktop window manager state update
  watch(
    () => desktopStates.sizeWindowsManager,
    (newSize, oldSize) => {
      spreadDesktopSizeStateChangeToMovingWindows(newSize, oldSize);
    }
  );

  // watch window order change
  watch(movingWindowsOrderStack, () => {
    for (let i = 0; i < movingWindowsOrderStack.value.length; i++) {
      const movingWindowStateID = movingWindowsOrderStack.value[i];
      updateMovingWindowOrder(movingWindowStateID, i);
    }
  });

  // init done, window creation

  // MOCKUP, REMOVE LATER
  trackMovingWindowState(createMovingWindowState());
  trackMovingWindowState(createMovingWindowState());
  trackMovingWindowState(createMovingWindowState());
});

onUnmounted(() => {
  window.removeEventListener(
    "resize",
    handlerWindowResizeUpdateWindowsManagerState
  );
  window.removeEventListener("blur", resetWindowActionState);
  document.removeEventListener("touchend", resetWindowActionState);
  document.removeEventListener("mouseup", resetWindowActionState);
});
</script>

<template>
  <div class="WindowsManager" ref="windowsManagerElement">
    <MovingWindow
      v-for="[id, mvState] in movingWindows"
      :key="id"
      :id="id"
      :position="mvState.position"
      :size="mvState.size"
      :order="mvState.order"
      @moving-window-action-event-start="handlerWindowActionStart"
      @moving-window-action-event-end="handlerWindowActionEnd"
    />
  </div>
</template>

<style scoped lang="scss">
.WindowsManager {
  position: relative;
  overflow: hidden;
  height: 100%;
  width: 100%;

  border-radius: 0.75rem;
  box-shadow: 0 0 0.55rem rgba(0, 0, 0, 0.35);
  background-color: rgb(100, 220, 255);
  // background-size: cover;
  // background-position: center center;
}
</style>
