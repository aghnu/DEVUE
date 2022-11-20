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
const windowsContainerElement = ref<HTMLDivElement>();
const handlerWindowResizeUpdateWindowsContainerState = (event: UIEvent) => {
  if (windowsContainerElement.value !== undefined && windowsContainerElement.value !== null) {
    const rect = windowsContainerElement.value.getBoundingClientRect();
    desktopStates.updateSizeWindowsContainer([windowsContainerElement.value.offsetWidth, windowsContainerElement.value.offsetHeight]);
    desktopStates.updatePositionWindowsContainer([rect.left, rect.top]);
  }
};

// life cycle
onMounted(() => {
  window.addEventListener('resize', handlerWindowResizeUpdateWindowsContainerState);
});

onUnmounted(() => {
  window.removeEventListener('resize', handlerWindowResizeUpdateWindowsContainerState);
});


</script>

<template>
  <div class="WindowsContainer" ref="windowsContainerElement">
    <MovingWindow v-for="mw in movingWindows" :position="mw.position.value" :size="mw.size.value" />
  </div>
</template>

<style scoped lang="scss">
.WindowsContainer {
  background-color: red;
  height: 100%;
  width: 100%;
}
</style>
