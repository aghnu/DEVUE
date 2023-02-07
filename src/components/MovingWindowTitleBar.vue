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

    <div class="MovingWindowTitleBar__control_section">
      <button
        :class="[
          'MovingWindowTitleBar__button',
          { 'MovingWindowTitleBar__button--focused': props.focused },
        ]"
        @mousedown.stop="() => emits('action:close')"
        @touchstart.stop="() => emits('action:close')"
        v-html="iconClose"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.MovingWindowTitleBar {
  --MovingWindowTitleBar__control_section--gap: 0.45rem;

  height: 100%;
  width: 100%;

  display: flex;
  flex-direction: row;
  justify-content: flex-end;

  position: relative;

  &__drag {
    height: 100%;
    width: 100%;
  }

  &__button {
    @include mixin-clean-button-style;

    height: 0.85rem;
    width: 0.85rem;
  }

  &__control_section {
    @include mixin-disable-pointer;
    position: absolute;

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
  }
}
</style>
