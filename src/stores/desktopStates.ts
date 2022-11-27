import { Tuple } from "../types/TypeBasic";

import { defineStore } from "pinia";
import { DesktopStatesStore } from "../types/TypeStores";
import { PointerOperation } from "../types/TypeDesktop";

export const useDesktopStatesStore = defineStore("desktopStates", {
  state: (): DesktopStatesStore => {
    return {
      positionPointer: [0, 0],
      sizeWindowsManager: [0, 0],
      positionWindowsManager: [0, 0],
      lastPointerOperationType: "move",
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
    relativePositionPointer(): Tuple<number> {
      return [this.relativePosXPointer, this.relativePosYPointer];
    },
  },
  actions: {
    updatePointerOperationType(operationType: PointerOperation) {
      this.lastPointerOperationType = operationType;
    },

    updatePositionPointer(newPosition: Tuple<number>) {
      this.positionPointer = newPosition;
    },

    updateSizeWindowsManager(newSize: Tuple<number>) {
      this.sizeWindowsManager = newSize;
    },

    updatePositionWindowsManager(newPosition: Tuple<number>) {
      this.positionWindowsManager = newPosition;
    },
  },
});
