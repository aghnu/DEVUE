<script setup lang="ts">
import { computed, ref } from "vue";
import { useButtonAction } from "../../composables/useButtonAction";
import { useWindowSizeUnit } from "../../composables/useWindowSizeUnit";

const props = defineProps<{
  text: string;
  handler: (text: string) => void;
}>();

const calculatorPadButtonElement = ref<HTMLButtonElement>();

const {
  pointerDown,
  pointerHover,
  handlerPointerDown,
  handlerPointerUp,
  handlerHover,
  handlerLeave,
} = useButtonAction(() => props.handler(props.text));

const sizeUnit = useWindowSizeUnit(calculatorPadButtonElement).elemin;
</script>

<template>
  <div class="AppCalculatorPad">
    <button
      class="AppCalculatorPad__button"
      :class="[
        {
          'AppCalculatorPad__button--down': pointerDown,
        },
        {
          'AppCalculatorPad__button--hover': !pointerDown && pointerHover,
        },
      ]"
      ref="calculatorPadButtonElement"
      @mousedown="handlerPointerDown"
      @touchstart="handlerPointerDown"
      @mouseup="handlerPointerUp"
      @touchend="handlerPointerUp"
      @mouseover="handlerHover"
      @mouseleave="handlerLeave"
    >
      <p class="AppCalculatorPad__button__text">{{ text }}</p>
    </button>
  </div>
</template>

<style scoped lang="scss">
.AppCalculatorPad {
  @include mixin-center-children;
  height: 100%;
  width: 100%;
  &__button {
    @include mixin-center-children;
    @include mixin-clean-button-style;

    height: 100%;
    width: 100%;

    color: var(--color-calculator-text-display);

    font-size: calc(v-bind(sizeUnit) * 1px * 33);

    transition: background-color 0.05s, transform 0.15s, box-shadow 0.1s;

    &--down {
      opacity: 0.5;
    }

    // &--hover {
    // }

    &__text {
      font-size: 1.2em;
    }
  }
}
</style>
