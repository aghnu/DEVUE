<script setup lang="ts">
import { ref } from "vue";

import MovingWindowApplications from "./MovingWindowApplications.vue";
import WindowsManagerGhostPanel from "./WindowsManagerGhostPanel.vue";

import {
  connectWindowResizeStateUpdate,
  connectWindowsActionEvent,
} from "../logics/doWindowAction";

// variables
const windowsManagerElement = ref<HTMLDivElement>();

// connect logics
connectWindowResizeStateUpdate(windowsManagerElement); // tracking resize event of the given element, udpate desktop state accordingly
connectWindowsActionEvent();
</script>

<template>
  <div class="WindowsManager" ref="windowsManagerElement">
    <WindowsManagerGhostPanel />
    <MovingWindowApplications />
  </div>
</template>

<style scoped lang="scss">
.WindowsManager {
  position: relative;
  height: 100%;
  width: 100%;
}
</style>
