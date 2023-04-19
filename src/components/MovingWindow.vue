<script setup lang="ts">
import { ref, computed } from "vue";
import MovingWindowContent from "./MovingWindowContent.vue";
import MovingWindowTitleBar from "./MovingWindowTitleBar.vue";
import { useWindowsStatesStore } from "../stores/windowsStates";
import { MOVING_WINDOW_DIRECTIONS } from "../constants/MovingWindow";
import {
  useDesktopPointerDown,
  useMovingWindowActionEvent,
  useMovingWindowConfig,
} from "../composables/useMovingWindowConfig";
import { useMovingWindowStyleGlobalCursor } from "../composables/useMovingWindowConfig";

import { MovingWindowLocalState } from "../types/TypeWindows";
import { connectWindowMoving } from "../logics/connectWindowMoving";
import { useDynamicColor } from "../composables/useDynamicColor";
import { useTrackComputedWidthHeightNumber } from "../composables/useTrackComputedStyle";

// define props
const props = defineProps<{
  state: MovingWindowLocalState;
}>();

// store
const windowsStates = useWindowsStatesStore();

// variables
const movingWindowElement = ref<HTMLDivElement>();
const windowDisplayElement = ref<HTMLDivElement>();
const isBackgroundTransparent = computed(
  () => props.state.appInstance.applicationStyle.isBgTransparent
);

// compute styling string
const { elementDropShadowIntensityStyle, elementBorderColorStyle } =
  useDynamicColor(windowDisplayElement);
const { styleWindowCursor } = useMovingWindowStyleGlobalCursor("auto");
const windowWidthNumberComputed =
  useTrackComputedWidthHeightNumber(movingWindowElement).widthNumber;
const { styleWindowZIndex, isWindowFocused, isWindowMoving } =
  useMovingWindowConfig(ref(props.state));
const styleApplicationColorBackground = computed(
  () =>
    props.state.appInstance.applicationStyle.colorBackground ??
    "var(--color-app-default-background)"
);
const styleApplicationColorTitleText = computed(
  () =>
    props.state.appInstance.applicationStyle.colorTitleText ??
    "var(--color-taskbar-text-bright)"
);
const styleIsTitleBarColor = computed(() =>
  props.state.appInstance.applicationStyle.hideTitleBarFading
    ? "transparent"
    : elementBorderColorStyle.value
);
const styleTransformScale = computed(() => {
  const scaleFactor = 15;
  const scale =
    (windowWidthNumberComputed.value + scaleFactor) /
    windowWidthNumberComputed.value;
  return isWindowMoving.value ? `scale(${scale})` : "scale(1)";
});

// handler
const { handlerMouseDown, handlerTouchStart } = useDesktopPointerDown();
const {
  updateActionEventFocus,
  updateActionEventMoving,
  updateActionEventResize,
  resetActionEvent,
} = useMovingWindowActionEvent(ref(props.state));
const handlerCloseWindow = () => {
  windowsStates.removeMovingWindow(props.state.id);
};
const handlerMaxWindow = () => {
  if (props.state.snapped === "center") {
    windowsStates.updateMovingWindowState(props.state.id, {
      snapped: "top",
    });
  } else if (props.state.snapped === "top") {
    windowsStates.updateMovingWindowState(props.state.id, {
      snapped: "center",
    });
  }
};

// connect
connectWindowMoving(ref(props.state), movingWindowElement);
</script>

<template>
  <div ref="movingWindowElement" class="MovingWindow">
    <div
      ref="windowDisplayElement"
      class="MovingWindow__window_display"
      :class="[
        { 'MovingWindow__window_display--focused': isWindowFocused },
        { 'MovingWindow__window_display--glass': isBackgroundTransparent },
      ]"
    >
      <div class="MovingWindow__window_display__title_bar">
        <MovingWindowTitleBar
          :focused="isWindowFocused"
          :text-color="styleApplicationColorTitleText"
          :title-color="styleIsTitleBarColor"
          :moving="isWindowMoving"
          @action:close="handlerCloseWindow"
          @action:movestart="updateActionEventMoving"
          @action:moveover="resetActionEvent"
          @action:max="handlerMaxWindow"
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
        <MovingWindowContent :focused="isWindowFocused">
          <slot></slot>
        </MovingWindowContent>
      </div>
    </div>

    <div
      v-for="direction in MOVING_WINDOW_DIRECTIONS"
      :key="direction"
      :class="[
        'MovingWindow__panel_resize',
        `MovingWindow__panel_resize--direction-${direction}`,
        { 'MovingWindow__panel_resize--disabled': state.snapped !== 'center' },
        {
          'MovingWindow__panel_resize--global-pointer':
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
.MovingWindow {
  @include mixin-gpu-accelerate();

  --title-height: 1.75rem;

  position: absolute;
  z-index: v-bind(styleWindowZIndex);
  transform: v-bind(styleTransformScale);

  will-change: height, width, left, top, z-index, transform;

  transition: transform 0.225s ease-in-out;

  &__window_display {
    height: 100%;
    width: 100%;

    overflow: hidden;

    border-radius: 0.5rem;
    box-shadow: v-bind(elementDropShadowIntensityStyle);
    background-color: v-bind(styleApplicationColorBackground);
    border: solid;
    border-width: 2px;
    border-color: v-bind(elementBorderColorStyle);

    transition: box-shadow 0.15s;

    &--glass {
      @include mixin-glassblur();
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

    &--disabled {
      pointer-events: none;
    }

    &--global-pointer {
      cursor: v-bind(styleWindowCursor);
    }
  }
}
</style>
