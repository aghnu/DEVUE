<script setup lang="ts">
import { computed } from "vue";
import { useButtonAction } from "../../composables/useButtonAction";
import { CalculatorPadType } from "../../types/TypeCalculator";

const props = defineProps<{
  text: string;
  type: CalculatorPadType;
  handler: () => void;
}>();

const {
  pointerDown,
  pointerHover,
  handlerPointerDown,
  handlerPointerUp,
  handlerHover,
  handlerLeave,
} = useButtonAction(props.handler);

const padColorStyle = computed(() => {
  switch (props.type) {
    case "function":
      return pointerHover.value
        ? pointerDown.value
          ? "#60606099"
          : "#606060ee"
        : "#606060aa";
    case "value":
      return pointerHover.value
        ? pointerDown.value
          ? "#3c3c3c99"
          : "#3c3c3cee"
        : "#3c3c3caa";
    case "primary":
      return pointerHover.value
        ? pointerDown.value
          ? "#939fa799"
          : "#939fa7ee"
        : "#939fa7aa";
  }
});

const padTextColorStyle = computed(() => {
  switch (props.type) {
    case "function":
      return "var(--color-calculator-text-display)";
    case "value":
      return "var(--color-calculator-text-display)";
    case "primary":
      return "var(--color-calculator-text-display)";
  }
});
</script>

<template>
  <div class="AppCalculatorPad">
    <button
      class="AppCalculatorPad__button"
      :class="[
        { 'AppCalculatorPad__button--down': pointerDown },
        { 'AppCalculatorPad__button--hover': !pointerDown && pointerHover },
      ]"
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

    color: v-bind(padTextColorStyle);
    background-color: v-bind(padColorStyle);

    border-radius: 0.2rem;

    transition: all 0.05s;

    &--down {
    }

    &--hover {
    }

    &__text {
      font-size: 1.05rem;
    }
  }
}
</style>
