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
const textPrompt = computed(
  () => (props.state.appInstance as AppCalculator).textPrompt
);
const isHold = computed(() => (props.state.appInstance as AppCalculator).hold);

const backgroundColor = computed(
  () => props.state.appInstance.applicationStyle.colorBackground
);
</script>

<template>
  <MovingWindow :state="state">
    <div class="AppCalculator">
      <div class="AppCalculator__display">
        <AppCalculatorDisplay
          :main="textMain"
          :sub="textSub"
          :prompt="textPrompt"
          :hold="isHold"
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
    height: 30%;
    min-height: 6rem;
  }

  &__pad {
    padding: 0 0.45rem 0.45rem 0.45rem;
    height: 70%;
    max-height: calc(100% - 6rem);
    width: 100%;

    background-color: rgba(100, 100, 100, 0.05);

    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    justify-items: center;
    align-items: center;

    row-gap: 0.3rem;
    column-gap: 0.3rem;
  }
}
</style>
