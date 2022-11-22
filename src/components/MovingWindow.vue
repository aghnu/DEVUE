<script setup lang="ts">
import MovingWindowContent from "./MovingWindowContent.vue";
import MovingWindowTitleBar from "./MovingWindowTitleBar.vue";
import { computed } from "@vue/reactivity";
import { useDesktopStatesStore } from "../stores/desktopStates";

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
  type: "resize" | "move" | "focus";
  direction?: MovingWindowResizeDirection;
}

// store
const desktopStates = useDesktopStatesStore();

// define props
const props = defineProps<{
  id: string;
  order: number;
  position: [number, number];
  size: [number, number];
}>();

// define events
const emits = defineEmits<{
  (e: "movingWindowActionEventStart", eventInfo: MovingWindowActionEvent): void;
  (e: "movingWindowActionEventEnd", eventInfo: MovingWindowActionEvent): void;
}>();

// compute styling string
const styleWindowPositionLeft = computed(
  () => String(props.position[0]) + "px"
);
const styleWindowPositionTop = computed(() => String(props.position[1]) + "px");
const styleWindowSizeWidth = computed(() => String(props.size[0]) + "px");
const styleWindowSizeHeight = computed(() => String(props.size[1]) + "px");
const styleWindowZIndex = computed(() => String(props.order));

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
</script>

<template>
  <div class="MovingWindow">
    <div
      class="MovingWindow__title_bar"
      @mousedown.stop="
        (e) => {
          handlerMouseDown(e);
          emits('movingWindowActionEventStart', { id: props.id, type: 'move' });
        }
      "
      @touchstart.stop="
        (e) => {
          handlerTouchStart(e);
          emits('movingWindowActionEventStart', { id: props.id, type: 'move' });
        }
      "
      @mouseup.stop="
        emits('movingWindowActionEventEnd', { id: props.id, type: 'move' })
      "
      @touchend.stop="
        emits('movingWindowActionEventEnd', { id: props.id, type: 'move' })
      "
    >
      <MovingWindowTitleBar />
    </div>
    <div
      class="MovingWindow__content"
      @mousedown.stop="
        (e) => {
          handlerMouseDown(e);
          emits('movingWindowActionEventStart', {
            id: props.id,
            type: 'focus',
          });
        }
      "
      @touchstart.stop="
        (e) => {
          handlerTouchStart(e);
          emits('movingWindowActionEventStart', {
            id: props.id,
            type: 'focus',
          });
        }
      "
      @mouseup.stop="
        emits('movingWindowActionEventEnd', { id: props.id, type: 'focus' })
      "
      @touchend.stop="
        emits('movingWindowActionEventEnd', { id: props.id, type: 'focus' })
      "
    >
      <MovingWindowContent />
    </div>

    <div
      class="MovingWindow__panel_resize MovingWindow__panel_resize--direction-se"
      @mousedown.stop="
        (e) => {
          handlerMouseDown(e);
          emits('movingWindowActionEventStart', {
            id: props.id,
            direction: 'se',
            type: 'resize',
          });
        }
      "
      @touchstart.stop="
        (e) => {
          handlerTouchStart(e);
          emits('movingWindowActionEventStart', {
            id: props.id,
            direction: 'se',
            type: 'resize',
          });
        }
      "
      @mouseup.stop="
        emits('movingWindowActionEventEnd', {
          id: props.id,
          direction: 'se',
          type: 'resize',
        })
      "
      @touchend.stop="
        emits('movingWindowActionEventEnd', {
          id: props.id,
          direction: 'se',
          type: 'resize',
        })
      "
    ></div>

    <div
      class="MovingWindow__panel_resize MovingWindow__panel_resize--direction-sw"
      @mousedown.stop="
        (e) => {
          handlerMouseDown(e);
          emits('movingWindowActionEventStart', {
            id: props.id,
            direction: 'sw',
            type: 'resize',
          });
        }
      "
      @touchstart.stop="
        (e) => {
          handlerTouchStart(e);
          emits('movingWindowActionEventStart', {
            id: props.id,
            direction: 'sw',
            type: 'resize',
          });
        }
      "
      @mouseup.stop="
        emits('movingWindowActionEventEnd', {
          id: props.id,
          direction: 'sw',
          type: 'resize',
        })
      "
      @touchend.stop="
        emits('movingWindowActionEventEnd', {
          id: props.id,
          direction: 'sw',
          type: 'resize',
        })
      "
    ></div>

    <div
      class="MovingWindow__panel_resize MovingWindow__panel_resize--direction-ne"
      @mousedown.stop="
        (e) => {
          handlerMouseDown(e);
          emits('movingWindowActionEventStart', {
            id: props.id,
            direction: 'ne',
            type: 'resize',
          });
        }
      "
      @touchstart.stop="
        (e) => {
          handlerTouchStart(e);
          emits('movingWindowActionEventStart', {
            id: props.id,
            direction: 'ne',
            type: 'resize',
          });
        }
      "
      @mouseup.stop="
        emits('movingWindowActionEventEnd', {
          id: props.id,
          direction: 'ne',
          type: 'resize',
        })
      "
      @touchend.stop="
        emits('movingWindowActionEventEnd', {
          id: props.id,
          direction: 'ne',
          type: 'resize',
        })
      "
    ></div>

    <div
      class="MovingWindow__panel_resize MovingWindow__panel_resize--direction-nw"
      @mousedown.stop="
        (e) => {
          handlerMouseDown(e);
          emits('movingWindowActionEventStart', {
            id: props.id,
            direction: 'nw',
            type: 'resize',
          });
        }
      "
      @touchstart.stop="
        (e) => {
          handlerTouchStart(e);
          emits('movingWindowActionEventStart', {
            id: props.id,
            direction: 'nw',
            type: 'resize',
          });
        }
      "
      @mouseup.stop="
        emits('movingWindowActionEventEnd', {
          id: props.id,
          direction: 'nw',
          type: 'resize',
        })
      "
      @touchend.stop="
        emits('movingWindowActionEventEnd', {
          id: props.id,
          direction: 'nw',
          type: 'resize',
        })
      "
    ></div>

    <div
      class="MovingWindow__panel_resize MovingWindow__panel_resize--direction-n"
      @mousedown.stop="
        (e) => {
          handlerMouseDown(e);
          emits('movingWindowActionEventStart', {
            id: props.id,
            direction: 'n',
            type: 'resize',
          });
        }
      "
      @touchstart.stop="
        (e) => {
          handlerTouchStart(e);
          emits('movingWindowActionEventStart', {
            id: props.id,
            direction: 'n',
            type: 'resize',
          });
        }
      "
      @mouseup.stop="
        emits('movingWindowActionEventEnd', {
          id: props.id,
          direction: 'n',
          type: 'resize',
        })
      "
      @touchend.stop="
        emits('movingWindowActionEventEnd', {
          id: props.id,
          direction: 'n',
          type: 'resize',
        })
      "
    ></div>

    <div
      class="MovingWindow__panel_resize MovingWindow__panel_resize--direction-w"
      @mousedown.stop="
        (e) => {
          handlerMouseDown(e);
          emits('movingWindowActionEventStart', {
            id: props.id,
            direction: 'w',
            type: 'resize',
          });
        }
      "
      @touchstart.stop="
        (e) => {
          handlerTouchStart(e);
          emits('movingWindowActionEventStart', {
            id: props.id,
            direction: 'w',
            type: 'resize',
          });
        }
      "
      @mouseup.stop="
        emits('movingWindowActionEventEnd', {
          id: props.id,
          direction: 'w',
          type: 'resize',
        })
      "
      @touchend.stop="
        emits('movingWindowActionEventEnd', {
          id: props.id,
          direction: 'w',
          type: 'resize',
        })
      "
    ></div>

    <div
      class="MovingWindow__panel_resize MovingWindow__panel_resize--direction-s"
      @mousedown.stop="
        (e) => {
          handlerMouseDown(e);
          emits('movingWindowActionEventStart', {
            id: props.id,
            direction: 's',
            type: 'resize',
          });
        }
      "
      @touchstart.stop="
        (e) => {
          handlerTouchStart(e);
          emits('movingWindowActionEventStart', {
            id: props.id,
            direction: 's',
            type: 'resize',
          });
        }
      "
      @mouseup.stop="
        emits('movingWindowActionEventEnd', {
          id: props.id,
          direction: 's',
          type: 'resize',
        })
      "
      @touchend.stop="
        emits('movingWindowActionEventEnd', {
          id: props.id,
          direction: 's',
          type: 'resize',
        })
      "
    ></div>

    <div
      class="MovingWindow__panel_resize MovingWindow__panel_resize--direction-e"
      @mousedown.stop="
        (e) => {
          handlerMouseDown(e);
          emits('movingWindowActionEventStart', {
            id: props.id,
            direction: 'e',
            type: 'resize',
          });
        }
      "
      @touchstart.stop="
        (e) => {
          handlerTouchStart(e);
          emits('movingWindowActionEventStart', {
            id: props.id,
            direction: 'e',
            type: 'resize',
          });
        }
      "
      @mouseup.stop="
        emits('movingWindowActionEventEnd', {
          id: props.id,
          direction: 'e',
          type: 'resize',
        })
      "
      @touchend.stop="
        emits('movingWindowActionEventEnd', {
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
  --title-height: 1.75rem;

  position: absolute;
  display: block;
  flex-direction: column;

  height: v-bind(styleWindowSizeHeight);
  width: v-bind(styleWindowSizeWidth);
  left: v-bind(styleWindowPositionLeft);
  top: v-bind(styleWindowPositionTop);

  z-index: v-bind(styleWindowZIndex);

  border-radius: 0.55rem;
  box-shadow: 0 0 0.55rem rgba(0, 0, 0, 0.2);
  background-color: #282828;
  border: solid;
  border-width: 2px;
  border-color: #3c3a40;

  &__title_bar {
    height: var(--title-height);
  }

  &__content {
    height: calc(100% - var(--title-height));
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
