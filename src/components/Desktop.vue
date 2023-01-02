<script setup lang="ts">
import ActionBar from "./ActionBar.vue";
import WindowsManager from "./WindowsManager.vue";
import { onMounted, onUnmounted } from "vue";
import { useDesktopStatesStore } from "../stores/desktopStates";

const desktopStates = useDesktopStatesStore();

// handlers
const handlerMouseMove = (e: MouseEvent) => {
  e.preventDefault();
  desktopStates.updatePointerOperationType("move");
  desktopStates.updatePositionPointer([e.clientX, e.clientY]);
};

const handlerTouchMove = (e: TouchEvent) => {
  e.preventDefault();
  desktopStates.updatePointerOperationType("move");
  desktopStates.updatePositionPointer([
    e.touches[0].clientX,
    e.touches[0].clientY,
  ]);
};

const handlerMouseDown = (e: MouseEvent) => {
  e.preventDefault();
  desktopStates.updatePointerOperationType("down");
  desktopStates.updatePositionPointer([e.clientX, e.clientY]);
};

const handlerTouchStart = (e: TouchEvent) => {
  e.preventDefault();
  desktopStates.updatePointerOperationType("down");
  desktopStates.updatePositionPointer([
    e.touches[0].clientX,
    e.touches[0].clientY,
  ]);
};

// life cycle
onMounted(() => {
  // update pointer position state
  document.addEventListener("mousemove", handlerMouseMove);
  document.addEventListener("mousedown", handlerMouseDown);
  document.addEventListener("touchmove", handlerTouchMove, { passive: false });
  document.addEventListener("touchstart", handlerTouchStart, {
    passive: false,
  });
});

onUnmounted(() => {
  // clean up pointer listeners
  document.removeEventListener("mousemove", handlerMouseMove);
  document.removeEventListener("mousedown", handlerMouseDown);
  document.removeEventListener("touchmove", handlerTouchMove);
  document.removeEventListener("touchstart", handlerTouchStart);
});
</script>

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
  --action-bar-height: 5rem;

  height: 100%;
  width: 100%;
  display: block;
  flex-direction: column;

  background-color: $color-block-dark;

  &__windows {
    height: calc(100% - var(--action-bar-height));
    padding: 1.25rem;
  }

  &__action_bar {
    height: var(--action-bar-height);
  }
}
</style>
