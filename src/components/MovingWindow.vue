<script setup lang="ts">
import { toRaw } from "vue";
import { Tuple } from "../types/TypeBasic";
import MovingWindowContent from "./MovingWindowContent.vue";
import MovingWindowTitleBar from "./MovingWindowTitleBar.vue";
import { computed } from "@vue/reactivity";
import { useDesktopStatesStore } from "../stores/desktopStates";
import { useWindowsStatesStore } from "../stores/windowsStates";

import {
  MovingWindowID,
  MovingWindowResizeDirection,
} from "../types/TypeWindows";

// store
const desktopStates = useDesktopStatesStore();
const windowsStates = useWindowsStatesStore();

// define props
const props = defineProps<{
  id: MovingWindowID;
  order: number;
  position: Tuple<number>;
  size: Tuple<number>;
  focused: boolean;
}>();

// compute styling string
const styleWindowPositionLeft = computed(
  () => String(props.position[0]) + "px"
);
const styleWindowPositionTop = computed(() => String(props.position[1]) + "px");
const styleWindowSizeWidth = computed(() => String(props.size[0]) + "px");
const styleWindowSizeHeight = computed(() => String(props.size[1]) + "px");
const styleWindowZIndex = computed(() => String(props.order));
const movingWindowDirections: MovingWindowResizeDirection[] = [
  "se",
  "sw",
  "ne",
  "nw",
  "e",
  "n",
  "w",
  "s",
];

// handler
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

const handlerCloseWindow = () => {
  windowsStates.removeMovingWindow(props.id);
};

function updateActionEventMoving() {
  windowsStates.updateMovingWindowAction({
    id: props.id,
    type: "move",
    windowPositionSnapshot: toRaw(props.position),
    windowSizeSnapshot: toRaw(props.size),
    pointerPositionSnapshot: toRaw(desktopStates.relativePositionPointer),
  });
}

function updateActionEventFocus() {
  windowsStates.updateMovingWindowAction({
    id: props.id,
    type: "focus",
    windowPositionSnapshot: toRaw(props.position),
    windowSizeSnapshot: toRaw(props.size),
    pointerPositionSnapshot: toRaw(desktopStates.relativePositionPointer),
  });
}

function updateActionEventResize(direction: MovingWindowResizeDirection) {
  windowsStates.updateMovingWindowAction({
    id: props.id,
    direction: direction,
    type: "resize",
    windowPositionSnapshot: toRaw(props.position),
    windowSizeSnapshot: toRaw(props.size),
    pointerPositionSnapshot: toRaw(desktopStates.relativePositionPointer),
  });
}

function resetActionEvent() {
  windowsStates.resetMovingWindowAction();
}
</script>

<template>
  <div class="MovingWindow">
    <div
      class="MovingWindow__window_display"
      :class="{ 'MovingWindow__window_display--focused': props.focused }"
    >
      <div class="MovingWindow__window_display__title_bar">
        <MovingWindowTitleBar
          :windowid="id"
          :focused="props.focused"
          @action:close="handlerCloseWindow"
          @action:movestart="updateActionEventMoving"
          @action:moveover="resetActionEvent"
        />
      </div>
      <div
        class="MovingWindow__window_display__content"
        @mousedown.stop="
          (e) => {
            handlerMouseDown(e);
            updateActionEventFocus();
          }
        "
        @touchstart.stop="
          (e) => {
            handlerTouchStart(e);
            updateActionEventFocus();
          }
        "
        @mouseup.stop="resetActionEvent()"
        @touchend.stop="resetActionEvent()"
      >
        <MovingWindowContent>
          <slot></slot>
        </MovingWindowContent>
      </div>
    </div>

    <div
      v-for="direction in movingWindowDirections"
      :class="`MovingWindow__panel_resize MovingWindow__panel_resize--direction-${direction}`"
      @mousedown.stop="
        (e) => {
          handlerMouseDown(e);
          updateActionEventResize(direction);
        }
      "
      @touchstart.stop="
        (e) => {
          handlerTouchStart(e);
          updateActionEventResize(direction);
        }
      "
      @mouseup.stop="resetActionEvent()"
      @touchend.stop="resetActionEvent()"
    ></div>
  </div>
</template>

<style scoped lang="scss">
.MovingWindow {
  --title-height: 1.75rem;

  position: absolute;

  height: v-bind(styleWindowSizeHeight);
  width: v-bind(styleWindowSizeWidth);
  left: v-bind(styleWindowPositionLeft);
  top: v-bind(styleWindowPositionTop);

  z-index: v-bind(styleWindowZIndex);

  will-change: height, width, left, top, z-index;

  &__window_display {
    height: 100%;
    width: 100%;

    overflow: hidden;

    border-radius: 0.75rem;
    box-shadow: $shadow-block-down;
    background-color: $color-app-default-background;
    border: solid;
    border-width: 0.1rem;
    border-color: $color-text-dark;

    transition: box-shadow 0.15s;

    &--focused {
      box-shadow: $shadow-block-float;
    }

    &__title_bar {
      height: var(--title-height);
    }

    &__content {
      height: calc(100% - var(--title-height));
    }
  }

  &__panel_resize {
    position: absolute;

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
