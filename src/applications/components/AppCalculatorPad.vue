<script setup lang="ts">
import { computed, ref } from "vue";
import { useButtonAction } from "../../composables/useButtonAction";
import { useTrackComputedStyle } from "../../composables/useTrackComputedStyle";
import { CalculatorPadType } from "../../types/TypeCalculator";
import { convertStyleUnitPxToNumber } from "../../utilities/helpers";

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
  const alpha = pointerDown.value ? "88" : pointerHover.value ? "ee" : "aa";

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
const appCalculatorPadElement = ref<HTMLDivElement>();

const widthStyleComputed = useTrackComputedStyle(
  appCalculatorPadElement,
  "width"
).propertyRef;
const heightStyleComputed = useTrackComputedStyle(
  appCalculatorPadElement,
  "height"
).propertyRef;
const widthStyle = computed(() =>
  widthStyleComputed.value
    ? convertStyleUnitPxToNumber(widthStyleComputed.value as string) ?? 0
    : 0
);
const heightStyle = computed(() =>
  heightStyleComputed.value
    ? convertStyleUnitPxToNumber(heightStyleComputed.value as string) ?? 0
    : 0
);
const fontSizeStyle = computed(
  () => Math.min(widthStyle.value, heightStyle.value) * 0.02
);
</script>

<template>
  <div class="AppCalculatorPad" ref="appCalculatorPadElement">
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

    font-size: calc(v-bind(fontSizeStyle) * 1rem);
    border-radius: 1.75rem;

    transition: background-color 0.15s;

    &--down {
    }

    &--hover {
    }

    &__text {
      font-size: 1.2em;
    }
  }
}
</style>
