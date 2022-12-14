<script setup lang="ts">
import { toRaw } from "vue";
import { Tuple } from "../types/TypeBasic";
import MovingWindowContent from "./MovingWindowContent.vue";
import MovingWindowTitleBar from "./MovingWindowTitleBar.vue";
import { computed } from "@vue/reactivity";
import { useDesktopStatesStore } from "../stores/desktopStates";
import { useWindowsStatesStore } from "../stores/windowsStates";

import { MovingWindowResizeDirection } from "../types/TypeWindows";

// store
const desktopStates = useDesktopStatesStore();
const windowsStates = useWindowsStatesStore();

// define props
const props = defineProps<{
  id: string;
  order: number;
  position: Tuple<number>;
  size: Tuple<number>;
  focused: boolean;
}>();

// // define events
// const emits = defineEmits<{
//   (e: "movingWindowActionEventStart", eventInfo: MovingWindowActionEvent): void;
//   (e: "movingWindowActionEventEnd", eventInfo: MovingWindowActionEvent): void;
// }>();

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
      <div
        class="MovingWindow__window_display__title_bar"
        @mousedown.stop="
          (e) => {
            handlerMouseDown(e);
            updateActionEventMoving();
          }
        "
        @touchstart.stop="
          (e) => {
            handlerTouchStart(e);
            updateActionEventMoving();
          }
        "
        @mouseup.stop="resetActionEvent()"
        @touchend.stop="resetActionEvent()"
      >
        <!-- <MovingWindowTitleBar :focused="props.focused" /> -->
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
        <!-- <MovingWindowContent /> -->
        <!-- <iframe
          src="https://www.aghnu.me"
          frameborder="0"
          style="
             {
              height: 100%;
              width: 100%;
            }
          "
        ></iframe> -->
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
  --title-height: 2.5rem;

  position: absolute;

  height: v-bind(styleWindowSizeHeight);
  width: v-bind(styleWindowSizeWidth);
  left: v-bind(styleWindowPositionLeft);
  top: v-bind(styleWindowPositionTop);

  z-index: v-bind(styleWindowZIndex);

  &__window_display {
    height: 100%;
    width: 100%;

    overflow: hidden;

    border-radius: 0.75rem;
    // box-shadow: 0 0 0.55rem rgba(0, 0, 0, 0.2);
    background-color: $color-block-dark;
    // border: solid;
    // border-width: 2px;
    // border-color: #3c3a40;

    // &--focused {
    //   background-color: red;
    //   // box-shadow: 0 0 0.55rem rgba(0, 0, 0, 0.35);
    //   background-color: #202020;
    // }

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
