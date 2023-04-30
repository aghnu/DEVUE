import { defineStore } from "pinia";
import { AppName } from "../types/TypeApplication";
import {
  ApplicationWindowsStatesID,
  WindowsStatesStore,
} from "../types/TypeStores";
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
    movingWindowsOrderStack(state): MovingWindowID[] {
      return Array.from(state.movingWindows.values())
        .sort((a, b) => b.order - a.order)
        .map((e) => e.id);
    },
    movingWindowTotalCount(): number {
      return this.movingWindowsOrderStack.length;
    },
    topWindow(state): MovingWindowLocalState | null {
      return state.movingWindows.get(this.movingWindowsOrderStack[0]) ?? null;
    },
    applicationWindowsStates(state): ApplicationWindowsStatesID {
      const appToStatesID = new Map() as ApplicationWindowsStatesID;
      Array.from(state.movingWindows.values()).forEach((s) => {
        const name = s.appInstance.name;
        const movingWindowID = s.id;

        const movingWindowIDArray =
          appToStatesID.get(name) ?? ([] as MovingWindowID[]);
        movingWindowIDArray.push(movingWindowID);
        appToStatesID.set(name, movingWindowIDArray);
      });

      return appToStatesID;
    },
    getApplicationsInstanceCount() {
      return (name: AppName): number => {
        const movingWindowIDArray =
          this.applicationWindowsStates.get(name) ?? [];
        return movingWindowIDArray.length;
      };
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

    resetMovingWindow() {
      Array.from(this.movingWindows.values()).forEach((state) => {
        state.appInstance.close();
      });
      this.$reset();
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
      const movingWindow = this.movingWindows.get(movingWindowID);
      if (movingWindow) {
        Object.assign(movingWindow, partialWindowState);
      }
    },

    getMovingWindowFromID(
      movingWindowID: MovingWindowID
    ): MovingWindowLocalState | null {
      const movingWindow = this.movingWindows.get(movingWindowID);
      if (movingWindow) {
        return movingWindow;
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
          this.updateMovingWindowState(id, partialState);
        });
      });
    },
  },
});
