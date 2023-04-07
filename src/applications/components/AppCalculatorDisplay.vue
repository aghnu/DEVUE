<script setup lang="ts">
import ResponsiveText from "../../uikit/components/ResponsiveText.vue";
import { ref } from "vue";
import { useWindowSizeUnit } from "../../composables/useWindowSizeUnit";

const props = defineProps<{
  main: string;
  sub: string;
  error: boolean;
  hold: boolean;
}>();

const appCalculatorDisplayElement = ref<HTMLDivElement>();
const { eleheight } = useWindowSizeUnit(appCalculatorDisplayElement);
</script>

<template>
  <div class="AppCalculatorDisplay" ref="appCalculatorDisplayElement">
    <div class="AppCalculatorDisplay__inner">
      <div
        :class="[
          'AppCalculatorDisplay__line',
          'AppCalculatorDisplay__line--first',
        ]"
      >
        <ResponsiveText :text="sub" :align="'right'" />
      </div>
      <div
        :class="[
          'AppCalculatorDisplay__line',
          'AppCalculatorDisplay__line--second',
          { 'AppCalculatorDisplay__line--hold': props.hold },
          { 'AppCalculatorDisplay__line--error': props.error },
        ]"
      >
        <ResponsiveText :text="main" :align="'right'" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.AppCalculatorDisplay {
  position: relative;
  width: 100%;
  height: 100%;

  &__inner {
    display: flex;
    flex-direction: column;
    justify-content: center;

    width: 100%;
    height: 100%;
  }

  &__line {
    width: 100%;

    color: var(--color-calculator-text-display);

    transition: color 0.3s;
    padding-left: 0.8rem;
    padding-right: 0.8rem;

    &--hold {
      opacity: 0.25;
    }

    &--first {
      // 1.5
      height: 1.5em;
      font-size: calc(v-bind(eleheight) * 15px);
      font-weight: 300;
    }

    &--second {
      // 4.74
      height: 1.5em;
      font-size: calc(v-bind(eleheight) * 30px);
      font-weight: 300;
    }
  }
}
</style>
