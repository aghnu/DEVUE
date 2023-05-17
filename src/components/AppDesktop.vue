<script setup lang="ts">
import ActionBar from "./ActionBar.vue";
import AppFooter from "./AppFooter.vue";
import AppWindowManager from "./AppWindowManager.vue";
import MovingWindowGhostPanel from "./MovingWindowGhostPanel.vue";
import WidgetsManager from "./WidgetsManager.vue";
import { onMounted, onUnmounted, ref } from "vue";
import GraphSunEye from "./GraphSunEye.vue";

import {
  connectWindowResizeStateUpdate,
  connectWindowsActionEvent,
} from "../logics/doWindowAction";
import { connectWindowSnapping } from "../logics/doWindowSnapping";
import { Trigger } from "../utilities/trigger";
import { useDesktopPointerDown } from "../composables/useMovingWindowConfig";

// variables
const windowsManagerElement = ref<HTMLDivElement>();
const actionBarAppPressTrigger = Trigger.build();

// handlers
const {
  handlerMouseDown,
  handlerTouchStart,
  handlerMouseMove,
  handlerTouchMove,
} = useDesktopPointerDown();

// TODO: refactor this notify trigger flow
// const handlerInitDefaultApplications = () => {
//   // setTimeout(() => {
//   //   actionBarAppPressTrigger.notify("menu");
//   // }, 0.5 * 1000);
// };

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
  // handlerInitDefaultApplications();
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
  <div :class="['Desktop']">
    <div ref="windowsManagerElement" class="Desktop__windows">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="Desktop__graph">
        <GraphSunEye></GraphSunEye>
      </div>
      <WidgetsManager />
      <MovingWindowGhostPanel />
      <AppWindowManager />
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

  &__status_bar {
    position: relative;
    height: fit-content;
    width: 100%;
    z-index: 2;
  }

  &__graph {
    position: absolute;

    height: 10rem;
    width: 10rem;
  }

  &__windows {
    @include mixin-center-children;

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
