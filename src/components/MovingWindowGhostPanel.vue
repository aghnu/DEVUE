<script setup lang="ts">
import { useMovingWindowGhostPanelStyle } from "../composables/useMovingWindowGhostPanelStyle";

const {
  ghostPanelShow,
  stylePanelFromHeight,
  stylePanelFromLeft,
  stylePanelFromTop,
  stylePanelFromWidth,
  stylePanelToHeight,
  stylePanelToLeft,
  stylePanelToTop,
  stylePanelToWidth,
  stylePanelZIndex,
} = useMovingWindowGhostPanelStyle();
</script>

<template>
  <div class="WindowsManagerGhostPanel">
    <Transition name="WindowsManagerGhostPanel__window">
      <div v-if="ghostPanelShow" class="WindowsManagerGhostPanel__window">
        <div class="WindowsManagerGhostPanel__window__inner"></div>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.WindowsManagerGhostPanel {
  &__window {
    @include mixin-gpu-accelerate();

    position: absolute;
    padding: 0.5rem;

    width: v-bind(stylePanelToWidth);
    height: v-bind(stylePanelToHeight);
    left: v-bind(stylePanelToLeft);
    top: v-bind(stylePanelToTop);

    z-index: v-bind(stylePanelZIndex);

    will-change: height, width, left, top, z-index;

    transition: all 0.35s;

    &__inner {
      height: 100%;
      width: 100%;

      background-color: var(--color-block-transparent);

      border-radius: 0.6rem;
    }
  }
}

.WindowsManagerGhostPanel__window {
  &-enter-from {
    opacity: 0;

    width: v-bind(stylePanelFromWidth);
    height: v-bind(stylePanelFromHeight);
    left: v-bind(stylePanelFromLeft);
    top: v-bind(stylePanelFromTop);
  }

  &-leave-to {
    opacity: 0;

    width: v-bind(stylePanelFromWidth);
    height: v-bind(stylePanelFromHeight);
    left: v-bind(stylePanelFromLeft);
    top: v-bind(stylePanelFromTop);
  }
}
</style>
