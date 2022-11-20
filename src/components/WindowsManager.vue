<script setup lang="ts">
import MovingWindow from "./MovingWindow.vue";
import { ref, Ref, onMounted, onUnmounted } from "vue";
import { useDesktopStatesStore } from "../stores/desktopStates";

interface MovingWindowLocalState {
  position: Ref<[number, number]>
  size: Ref<[number, number]>
}

const movingWindows: MovingWindowLocalState[] = [
  {
    position: ref([20, 50] as [number, number]),
    size: ref([200, 200] as [number, number])
  },
  {
    position: ref([90, 50] as [number, number]),
    size: ref([100, 100] as [number, number])
  }
]

const desktopStates = useDesktopStatesStore();
const windowsManagerElement = ref<HTMLDivElement>();
const handlerWindowResizeUpdateWindowsManagerState = (event: UIEvent) => {
  if (windowsManagerElement.value !== undefined && windowsManagerElement.value !== null) {
    const rect = windowsManagerElement.value.getBoundingClientRect();
    desktopStates.updateSizeWindowsManager([windowsManagerElement.value.offsetWidth, windowsManagerElement.value.offsetHeight]);
    desktopStates.updatePositionWindowsManager([rect.left, rect.top]);
  }
};

// life cycle
onMounted(() => {
  window.addEventListener('resize', handlerWindowResizeUpdateWindowsManagerState);
});

onUnmounted(() => {
  window.removeEventListener('resize', handlerWindowResizeUpdateWindowsManagerState);
});


</script>

<template>
  <div class="WindowsManager" ref="windowsManagerElement">
    <MovingWindow v-for="mw in movingWindows" :position="mw.position.value" :size="mw.size.value" />
  </div>
</template>

<style scoped lang="scss">
.WindowsManager {
  background-color: red;
  height: 100%;
  width: 100%;
}
</style>
