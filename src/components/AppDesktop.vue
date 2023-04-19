<script setup lang="ts">
import ActionBar from "./ActionBar.vue";
import AppFooter from "./AppFooter.vue";
import MovingWindowApplications from "./MovingWindowApplications.vue";
import WindowsManagerGhostPanel from "./WindowsManagerGhostPanel.vue";
import StatusBar from "./StatusBar.vue";
import WidgetsManager from "./WidgetsManager.vue";
import { onMounted, onUnmounted, ref } from "vue";

import {
  connectWindowResizeStateUpdate,
  connectWindowsActionEvent,
} from "../logics/doWindowAction";
import { connectWindowSnapping } from "../logics/doWindowSnapping";
import { Trigger } from "../utilities/trigger";
import { useDesktopPointerDown } from "../composables/useMovingWindowConfig";

// variables
const windowsManagerElement = ref<HTMLDivElement>();
const DesktopLoaded = ref(false);
const actionBarAppPressTrigger = Trigger.build();

// handlers
const {
  handlerMouseDown,
  handlerTouchStart,
  handlerMouseMove,
  handlerTouchMove,
} = useDesktopPointerDown();

// TODO: refactor this notify trigger flow
const handlerInitDefaultApplications = () => {
  actionBarAppPressTrigger.notify("terminal");
};

const handlerImageLoad = () => {
  DesktopLoaded.value = true;
  setTimeout(() => {
    handlerInitDefaultApplications();
  }, 1 * 1000);
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
  <div :class="['Desktop', { 'Desktop--loading': !DesktopLoaded }]">
    <img
      class="Desktop__wallpaper"
      alt=""
      role="presentation"
      src="../assets/img/devue_park.jpg"
      @load="handlerImageLoad"
    />
    <div class="Desktop__status_bar">
      <StatusBar></StatusBar>
    </div>
    <div ref="windowsManagerElement" class="Desktop__windows">
      <WidgetsManager />
      <WindowsManagerGhostPanel />
      <MovingWindowApplications />
    </div>
    <div class="Desktop__action_bar">
      <div id="teleport-actionbar-menu"></div>
      <ActionBar :press-button-trigger="actionBarAppPressTrigger" />
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

  opacity: 1;

  transition: opacity 2s ease-out;

  &--loading {
    pointer-events: none;
    opacity: 0;
  }

  &__wallpaper {
    position: absolute;
    height: 100%;
    width: 100%;
    z-index: 0;
    pointer-events: none;
    object-fit: cover;
    object-position: center;
  }

  &__status_bar {
    position: relative;
    height: fit-content;
    width: 100%;
    z-index: 2;
  }

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
