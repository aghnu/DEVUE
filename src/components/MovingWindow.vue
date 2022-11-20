<script setup lang="ts">
import MovingWindowContent from "./MovingWindowContent.vue";
import MovingWindowTitleBar from "./MovingWindowTitleBar.vue";
import { computed } from "@vue/reactivity";

// define props
const props = defineProps<{
  position: [number, number];
  size: [number, number];
}>();

// compute styling string
const styleWindowPositionLeft = computed(() => String(props.position[0]) + "px");
const styleWindowPositionTop = computed(() => String(props.position[1]) + "px");
const styleWindowSizeWidth = computed(() => String(props.size[0]) + "px");
const styleWindowSizeHeight = computed(() => String(props.size[1]) + "px");
</script>

<template>
  <div class="MovingWindow">
    <div class="MovingWindow__title_bar">
      <MovingWindowTitleBar />
    </div>
    <div class="MovingWindow__content">
      <MovingWindowContent />
    </div>

    <div class="MovingWindow__panel_resize MovingWindow__panel_resize--direction-se"></div>
    <div class="MovingWindow__panel_resize MovingWindow__panel_resize--direction-sw"></div>
    <div class="MovingWindow__panel_resize MovingWindow__panel_resize--direction-ne"></div>
    <div class="MovingWindow__panel_resize MovingWindow__panel_resize--direction-nw"></div>

    <div class="MovingWindow__panel_resize MovingWindow__panel_resize--direction-n"></div>
    <div class="MovingWindow__panel_resize MovingWindow__panel_resize--direction-w"></div>
    <div class="MovingWindow__panel_resize MovingWindow__panel_resize--direction-s"></div>
    <div class="MovingWindow__panel_resize MovingWindow__panel_resize--direction-e"></div>
  </div>
</template>

<style scoped lang="scss">
.MovingWindow {
  position: absolute;
  display: flex;
  flex-direction: column;

  height: v-bind(styleWindowSizeHeight);
  width: v-bind(styleWindowSizeWidth);
  left: v-bind(styleWindowPositionLeft);
  top: v-bind(styleWindowPositionTop);

  background-color: aqua;

  &__title_bar {
    height: 1.75rem;
    background-color: yellow;
  }

  &__content {
    height: 100%;
    background-color: purple;
  }

  &__panel_resize {
    position: absolute;
    background-color: green;

    &--direction {
      @mixin MovingWindow__panel_resize--corner {
        width: 1rem;
        height: 1rem;
        border-radius: 100%;
        z-index: 1;
      }

      @mixin MovingWindow__panel_resize--edge {
        width: 0.5rem;
        height: 0.5rem;
        z-index: 0;
      }

      &-se {
        @include MovingWindow__panel_resize--corner();
        bottom: 0;
        right: 0;
        transform: translate(30%, 30%);
        cursor: nwse-resize;
      }

      &-sw {
        @include MovingWindow__panel_resize--corner();
        bottom: 0;
        left: 0;
        transform: translate(-30%, 30%);
        cursor: nesw-resize;
      }

      &-ne {
        @include MovingWindow__panel_resize--corner();
        top: 0;
        right: 0;
        transform: translate(30%, -30%);
        cursor: nesw-resize;
      }

      &-nw {
        @include MovingWindow__panel_resize--corner();
        top: 0;
        left: 0;
        transform: translate(-30%, -30%);
        cursor: nwse-resize;
      }

      &-n {
        @include MovingWindow__panel_resize--edge();
        width: 100%;
        top: 0;
        left: 0;
        transform: translate(0, -50%);
        cursor: ns-resize;
      }

      &-s {
        @include MovingWindow__panel_resize--edge();
        width: 100%;
        bottom: 0;
        left: 0;
        transform: translate(0, 50%);
        cursor: ns-resize;
      }

      &-w {
        @include MovingWindow__panel_resize--edge();
        height: 100%;
        bottom: 0;
        left: 0;
        transform: translate(-50%, 0);
        cursor: ew-resize;
      }

      &-e {
        @include MovingWindow__panel_resize--edge();
        height: 100%;
        bottom: 0;
        right: 0;
        transform: translate(50%, 0);
        cursor: ew-resize;
      }
    }
  }
}
</style>
