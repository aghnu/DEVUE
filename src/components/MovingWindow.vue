<script setup lang="ts">
import MovingWindowContent from "./MovingWindowContent.vue";
import MovingWindowTitleBar from "./MovingWindowTitleBar.vue";
import { computed } from "@vue/reactivity";

// type
export type MovingWindowResizeDirection =
  | "se"
  | "sw"
  | "ne"
  | "nw"
  | "n"
  | "w"
  | "s"
  | "e";

export interface MovingWindowActionEvent {
  id: string;
  type: "resize" | "move";
  direction?: MovingWindowResizeDirection;
}

// define props
const props = defineProps<{
  id: string;
  order: number;
  position: [number, number];
  size: [number, number];
}>();

// define events
const emits = defineEmits<{
  (e: "movingWindowResizeStart", eventInfo: MovingWindowActionEvent): void;
  (e: "movingWindowResizeEnd", eventInfo: MovingWindowActionEvent): void;
  (e: "movingWindowMoveStart", eventInfo: MovingWindowActionEvent): void;
  (e: "movingWindowMoveEnd", eventInfo: MovingWindowActionEvent): void;
}>();

// compute styling string
const styleWindowPositionLeft = computed(
  () => String(props.position[0]) + "px"
);
const styleWindowPositionTop = computed(() => String(props.position[1]) + "px");
const styleWindowSizeWidth = computed(() => String(props.size[0]) + "px");
const styleWindowSizeHeight = computed(() => String(props.size[1]) + "px");
const styleWindowZIndex = computed(() => String(props.order));
</script>

<template>
  <div class="MovingWindow">
    <div
      class="MovingWindow__title_bar"
      @mousedown="
        emits('movingWindowMoveStart', { id: props.id, type: 'move' })
      "
      @touchstart="
        emits('movingWindowMoveStart', { id: props.id, type: 'move' })
      "
      @mouseup="emits('movingWindowMoveEnd', { id: props.id, type: 'move' })"
      @touchend="emits('movingWindowMoveEnd', { id: props.id, type: 'move' })"
    >
      <MovingWindowTitleBar />
    </div>
    <div class="MovingWindow__content">
      <MovingWindowContent />
    </div>

    <div
      class="MovingWindow__panel_resize MovingWindow__panel_resize--direction-se"
      @mousedown="
        emits('movingWindowResizeStart', {
          id: props.id,
          direction: 'se',
          type: 'resize',
        })
      "
      @touchstart="
        emits('movingWindowResizeStart', {
          id: props.id,
          direction: 'se',
          type: 'resize',
        })
      "
      @mouseup="
        emits('movingWindowResizeEnd', {
          id: props.id,
          direction: 'se',
          type: 'resize',
        })
      "
      @touchend="
        emits('movingWindowResizeEnd', {
          id: props.id,
          direction: 'se',
          type: 'resize',
        })
      "
    ></div>

    <div
      class="MovingWindow__panel_resize MovingWindow__panel_resize--direction-sw"
      @mousedown="
        emits('movingWindowResizeStart', {
          id: props.id,
          direction: 'sw',
          type: 'resize',
        })
      "
      @touchstart="
        emits('movingWindowResizeStart', {
          id: props.id,
          direction: 'sw',
          type: 'resize',
        })
      "
      @mouseup="
        emits('movingWindowResizeEnd', {
          id: props.id,
          direction: 'sw',
          type: 'resize',
        })
      "
      @touchend="
        emits('movingWindowResizeEnd', {
          id: props.id,
          direction: 'sw',
          type: 'resize',
        })
      "
    ></div>

    <div
      class="MovingWindow__panel_resize MovingWindow__panel_resize--direction-ne"
      @mousedown="
        emits('movingWindowResizeStart', {
          id: props.id,
          direction: 'ne',
          type: 'resize',
        })
      "
      @touchstart="
        emits('movingWindowResizeStart', {
          id: props.id,
          direction: 'ne',
          type: 'resize',
        })
      "
      @mouseup="
        emits('movingWindowResizeEnd', {
          id: props.id,
          direction: 'ne',
          type: 'resize',
        })
      "
      @touchend="
        emits('movingWindowResizeEnd', {
          id: props.id,
          direction: 'ne',
          type: 'resize',
        })
      "
    ></div>

    <div
      class="MovingWindow__panel_resize MovingWindow__panel_resize--direction-nw"
      @mousedown="
        emits('movingWindowResizeStart', {
          id: props.id,
          direction: 'nw',
          type: 'resize',
        })
      "
      @touchstart="
        emits('movingWindowResizeStart', {
          id: props.id,
          direction: 'nw',
          type: 'resize',
        })
      "
      @mouseup="
        emits('movingWindowResizeEnd', {
          id: props.id,
          direction: 'nw',
          type: 'resize',
        })
      "
      @touchend="
        emits('movingWindowResizeEnd', {
          id: props.id,
          direction: 'nw',
          type: 'resize',
        })
      "
    ></div>

    <div
      class="MovingWindow__panel_resize MovingWindow__panel_resize--direction-n"
      @mousedown="
        emits('movingWindowResizeStart', {
          id: props.id,
          direction: 'n',
          type: 'resize',
        })
      "
      @touchstart="
        emits('movingWindowResizeStart', {
          id: props.id,
          direction: 'n',
          type: 'resize',
        })
      "
      @mouseup="
        emits('movingWindowResizeEnd', {
          id: props.id,
          direction: 'n',
          type: 'resize',
        })
      "
      @touchend="
        emits('movingWindowResizeEnd', {
          id: props.id,
          direction: 'n',
          type: 'resize',
        })
      "
    ></div>

    <div
      class="MovingWindow__panel_resize MovingWindow__panel_resize--direction-w"
      @mousedown="
        emits('movingWindowResizeStart', {
          id: props.id,
          direction: 'w',
          type: 'resize',
        })
      "
      @touchstart="
        emits('movingWindowResizeStart', {
          id: props.id,
          direction: 'w',
          type: 'resize',
        })
      "
      @mouseup="
        emits('movingWindowResizeEnd', {
          id: props.id,
          direction: 'w',
          type: 'resize',
        })
      "
      @touchend="
        emits('movingWindowResizeEnd', {
          id: props.id,
          direction: 'w',
          type: 'resize',
        })
      "
    ></div>

    <div
      class="MovingWindow__panel_resize MovingWindow__panel_resize--direction-s"
      @mousedown="
        emits('movingWindowResizeStart', {
          id: props.id,
          direction: 's',
          type: 'resize',
        })
      "
      @touchstart="
        emits('movingWindowResizeStart', {
          id: props.id,
          direction: 's',
          type: 'resize',
        })
      "
      @mouseup="
        emits('movingWindowResizeEnd', {
          id: props.id,
          direction: 's',
          type: 'resize',
        })
      "
      @touchend="
        emits('movingWindowResizeEnd', {
          id: props.id,
          direction: 's',
          type: 'resize',
        })
      "
    ></div>

    <div
      class="MovingWindow__panel_resize MovingWindow__panel_resize--direction-e"
      @mousedown="
        emits('movingWindowResizeStart', {
          id: props.id,
          direction: 'e',
          type: 'resize',
        })
      "
      @touchstart="
        emits('movingWindowResizeStart', {
          id: props.id,
          direction: 'e',
          type: 'resize',
        })
      "
      @mouseup="
        emits('movingWindowResizeEnd', {
          id: props.id,
          direction: 'e',
          type: 'resize',
        })
      "
      @touchend="
        emits('movingWindowResizeEnd', {
          id: props.id,
          direction: 'e',
          type: 'resize',
        })
      "
    ></div>
  </div>
</template>

<style scoped lang="scss">
.MovingWindow {
  position: absolute;
  display: block;
  flex-direction: column;

  height: v-bind(styleWindowSizeHeight);
  width: v-bind(styleWindowSizeWidth);
  left: v-bind(styleWindowPositionLeft);
  top: v-bind(styleWindowPositionTop);

  z-index: v-bind(styleWindowZIndex);

  background-color: aqua;

  --title-height: 1.75rem;

  &__title_bar {
    height: var(--title-height);
    background-color: yellow;
  }

  &__content {
    height: calc(100% - var(--title-height));
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
