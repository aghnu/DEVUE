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
          ? "#5f636899"
          : "#5f6368bb"
        : "#5f6368aa";
    case "value":
      return pointerHover.value
        ? pointerDown.value
          ? "#3c404399"
          : "#3c4043bb"
        : "#3c4043aa";
    case "primary":
      return pointerHover.value
        ? pointerDown.value
          ? "#9ab4f899"
          : "#9ab4f8bb"
        : "#9ab4f8aa";
  }
});

const padTextColorStyle = computed(() => {
  switch (props.type) {
    case "function":
      return "var(--color-icon-inner)";
    case "value":
      return "var(--color-icon-inner)";
    case "primary":
      return "var(--color-icon-inner-dark)";
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

    border-radius: 0.35rem;

    transition: all 0.05s;

    &--down {
    }

    &--hover {
    }

    &__text {
      font-size: 1.2rem;
    }
  }
}
</style>
