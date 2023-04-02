<script setup lang="ts">
import { computed } from "vue";
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
</script>

<template>
  <MovingWindow :state="state">
    <div class="AppCalculator">
      <div class="AppCalculator__display">
        <AppCalculatorDisplay :main="textMain" :sub="textSub" />
      </div>
      <div class="AppCalculator__pad">
        <AppCalculatorPad
          v-for="(key, index) in keys"
          :key="index"
          :text="key.text"
          :type="key.type"
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

  padding: 0.25rem;

  &__display {
    height: 35%;
    min-height: 7rem;
  }

  &__pad {
    height: 65%;
    max-height: calc(100% - 7rem);
    width: 100%;

    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    justify-items: center;
    align-items: center;

    gap: 0.25rem;
  }
}
</style>
