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
const desktopStates = useDesktopStatesStore();
const windowsState = useWindowsStatesStore();
const {
  movingWindows,
  movingWindowsOrderStack,
  topWindow,
  topWindowActionEvent,
} = storeToRefs(windowsState);
const windowsManagerElement = ref<HTMLDivElement>();

// handlers
function handlerWindowResizeUpdateWindowsManagerState() {
  if (
    windowsManagerElement.value !== undefined &&
    windowsManagerElement.value !== null
  ) {
    const rect = windowsManagerElement.value.getBoundingClientRect();
    desktopStates.updateSizeWindowsManager([
      windowsManagerElement.value.offsetWidth,
      windowsManagerElement.value.offsetHeight,
    ]);
    desktopStates.updatePositionWindowsManager([rect.left, rect.top]);
  }
}

function spreadDesktopSizeStateChangeToMovingWindows(
  newDesktopSize: Tuple<number>,
  oldDesktopSize: Tuple<number>
) {
  const changeIndividualMovingWindowState = (
    movingWindowState: MovingWindowLocalState
  ) => {
    const movingWindowPosition = movingWindowState.position;
    const movingWindowSize = movingWindowState.size;

    const newWindowPosX =
      movingWindowPosition[0] >= 0
        ? (movingWindowPosition[0] / oldDesktopSize[0]) * newDesktopSize[0]
        : (() => {
            // special case left is out of desktop's left edge
            // make the change reverse
            const posXDiff =
              (movingWindowPosition[0] / oldDesktopSize[0]) *
                newDesktopSize[0] -
              movingWindowPosition[0];
            return movingWindowPosition[0] - posXDiff;
          })();
    const newWindowPosY =
      (movingWindowPosition[1] / oldDesktopSize[1]) * newDesktopSize[1];

    // const newWindowSizeX =
    //   (movingWindowSize[0] / oldDesktopSize[0]) * newDesktopSize[0];
    // const newWindowSizeY =
    //   (movingWindowSize[1] / oldDesktopSize[1]) * newDesktopSize[1];

    updateMovingWindowPosition(movingWindowState.id, [
      newWindowPosX,
      newWindowPosY,
    ]);
  };

  movingWindows.value.forEach((movingWindowState, id) => {
    new Promise(() => {
      changeIndividualMovingWindowState(movingWindowState);
    });
  });
}

// life cycle
onMounted(() => {
  // init
  handlerWindowResizeUpdateWindowsManagerState();
  window.addEventListener(
    "resize",
    handlerWindowResizeUpdateWindowsManagerState
  );
  window.addEventListener("blur", resetWindowActionState);
  document.addEventListener("touchend", resetWindowActionState);
  document.addEventListener("mouseup", resetWindowActionState);

  // reactive watch
  // watch pointer state update
  watch(
    () => desktopStates.relativePositionPointer,
    () => {
      executeWindowAction();
    }
  );
  // watch desktop window manager state update
  watch(
    () => desktopStates.sizeWindowsManager,
    (newSize, oldSize) => {
      spreadDesktopSizeStateChangeToMovingWindows(newSize, oldSize);
    }
  );

  // watch window order change
  watch(movingWindowsOrderStack, () => {
    for (let i = 0; i < movingWindowsOrderStack.value.length; i++) {
      const movingWindowStateID = movingWindowsOrderStack.value[i];
      updateMovingWindowOrder(movingWindowStateID, i);
    }
  });

  // init done, window creation

  // MOCKUP, REMOVE LATER
  trackMovingWindowState(createMovingWindowState());
  trackMovingWindowState(createMovingWindowState());
  trackMovingWindowState(createMovingWindowState());
});

onUnmounted(() => {
  window.removeEventListener(
    "resize",
    handlerWindowResizeUpdateWindowsManagerState
  );
  window.removeEventListener("blur", resetWindowActionState);
  document.removeEventListener("touchend", resetWindowActionState);
  document.removeEventListener("mouseup", resetWindowActionState);
});
</script>

<template>
  <div class="WindowsManager" ref="windowsManagerElement">
    <WindowsManagerGhostPanel
      :focused-moving-window-state="(topWindow !== null) ? movingWindows.get(topWindow.id)! : null"
      :ghost-panel-enabled="
        currentWindowAction !== null
          ? currentWindowAction.event.type === 'move'
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
      @moving-window-action-event-start="handlerWindowActionStart"
      @moving-window-action-event-end="handlerWindowActionEnd"
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
