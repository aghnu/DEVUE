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
      actionEvent: null,
    };
  },
  getters: {
    movingWindowsOrderStack(): MovingWindowID[] {
      return Array.from(this.movingWindows.values())
        .sort((a, b) => b.order - a.order)
        .map((e) => e.id);
    },
    topWindow(): MovingWindowLocalState | null {
      return this.movingWindows.get(this.movingWindowsOrderStack[0]) ?? null;
    },
  },
  actions: {
    updateMovingWindowAction(actionEvent: MovingWindowActionEvent) {
      this.actionEvent = actionEvent;
    },

    resetMovingWindowAction() {
      this.actionEvent = null;
    },

    addMovingWindow(movingWindow: MovingWindowLocalState) {
      movingWindow.order = this.topWindow ? this.topWindow.order + 1 : 0;
      this.movingWindows.set(movingWindow.id, movingWindow);
    },

    removeMovingWindow(movingWindowID: MovingWindowID) {
      this.movingWindows.delete(movingWindowID);
    },

    focusMovingWindow(movingWindowID: MovingWindowID) {
      if (this.topWindow && this.topWindow.id === movingWindowID) {
        return;
      }

      const movingWindow = this.movingWindows.get(movingWindowID);
      if (movingWindow) {
        movingWindow.order = this.topWindow ? this.topWindow.order + 1 : 0;
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

    updateAllMovingWindowsStateMap(
      updateFunc: (
        movingWindowState: MovingWindowLocalState
      ) => Partial<MovingWindowLocalState>
    ) {
      this.movingWindows.forEach((movingWindowState, id) => {
        new Promise(() => {
          const partialState = updateFunc(movingWindowState);
          Object.assign(this.movingWindows.get(id)!, partialState);
        });
      });
    },
  },
});
