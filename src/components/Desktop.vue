<script setup lang="ts">
import ActionBar from "./ActionBar.vue";
import AppFooter from "./AppFooter.vue";
import MovingWindowApplications from "./MovingWindowApplications.vue";
import WindowsManagerGhostPanel from "./WindowsManagerGhostPanel.vue";
import { onMounted, onUnmounted, ref } from "vue";
import { useDesktopStatesStore } from "../stores/desktopStates";

import {
  connectWindowResizeStateUpdate,
  connectWindowsActionEvent,
} from "../logics/doWindowAction";
import { connectWindowSnapping } from "../logics/doWindowSnapping";
import { AppTerminal } from "../applications/AppTerminal";

// variables
const desktopStates = useDesktopStatesStore();
const windowsManagerElement = ref<HTMLDivElement>();

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

const handlerInitDefaultApplications = () => {
  new AppTerminal().open();
};

// connect logics
connectWindowResizeStateUpdate(windowsManagerElement); // tracking resize event of the given element, udpate desktop state accordingly
connectWindowsActionEvent();
connectWindowSnapping();

// life cycle
onMounted(() => {
  // update pointer position state
  document.addEventListener("mousemove", handlerMouseMove);
  document.addEventListener("mousedown", handlerMouseDown);
  document.addEventListener("touchmove", handlerTouchMove, { passive: false });
  document.addEventListener("touchstart", handlerTouchStart, {
    passive: false,
  });
  handlerInitDefaultApplications();
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
    <div class="Desktop__windows" ref="windowsManagerElement">
      <WindowsManagerGhostPanel />
      <MovingWindowApplications />
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
  @include mixin-center-children;
  @include mixin-disable-pointer;

  display: flex;
  flex-direction: column;
  position: relative;

  height: 100%;
  width: 100%;

  background-color: $color-background-dark;

  &__windows {
    position: relative;
    height: 100%;
    width: 100%;
    z-index: 1;
  }

  &__action_bar {
    @include mixin-center-children;
    @include mixin-disable-pointer;

    padding: 1rem 0.5rem;

    position: relative;
    height: fit-content;
    width: 100%;
    z-index: 2;
  }

  &__footer {
    @include mixin-disable-pointer;

    position: relative;
    height: fit-content;
    width: 100%;
    z-index: 0;
  }
}
</style>
