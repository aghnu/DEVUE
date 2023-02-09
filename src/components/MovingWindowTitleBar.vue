<script setup lang="ts">
import { useDesktopStatesStore } from "../stores/desktopStates";
import { useWindowsStatesStore } from "../stores/windowsStates";
import { getIconClose } from "../utilities/factorySVG";
const props = defineProps<{
  focused: boolean;
}>();

const emits = defineEmits<{
  (e: "action:close"): void;
  (e: "action:movestart"): void;
  (e: "action:moveover"): void;
}>();

const iconClose = getIconClose({
  color: "var(--color-text-dark)",
  size: "100%",
});

// store
const desktopStates = useDesktopStatesStore();

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
  <div class="MovingWindowTitleBar">
    <div
      class="MovingWindowTitleBar__drag"
      @mousedown.stop="
        (e) => {
          handlerMouseDown(e);
          emits('action:movestart');
        }
      "
      @touchstart.stop="
        (e) => {
          handlerTouchStart(e);
          emits('action:movestart');
        }
      "
      @mouseup.stop="emits('action:moveover')"
      @touchend.stop="emits('action:moveover')"
    ></div>

    <div class="MovingWindowTitleBar__action_area">
      <div class="MovingWindowTitleBar__action_area__title_section"></div>
      <div class="MovingWindowTitleBar__action_area__control_section">
        <button
          :class="[
            'MovingWindowTitleBar__action_area__control_section__button',
            {
              'MovingWindowTitleBar__action_area__control_section__button--focused':
                props.focused,
            },
          ]"
          @mousedown.prevent.stop="() => emits('action:close')"
          @touchstart.prevent.stop="() => emits('action:close')"
          v-html="iconClose"
        />
      </div>
    </div>
    <div class="MovingWindowTitleBar__dragbar">
      <div class="MovingWindowTitleBar__dragbar__content" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.MovingWindowTitleBar {
  --MovingWindowTitleBar__control_section--gap: 0.45rem;
  --MovingWindowTitleBar__dragbar--height: 100%;

  height: 100%;
  width: 100%;

  position: relative;

  &__drag {
    height: 100%;
    width: 100%;
  }

  &__action_area {
    @include mixin-disable-pointer;
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;

    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.01);

    &__control_section {
      @include mixin-disable-pointer;

      height: 100%;
      width: fit-content;

      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;

      gap: var(--MovingWindowTitleBar__control_section--gap);
      padding-left: calc(
        1.75 * var(--MovingWindowTitleBar__control_section--gap)
      );
      padding-right: calc(
        1.75 * var(--MovingWindowTitleBar__control_section--gap)
      );

      &__button {
        @include mixin-clean-button-style;

        height: 1rem;
        width: 1rem;
      }
    }
  }

  &__dragbar {
    @include mixin-disable-pointer;
    @include mixin-center-children;
    position: absolute;
    top: 0;
    height: var(--MovingWindowTitleBar__dragbar--height);
    width: 100%;

    &__content {
      height: 0.1rem;
      border-radius: 0.5rem;
      width: 10%;
      max-width: 7.5rem;
      min-width: 2.5rem;
      background-color: $color-text-dark;
    }
  }
}
</style>
