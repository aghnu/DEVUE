<script setup lang="ts">
import { computed, ref } from "vue";
import MovingWindow from "../../components/MovingWindow.vue";
import { MovingWindowLocalState } from "../../types/TypeWindows";
import AppCalculatorPad from "./AppCalculatorPad.vue";
import { AppCalculator } from "../AppCalculator";
import AppCalculatorDisplay from "./AppCalculatorDisplay.vue";
import { useWindowSizeUnit } from "../../composables/useWindowSizeUnit";

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

const movingWindowElement = ref<HTMLDivElement>();
const { elemin, eleheight, elewidth } = useWindowSizeUnit(movingWindowElement);
</script>

<template>
  <MovingWindow :state="state">
    <div class="AppCalculator" ref="movingWindowElement">
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
          :size-unit="elemin"
        />
      </div>
    </div>
  </MovingWindow>
</template>

<style lang="scss">
.AppCalculator {
  height: 100%;
  width: 100%;

  padding: max(
      calc(v-bind(eleheight) * 1px * 0.75),
      min(0.75rem, calc(v-bind(eleheight) * 1px * 2.5))
    )
    max(
      calc(v-bind(eleheight) * 1px * 0.75),
      min(0.75rem, calc(v-bind(elewidth) * 1px * 4))
    );

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

    row-gap: max(
      calc(v-bind(eleheight) * 1px * 0.75),
      min(0.75rem, calc(v-bind(eleheight) * 1px * 2.5))
    );
    column-gap: max(
      calc(v-bind(eleheight) * 1px * 0.75),
      min(0.75rem, calc(v-bind(elewidth) * 1px * 4))
    );
  }
}
</style>
