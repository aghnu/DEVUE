<script setup lang="ts">
import { computed, ref } from "vue";
import { useButtonAction } from "../../composables/useButtonAction";
import { CalculatorPadType } from "../../types/TypeCalculator";
import { useDynamicColor } from "../../composables/useDynamicColor";

const props = defineProps<{
  text: string;
  type: CalculatorPadType;
  handler: (text: string) => void;
  sizeUnit: number;
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

const { elementColorIntensity } = useDynamicColor(calculatorPadButtonElement);

const padColorStyle = computed(() => {
  const alpha = pointerDown.value ? "66" : pointerHover.value ? "cc" : "88";

  switch (props.type) {
    case "function":
      return "#939fa7" + alpha;
    case "value":
      return "#ffffff" + alpha;
    case "primary":
      return "#ff5c5c" + alpha;
  }
});

const padTextColorStyle = computed(() => {
  switch (props.type) {
    case "function":
      return "var(--color-calculator-text-light)";
    case "value":
      return "var(--color-calculator-text-display)";
    case "primary":
      return "var(--color-calculator-text-light)";
  }
});

const boxShadowStyle = computed(() => {
  const alpha = (1 - elementColorIntensity.value) * 0.05 + 0.025;
  return `0 5px 5px rgba(20, 20, 20, ${alpha})`;
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

    color: v-bind(padTextColorStyle);
    background-color: v-bind(padColorStyle);

    font-size: calc(v-bind(sizeUnit) * 1px * 5);
    border-radius: min(1em, 1.15rem);

    transition: background-color 0.15s, transform 0.15s, box-shadow 0.15s;

    box-shadow: v-bind(boxShadowStyle);

    &--down {
      box-shadow: none;
      transform: scale(0.95);
    }

    &--hover {
    }

    &__text {
      font-size: 1.2em;
    }
  }
}
</style>
