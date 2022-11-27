import { defineStore } from "pinia";
import { WindowsStatesStore } from "../types/TypeStores";
import {
  MovingWindowActionEvent,
  MovingWindowID,
  MovingWindowLocalState,
} from "../types/TypeWindows";

export const useWindowsStatesStore = defineStore("windowsStates", {
  state: (): WindowsStatesStore => {
    return {
      movingWindows: new Map<MovingWindowID, MovingWindowLocalState>(),
      movingWindowsOrderStack: [] as MovingWindowID[],
    };
  },
  getters: {
    topWindow(): MovingWindowLocalState | null {
      const numWindows = this.movingWindowsOrderStack.length;
      if (numWindows === 0) {
        return null;
      } else {
        return this.movingWindows.get(
          this.movingWindowsOrderStack[numWindows - 1]
        )!;
      }
    },

    topWindowActionEvent(): MovingWindowActionEvent | null {
      if (this.topWindow === null) {
        return null;
      } else {
        return this.topWindow.action;
      }
    },
  },
  actions: {
    updateMovingWindowAction(
      movingWindowID: MovingWindowID,
      actionEvent: MovingWindowActionEvent
    ) {
      if (this.movingWindows.has(movingWindowID)) {
        this.movingWindows.get(movingWindowID)!.action = actionEvent;
      }
    },

    resetMovingWindowAction(movingWindowID: MovingWindowID) {
      if (this.movingWindows.has(movingWindowID)) {
        this.movingWindows.get(movingWindowID)!.action = null;
      }
    },

    addMovingWindow(movingWindow: MovingWindowLocalState) {
      movingWindow.order = this.movingWindowsOrderStack.length;

      this.movingWindows.set(movingWindow.id, movingWindow);
      this.movingWindowsOrderStack.push(movingWindow.id);
    },

    focusMovingWindow(movingWindowID: MovingWindowID) {
      const movingWindowsOrderStackTemp: MovingWindowID[] = [];

      // update order stack
      for (let i = 0; i < this.movingWindowsOrderStack.length; i++) {
        const itemID = this.movingWindowsOrderStack[i];
        if (itemID !== movingWindowID) {
          movingWindowsOrderStackTemp.push(itemID);
        }
      }
      movingWindowsOrderStackTemp.push(movingWindowID);
      this.movingWindowsOrderStack = movingWindowsOrderStackTemp;

      // update order
      for (let i = 0; i < movingWindowsOrderStackTemp.length; i++) {
        const itemID = this.movingWindowsOrderStack[i];
        this.movingWindows.get(itemID)!.order = i;
      }
    },

    updateMovingWindowState(
      movingWindowID: MovingWindowID,
      partialWindowState: Partial<MovingWindowLocalState>
    ) {
      if (this.movingWindows.has(movingWindowID)) {
        Object.assign(
          this.movingWindows.get(movingWindowID)!,
          partialWindowState
        );
      }
    },

    getMovingWindowFromID(
      movingWindowID: MovingWindowID
    ): MovingWindowLocalState | null {
      if (this.movingWindows.has(movingWindowID)) {
        return this.movingWindows.get(movingWindowID)!;
      } else {
        return null;
      }
    },
  },
});
