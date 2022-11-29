<script setup lang="ts">
import { Tuple } from "../types/TypeBasic";
import { ref, Ref, onMounted, onUnmounted, watch, computed } from "vue";
import { useDesktopStatesStore } from "../stores/desktopStates";
import { v4 as uuid } from "uuid";

import MovingWindow from "./MovingWindow.vue";
import WindowsManagerGhostPanel from "./WindowsManagerGhostPanel.vue";

import {
  MovingWindowResizeDirection,
  MovingWindowActionEvent,
  MovingWindowLocalState,
} from "../types/TypeWindows";
import { WINDOW_CONFIG } from "../constants/WindowManager";
import { storeToRefs } from "pinia";
import { useWindowsStatesStore } from "../stores/windowsStates";

// variables
const windowsState = useWindowsStatesStore();
const {
  movingWindows,
  topWindow,
  actionEvent
} = storeToRefs(windowsState);
const windowsManagerElement = ref<HTMLDivElement>();

// connect logics



</script>

<template>
  <div class="WindowsManager" ref="windowsManagerElement">
    <WindowsManagerGhostPanel
      :focused-moving-window-state="(topWindow !== null) ? movingWindows.get(topWindow.id)! : null"
      :ghost-panel-enabled="
        actionEvent !== null
          ? actionEvent.type === 'move'
          : false
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

  border-radius: 0.75rem;
  box-shadow: 0 0 0.55rem rgba(0, 0, 0, 0.35);
  background-image: linear-gradient(
    to left bottom,
    #68b5f7,
    #49c1fb,
    #00d3fc,
    #00e3f1,
    #00f0db,
    #5ffbbe
  );
}
</style>
