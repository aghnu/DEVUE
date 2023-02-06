<script setup lang="ts">
import { ref } from "vue";

import MovingWindowApplications from "./MovingWindowApplications.vue";
import WindowsManagerGhostPanel from "./WindowsManagerGhostPanel.vue";

import { storeToRefs } from "pinia";
import { useWindowsStatesStore } from "../stores/windowsStates";
import {
  connectWindowResizeStateUpdate,
  connectWindowsActionEvent,
} from "../logics/doWindowAction";

// variables
const windowsState = useWindowsStatesStore();
const { movingWindows, topWindow, actionEvent } = storeToRefs(windowsState);
const windowsManagerElement = ref<HTMLDivElement>();

// connect logics
connectWindowResizeStateUpdate(windowsManagerElement); // tracking resize event of the given element, udpate desktop state accordingly
connectWindowsActionEvent();
</script>

<template>
  <div class="WindowsManager" ref="windowsManagerElement">
    <WindowsManagerGhostPanel
      :focused-moving-window-state="(topWindow !== null) ? movingWindows.get(topWindow.id)! : null"
      :ghost-panel-enabled="
        actionEvent !== null ? actionEvent.type === 'move' : false
      "
    />
    <MovingWindowApplications></MovingWindowApplications>
  </div>
</template>

<style scoped lang="scss">
.WindowsManager {
  position: relative;
  height: 100%;
  width: 100%;
}
</style>
