import { Tuple } from "../types/TypeBasic";
import { MovingWindowLocalState } from "../types/TypeWindows";
import { useDesktopStatesStore } from "../stores/desktopStates";
import { WINDOW_CONFIG } from "../constants/WindowManager";
import { useWindowsStatesStore } from "../stores/windowsStates";

export function calculateWindowPositionWithConstrain(
  movingWindowState: MovingWindowLocalState,
  position: Tuple<number>
): Tuple<number> {
  // porting the original logic here. change later?
  const desktopStates = useDesktopStatesStore();
  const desktopSize = desktopStates.sizeWindowsManager;
  const movingWindowSize = movingWindowState.size;

  const maxX = desktopSize[0] - WINDOW_CONFIG.MIN_WINDOW_VISIABLE_BOARDER;
  const maxY = desktopSize[1] - WINDOW_CONFIG.MIN_WINDOW_VISIABLE_BOARDER;

  const minX =
    0 - (movingWindowSize[0] - WINDOW_CONFIG.MIN_WINDOW_VISIABLE_BOARDER);
  const minY = 0;

  const newPosX = Math.min(Math.max(position[0], minX), maxX);
  const newPosY = Math.min(Math.max(position[1], minY), maxY);

  return [newPosX, newPosY] as Tuple<number>;
}
export function calculateWindowSizeWithConstrain(
  movingWindowState: MovingWindowLocalState,
  size: Tuple<number>
): Tuple<number> {
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

  return [newSizeX, newSizeY] as Tuple<number>;
}
export function initMovingWindowState(
  movingWindowStateDetached: MovingWindowLocalState
): MovingWindowLocalState {
  const desktopStates = useDesktopStatesStore();
  const windowsStates = useWindowsStatesStore();

  const topWindow = windowsStates.topWindow;
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

    movingWindowStateDetached.size = calculateWindowSizeWithConstrain(
      movingWindowStateDetached,
      [initSizeX, initSizeY]
    );
  };

  const generateInitPos = () => {
    const initPosX = (areaSize[0] - movingWindowStateDetached.size[0]) / 2;
    const initPosY = (areaSize[1] - movingWindowStateDetached.size[1]) / 3;

    movingWindowStateDetached.position = calculateWindowPositionWithConstrain(
      movingWindowStateDetached,
      [initPosX, initPosY]
    );
  };

  if (topWindow !== null) {
    // calculate size and pos from top window
    const initPosX =
      topWindow.position[0] + WINDOW_CONFIG.WIN_INIT_STACK_POSITION_OFFSET[0];
    const initPosY =
      topWindow.position[1] + WINDOW_CONFIG.WIN_INIT_STACK_POSITION_OFFSET[1];
    const initSizeX = topWindow.size[0];
    const initSizeY = topWindow.size[1];

    // set size and pos
    movingWindowStateDetached.size = calculateWindowSizeWithConstrain(
      movingWindowStateDetached,
      [initSizeX, initSizeY]
    );
    movingWindowStateDetached.position = calculateWindowPositionWithConstrain(
      movingWindowStateDetached,
      [initPosX, initPosY]
    );

    if (helperCheckMovingWindowInsideDesktop() === false) {
      // calculate size and pos from top window
      const initPosX =
        topWindow.position[0] + WINDOW_CONFIG.WIN_INIT_STACK_POSITION_OFFSET[0];
      const initPosY = topWindow.position[1];

      // set size and pos
      movingWindowStateDetached.size = calculateWindowSizeWithConstrain(
        movingWindowStateDetached,
        [initSizeX, initSizeY]
      );
      movingWindowStateDetached.position = calculateWindowPositionWithConstrain(
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
        movingWindowStateDetached.size = calculateWindowSizeWithConstrain(
          movingWindowStateDetached,
          [initSizeX, initSizeY]
        );
        movingWindowStateDetached.position =
          calculateWindowPositionWithConstrain(movingWindowStateDetached, [
            initPosX,
            initPosY,
          ]);

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
    generateInitSize();
    generateInitPos();
  }

  return movingWindowStateDetached;
}
