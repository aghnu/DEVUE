import { defineStore } from "pinia";

interface DesktopStates {
  positionPointer: [number, number];
  positionWindowsContainer: [number, number];
  sizeWindowsContainer: [number, number];
}

export const useDesktopStatesStore = defineStore("desktopStates", {
  state: (): DesktopStates => {
    return {
      positionPointer: [0, 0],
      sizeWindowsContainer: [0, 0],
      positionWindowsContainer: [0, 0],
    };
  },
  getters: {
    relativePosXPointer(): number {
      return (
        Math.min(
          Math.max(this.positionPointer[0], this.positionWindowsContainer[0]),
          this.positionWindowsContainer[0] + this.sizeWindowsContainer[0]
        ) - this.positionWindowsContainer[0]
      );
    },
    relativePosYPointer(): number {
      return (
        Math.min(
          Math.max(this.positionPointer[1], this.positionWindowsContainer[1]),
          this.positionWindowsContainer[1] + this.sizeWindowsContainer[1]
        ) - this.positionWindowsContainer[1]
      );
    },
  },
  actions: {
    updatePositionPointer(newPosition: [number, number]) {
      this.positionPointer = newPosition;
    },

    updateSizeWindowsContainer(newSize: [number, number]) {
      this.sizeWindowsContainer = newSize;
    },

    updatePositionWindowsContainer(newPosition: [number, number]) {
      this.positionWindowsContainer = newPosition;
    },
  },
});
