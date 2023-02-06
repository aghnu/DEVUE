<script setup lang="ts">
import ActionBar from "./ActionBar.vue";
import WindowsManager from "./WindowsManager.vue";
import AppFooter from "./AppFooter.vue";
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
    <div class="Desktop__footer">
      <AppFooter />
    </div>
  </div>
</template>

<style scoped lang="scss">
.Desktop {
  --height-action-bar: 6rem;
  --height-footer: 3rem;

  @include mixin-center-children;
  @include mixin-disable-pointer;

  display: flex;
  flex-direction: column;
  position: relative;

  height: 100%;
  width: 100%;

  background-color: $color-block-dark;

  &__windows {
    position: relative;
    height: 100%;
    width: 100%;
    z-index: 1;
  }

  &__action_bar {
    @include mixin-center-children;
    @include mixin-disable-pointer;

    margin: 0.75rem;

    position: relative;
    height: fit-content;
    width: 100%;
    z-index: 2;
  }

  &__footer {
    @include mixin-disable-pointer;

    position: relative;
    height: var(--height-footer);
    width: 100%;
    z-index: 0;
  }
}
</style>
