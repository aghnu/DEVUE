<template>
  <div class="Desktop">
    <div class="Desktop__windows">
      <WindowsManager />
    </div>
    <div class="Desktop__action_bar">
      <ActionBar />
    </div>
  </div>
</template>

<style scoped lang="scss">
.Desktop {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;

  &__windows {
    height: 100%;
    padding: 0.5rem;
  }

  &__action_bar {
    height: 5rem;
  }
}
</style>

<script setup lang="ts">
import ActionBar from "./ActionBar.vue";
import WindowsManager from "./WindowsManager.vue";
import { onMounted, onUnmounted } from "vue";
import { useDesktopStatesStore } from "../stores/desktopStates";

const desktopStates = useDesktopStatesStore();

// handlers
const updatePointerPosoition = (position: [number, number]) => {
  desktopStates.updatePositionPointer(position);
};

const handlerMouseMove = (e: MouseEvent) => {
  e.preventDefault();
  desktopStates.updatePointerOperationType("move");
  updatePointerPosoition([e.clientX, e.clientY]);
};

const handlerTouchMove = (e: TouchEvent) => {
  e.preventDefault();
  desktopStates.updatePointerOperationType("move");
  updatePointerPosoition([e.touches[0].clientX, e.touches[1].clientY]);
};

const handlerMouseDown = (e: MouseEvent) => {
  e.preventDefault();
  desktopStates.updatePointerOperationType("down");
  updatePointerPosoition([e.clientX, e.clientY]);
};

const handlerTouchStart = (e: TouchEvent) => {
  e.preventDefault();
  desktopStates.updatePointerOperationType("down");
  updatePointerPosoition([e.touches[0].clientX, e.touches[1].clientY]);
};

// life cycle
onMounted(() => {
  // udpate pointer position state
  document.addEventListener("mousemove", handlerMouseMove);
  document.addEventListener("mousedown", handlerMouseDown);
  document.addEventListener("touchmove", handlerTouchMove);
  document.addEventListener("touchstart", handlerTouchStart);
});

onUnmounted(() => {
  // clean up pointer listeners
  document.removeEventListener("mousemove", handlerMouseMove);
  document.removeEventListener("mousedown", handlerMouseDown);
  document.removeEventListener("touchmove", handlerTouchMove);
  document.removeEventListener("touchstart", handlerTouchStart);
});
</script>
