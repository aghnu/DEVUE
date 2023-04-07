<script setup lang="ts">
import { computed, ref } from "vue";
import MovingWindow from "../../components/MovingWindow.vue";
import { MovingWindowLocalState } from "../../types/TypeWindows";
import AppCalculatorPad from "./AppCalculatorPad.vue";
import { AppCalculator } from "../AppCalculator";
import AppCalculatorDisplay from "./AppCalculatorDisplay.vue";

const props = defineProps<{
  state: MovingWindowLocalState;
}>();

const keys = computed(() =>
  (props.state.appInstance as AppCalculator).getInitKeys()
);
const textMain = computed(
  () => (props.state.appInstance as AppCalculator).textMain
);
const textSub = computed(
  () => (props.state.appInstance as AppCalculator).textSub
);
const isError = computed(
  () => (props.state.appInstance as AppCalculator).error
);
const isHold = computed(() => (props.state.appInstance as AppCalculator).hold);
</script>

<template>
  <MovingWindow :state="state">
    <div class="AppCalculator">
      <div class="AppCalculator__display">
        <AppCalculatorDisplay
          :main="textMain"
          :sub="textSub"
          :hold="isHold"
          :error="isError"
        />
      </div>
      <div class="AppCalculator__pad">
        <AppCalculatorPad
          v-for="(key, index) in keys"
          :key="index"
          :text="key.text"
          :handler="key.handler"
        />
      </div>
    </div>
  </MovingWindow>
</template>

<style lang="scss">
.AppCalculator {
  height: 100%;
  width: 100%;

  &__display {
    padding: 0.45rem 0.45rem 0 0.45rem;
    height: 32.5%;
    min-height: 5em;
  }

  &__pad {
    padding: 0 0.45rem 0.45rem 0.45rem;
    height: 67.5%;
    max-height: calc(100% - 5rem);
    width: 100%;

    background-color: rgba(100, 100, 100, 0.05);

    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    justify-items: center;
    align-items: center;

    // row-gap: 0.3rem;
    // column-gap: 0.3rem;
    row-gap: 2%;
    column-gap: 2%;
  }
}
</style>
