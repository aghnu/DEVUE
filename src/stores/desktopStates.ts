import { defineStore } from "pinia";

interface DesktopStates {}

export const useDesktopStatesStore = defineStore("desktopStates", {
  state: (): DesktopStates => {
    return {};
  },
  getters: {},
  actions: {},
});
