import { defineStore } from "pinia";

export type PointerOperation = 'move' | 'down';

interface DesktopStates {
  positionPointer: [number, number];
  positionWindowsManager: [number, number];
  sizeWindowsManager: [number, number];
  lastPointerOperationType: PointerOperation;
}

export const useDesktopStatesStore = defineStore("desktopStates", {
  state: (): DesktopStates => {
    return {
      positionPointer: [0, 0],
      sizeWindowsManager: [0, 0],
      positionWindowsManager: [0, 0],
      lastPointerOperationType: 'move',
    };
  },
  getters: {
    relativePosXPointer(): number {
      return (
        Math.min(
          Math.max(this.positionPointer[0], this.positionWindowsManager[0]),
          this.positionWindowsManager[0] + this.sizeWindowsManager[0]
        ) - this.positionWindowsManager[0]
      );
    },
    relativePosYPointer(): number {
      return (
        Math.min(
          Math.max(this.positionPointer[1], this.positionWindowsManager[1]),
          this.positionWindowsManager[1] + this.sizeWindowsManager[1]
        ) - this.positionWindowsManager[1]
      );
    },
    relativePositionPointer(): [number, number] {
      return [this.relativePosXPointer, this.relativePosYPointer];
    },
  },
  actions: {
    updatePointerOperationType(operationType: PointerOperation) {
      this.lastPointerOperationType = operationType;
    },
    
    updatePositionPointer(newPosition: [number, number]) {
      this.positionPointer = newPosition;
    },

    updateSizeWindowsManager(newSize: [number, number]) {
      this.sizeWindowsManager = newSize;
    },

    updatePositionWindowsManager(newPosition: [number, number]) {
      this.positionWindowsManager = newPosition;
    },
  },
});
