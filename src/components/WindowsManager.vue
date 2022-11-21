<script setup lang="ts">
import { ref, Ref, onMounted, onUnmounted, watch } from "vue";
import { useDesktopStatesStore } from "../stores/desktopStates";
import { v4 as uuid } from "uuid";
import MovingWindow from "./MovingWindow.vue";
import {
  MovingWindowResizeDirection,
  EventInfoResize,
  EventInfoMove,
} from "./MovingWindow.vue";

// types
interface CurrentWindowActionState {
  windowPositionSnapshot: [number, number];
  pointerPositionSnapshot: [number, number];
  event: EventInfoMove | EventInfoResize;
}

interface MovingWindowLocalState {
  position: Ref<[number, number]>;
  size: Ref<[number, number]>;
}

// mockups
const movingWindows: Map<string, MovingWindowLocalState> = new Map([
  [
    uuid(),
    {
      position: ref([20, 50] as [number, number]),
      size: ref([200, 200] as [number, number]),
    },
  ],
  [
    uuid(),
    {
      position: ref([90, 50] as [number, number]),
      size: ref([100, 100] as [number, number]),
    },
  ],
]);

// variables
const desktopStates = useDesktopStatesStore();
const windowsManagerElement = ref<HTMLDivElement>();
let currentWindowActionState: CurrentWindowActionState | null = null;

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
function handlerWindowActionStart(e: EventInfoResize | EventInfoMove) {
  const movingWindowState: MovingWindowLocalState | undefined =
    movingWindows.get(e.id);
  if (movingWindowState === undefined) {
    // MovingWindow does not exist in movingWindows, this should never happend
    console.error(
      `Error: MovingWindow id:${e.id} triggered an event but it is not tracked by WindowsManager`
    );
  } else {
    currentWindowActionState = {
      event: e,
      pointerPositionSnapshot: [
        desktopStates.relativePosXPointer,
        desktopStates.relativePosYPointer,
      ],
      windowPositionSnapshot: movingWindowState.position.value,
    };
  }
}
function handlerWindowActionEnd(e: EventInfoResize | EventInfoMove) {
  if (
    currentWindowActionState !== null &&
    currentWindowActionState.event.id === e.id
  ) {
    resetWindowActionState();
  }
}

// other functions
function resetWindowActionState() {
  currentWindowActionState = null;
}
function windowActionExecuteFuncMove(
  currentWindowActionState: CurrentWindowActionState,
  movingWindowState: MovingWindowLocalState
) {
  // move window relative to original pointer snapshot
  const windowPositionSnapshot =
    currentWindowActionState.windowPositionSnapshot;
  const pointerPositionCurrent = desktopStates.relativePositionPointer;
  const pointerPositionSnapshot =
    currentWindowActionState.pointerPositionSnapshot;

  const windowsPosXNew =
    windowPositionSnapshot[0] +
    pointerPositionCurrent[0] -
    pointerPositionSnapshot[0];
  const windowsPosYNew =
    windowPositionSnapshot[1] +
    pointerPositionCurrent[1] -
    pointerPositionSnapshot[1];

  // set new
  movingWindowState.position.value = [windowsPosXNew, windowsPosYNew];
}
function windowActionExecuteFuncResize(
  currentWindowActionState: CurrentWindowActionState,
  movingWindowState: MovingWindowLocalState
) {}
function executeWindowAction() {
  if (currentWindowActionState !== null) {
    switch (currentWindowActionState.event.type) {
      case "move":
        {
          const movingWindowState: MovingWindowLocalState | undefined =
            movingWindows.get(currentWindowActionState.event.id);

          if (movingWindowState !== undefined) {
            windowActionExecuteFuncMove(
              currentWindowActionState,
              movingWindowState
            );
          } else {
            console.error(
              `Error: window action requested on MovingWindow object id:${currentWindowActionState.event.id}, but its state is not tracked inside WindowsManager`
            );
            resetWindowActionState();
          }
        }
        break;
      case "resize":
        {
        }
        break;
    }
  }
}

// reactive watch
watch(
  () => desktopStates.relativePositionPointer,
  () => {
    executeWindowAction();
  }
);

// life cycle
onMounted(() => {
  handlerWindowResizeUpdateWindowsManagerState();
  window.addEventListener(
    "resize",
    handlerWindowResizeUpdateWindowsManagerState
  );
  window.addEventListener("blur", resetWindowActionState);
  document.addEventListener("touchend", resetWindowActionState);
  document.addEventListener("mouseup", resetWindowActionState);
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
    <MovingWindow
      v-for="[id, mvState] in movingWindows"
      :key="id"
      :id="id"
      :position="mvState.position.value"
      :size="mvState.size.value"
      @moving-window-move-start="handlerWindowActionStart"
      @moving-window-move-end="handlerWindowActionEnd"
      @moving-window-resize-start="handlerWindowActionStart"
      @moving-window-resize-end="handlerWindowActionEnd"
    />
  </div>
</template>

<style scoped lang="scss">
.WindowsManager {
  background-color: red;
  height: 100%;
  width: 100%;
}
</style>
