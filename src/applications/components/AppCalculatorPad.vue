<script setup lang="ts">
import { computed } from "vue";
import { CalculatorPadType } from "../../types/TypeCalculator";

const props = defineProps<{
  text: string;
  type: CalculatorPadType;
}>();

const padColorStyle = computed(() => {
  switch (props.type) {
    case "function":
      return "#5f6368";
    case "value":
      return "#3c4043";
    case "primary":
      return "#9ab4f8";
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
  <button class="AppCalculatorPad">
    <p class="AppCalculatorPad__text">{{ text }}</p>
  </button>
</template>

<style scoped lang="scss">
.AppCalculatorPad {
  @include mixin-center-children;
  @include mixin-clean-button-style;

  height: 100%;
  width: 100%;

  color: v-bind(padTextColorStyle);
  background-color: v-bind(padColorStyle);

  border-radius: 0.35rem;

  &__text {
    font-size: 1.1rem;
  }
}
</style>
