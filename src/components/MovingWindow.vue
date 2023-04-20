<script setup lang="ts">
import { ref, computed } from "vue";
import MovingWindowContent from "./MovingWindowContent.vue";
import MovingWindowTitleBar from "./MovingWindowTitleBar.vue";
import { useWindowsStatesStore } from "../stores/windowsStates";
import {
  useDesktopPointerDown,
  useMovingWindowActionEvent,
  useMovingWindowConfig,
} from "../composables/useMovingWindowConfig";

import { MovingWindowLocalState } from "../types/TypeWindows";
import { useDynamicColor } from "../composables/useDynamicColor";
import { useMovingWindow } from "../composables/useMovingWindow";
import { useTrackComputedWidthHeightNumber } from "../composables/useTrackComputedStyle";
import MovingWindowResizePanel from "./MovingWindowResizePanel.vue";

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
const { startMovingWindow } = useMovingWindow(ref(props.state));

// compute styling string
const { elementDropShadowIntensityStyle, elementBorderColorStyle } =
  useDynamicColor(windowDisplayElement);
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
const { updateActionEventFocus, updateActionEventMoving, resetActionEvent } =
  useMovingWindowActionEvent(ref(props.state));
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

// logic
startMovingWindow(movingWindowElement);
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

    <MovingWindowResizePanel :state="state" />
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
}
</style>
