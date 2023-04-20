<script setup lang="ts">
import { ref } from "vue";
import {
  useDesktopPointerDown,
  useMovingWindowActionEvent,
  useMovingWindowStyleGlobalCursor,
} from "../composables/useMovingWindowConfig";
import {
  MovingWindowLocalState,
  MovingWindowResizeDirection,
} from "../types/TypeWindows";

const props = defineProps<{
  state: MovingWindowLocalState;
}>();

const { styleWindowCursor } = useMovingWindowStyleGlobalCursor("auto");
const { handlerMouseDown, handlerTouchStart } = useDesktopPointerDown();
const { updateActionEventResize, resetActionEvent } =
  useMovingWindowActionEvent(ref(props.state));
</script>

<template>
  <div>
    <div
      v-for="direction in 
      ['se', 'sw', 'ne', 'nw', 'e', 'n', 'w', 's'] satisfies MovingWindowResizeDirection[] as MovingWindowResizeDirection[]"
      :key="direction"
      :class="[
        'MovingWindowResizePanel',
        `MovingWindowResizePanel--direction-${direction}`,
        { 'MovingWindowResizePanel--disabled': state.snapped !== 'center' },
        {
          'MovingWindowResizePanel--global-pointer':
            styleWindowCursor !== 'auto',
        },
      ]"
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
.MovingWindowResizePanel {
  position: absolute;

  &--direction {
    @mixin corner {
      width: 1rem;
      height: 1rem;
      border-radius: 100%;
      z-index: 1;
    }

    @mixin edge {
      width: 0.5rem;
      height: 0.5rem;
      z-index: 0;
    }

    &-se {
      @include corner();
      bottom: 0;
      right: 0;
      transform: translate(30%, 30%);
      cursor: nwse-resize;
    }

    &-sw {
      @include corner();
      bottom: 0;
      left: 0;
      transform: translate(-30%, 30%);
      cursor: nesw-resize;
    }

    &-ne {
      @include corner();
      top: 0;
      right: 0;
      transform: translate(30%, -30%);
      cursor: nesw-resize;
    }

    &-nw {
      @include corner();
      top: 0;
      left: 0;
      transform: translate(-30%, -30%);
      cursor: nwse-resize;
    }

    &-n {
      @include edge();
      width: 100%;
      top: 0;
      left: 0;
      transform: translate(0, -50%);
      cursor: ns-resize;
    }

    &-s {
      @include edge();
      width: 100%;
      bottom: 0;
      left: 0;
      transform: translate(0, 50%);
      cursor: ns-resize;
    }

    &-w {
      @include edge();
      height: 100%;
      bottom: 0;
      left: 0;
      transform: translate(-50%, 0);
      cursor: ew-resize;
    }

    &-e {
      @include edge();
      height: 100%;
      bottom: 0;
      right: 0;
      transform: translate(50%, 0);
      cursor: ew-resize;
    }
  }

  &--disabled {
    pointer-events: none;
  }

  &--global-pointer {
    cursor: v-bind(styleWindowCursor);
  }
}
</style>
