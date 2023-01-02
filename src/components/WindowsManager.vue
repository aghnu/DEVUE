<script setup lang="ts">
import { onMounted, ref } from "vue";

import MovingWindow from "./MovingWindow.vue";
import WindowsManagerGhostPanel from "./WindowsManagerGhostPanel.vue";

import { storeToRefs } from "pinia";
import { useWindowsStatesStore } from "../stores/windowsStates";
import {
  connectWindowResizeStateUpdate,
  connectWindowsActionEvent,
} from "../logics/doWindowAction";
import { createMovingWindowMockup } from "../logics/doWindowCreation";

// variables
const windowsState = useWindowsStatesStore();
const { movingWindows, topWindow, actionEvent } = storeToRefs(windowsState);
const windowsManagerElement = ref<HTMLDivElement>();

// connect logics
connectWindowResizeStateUpdate(windowsManagerElement); // tracking resize event of the given element, udpate desktop state accordingly
connectWindowsActionEvent();

onMounted(() => {
  // mockup
  windowsState.addMovingWindow(createMovingWindowMockup());
  // windowsState.addMovingWindow(createMovingWindowMockup());
  // windowsState.addMovingWindow(createMovingWindowMockup());
});
</script>

<template>
  <div class="WindowsManager" ref="windowsManagerElement">
    <WindowsManagerGhostPanel
      :focused-moving-window-state="(topWindow !== null) ? movingWindows.get(topWindow.id)! : null"
      :ghost-panel-enabled="
        actionEvent !== null ? actionEvent.type === 'move' : false
      "
    />
    <MovingWindow
      v-for="[id, mvState] in movingWindows"
      :key="id"
      :id="id"
      :position="mvState.position"
      :size="mvState.size"
      :order="mvState.order"
      :focused="topWindow !== null && mvState.id === topWindow.id"
    />
  </div>
</template>

<style scoped lang="scss">
.WindowsManager {
  position: relative;
  overflow: hidden;
  height: 100%;
  width: 100%;

  border-radius: 1rem;
  // box-shadow: 0 0 0.55rem rgba(0, 0, 0, 0.35);
  background-color: $color-block-bright;
}
</style>
