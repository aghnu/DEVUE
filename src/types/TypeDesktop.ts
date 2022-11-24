export type PointerOperation = 'move' | 'down';

export type PointerLocation = 'left' | 'right' | 'top' | 'center';

export interface DesktopStates {
    positionPointer: [number, number];
    positionWindowsManager: [number, number];
    sizeWindowsManager: [number, number];
    lastPointerOperationType: PointerOperation;
  }