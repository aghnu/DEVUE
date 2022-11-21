<script setup lang="ts">
import { ref, Ref, onMounted, onUnmounted } from "vue";
import { useDesktopStatesStore } from "../stores/desktopStates";
import { v4 as uuid } from "uuid";
import MovingWindow from "./MovingWindow.vue";
import {
  MovingWindowResizeDirection,
  EventInfoResize,
  EventInfoMove,
} from "./MovingWindow.vue";

interface MovingWindowLocalState {
  id: string;
  position: Ref<[number, number]>;
  size: Ref<[number, number]>;
}

const movingWindows: MovingWindowLocalState[] = [
  {
    id: uuid(),
    position: ref([20, 50] as [number, number]),
    size: ref([200, 200] as [number, number]),
  },
  {
    id: uuid(),
    position: ref([90, 50] as [number, number]),
    size: ref([100, 100] as [number, number]),
  },
];

const desktopStates = useDesktopStatesStore();
const windowsManagerElement = ref<HTMLDivElement>();
const handlerWindowResizeUpdateWindowsManagerState = (event: UIEvent) => {
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
};

// methods
const handlerWindowResizeStart = (e: EventInfoResize) => {};
const handlerWindowResizeEnd = (e: EventInfoResize) => {};
const handlerWindowMoveStart = (e: EventInfoMove) => {};
const handlerWindowMoveEnd = (e: EventInfoMove) => {};

// life cycle
onMounted(() => {
  window.addEventListener(
    "resize",
    handlerWindowResizeUpdateWindowsManagerState
  );
});

onUnmounted(() => {
  window.removeEventListener(
    "resize",
    handlerWindowResizeUpdateWindowsManagerState
  );
});
</script>

<template>
  <div class="WindowsManager" ref="windowsManagerElement">
    <MovingWindow
      v-for="mw in movingWindows"
      :key="mw.id"
      :id="mw.id"
      :position="mw.position.value"
      :size="mw.size.value"
      @moving-window-move-start="handlerWindowMoveStart"
      @moving-window-move-end="handlerWindowMoveEnd"
      @moving-window-resize-start="handlerWindowResizeStart"
      @moving-window-resize-end="handlerWindowResizeEnd"
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
