<script setup lang="ts">
import ResponsiveText from "../../uikit/components/ResponsiveText.vue";
import { ref, computed, onMounted, watch, onUnmounted } from "vue";
import { repeatActionForSetFrames } from "../../utilities/helpers";
import { useWindowsStatesStore } from "../../stores/windowsStates";
import { storeToRefs } from "pinia";
import { Trigger } from "../../utilities/trigger";
import { useWindowSizeUnit } from "../../composables/useWindowSizeUnit";

const props = defineProps<{
  main: string;
  sub: string;
  prompt: string;
  hold: boolean;
}>();

const windowsState = useWindowsStatesStore();
const { topWindow } = storeToRefs(windowsState);
const displayRefreshTrigger = new Trigger();
const topWindowSnap = computed(() => topWindow.value?.snapped);

const appCalculatorDisplayElement = ref<HTMLDivElement>();
const { eleheight } = useWindowSizeUnit(appCalculatorDisplayElement);

onMounted(() => {
  watch(topWindowSnap, () => {
    repeatActionForSetFrames(() => displayRefreshTrigger.notify(), 5);
  });
});
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
        <ResponsiveText
          :text="sub"
          :align="'right'"
          :refresh-trigger="displayRefreshTrigger"
        />
      </div>
      <div
        :class="[
          'AppCalculatorDisplay__line',
          'AppCalculatorDisplay__line--second',
          { 'AppCalculatorDisplay__line--hold': props.hold },
        ]"
      >
        <ResponsiveText
          :text="main"
          :align="'right'"
          :refresh-trigger="displayRefreshTrigger"
        />
      </div>
      <div
        :class="[
          'AppCalculatorDisplay__line',
          'AppCalculatorDisplay__line--prompt',
        ]"
      >
        <ResponsiveText
          :text="prompt"
          :align="'right'"
          :refresh-trigger="displayRefreshTrigger"
        />
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

    gap: 0.25rem;
  }

  &__line {
    width: 100%;
    height: 1em;

    display: flex;
    flex-direction: column;
    justify-content: center;
    color: var(--color-calculator-text-display);
    line-height: 1em;

    transition: color 0.3s;
    padding-left: 0.8rem;
    padding-right: 0.8rem;

    &--hold {
      opacity: 0.25;
    }

    &--first {
      // 1.5
      font-size: calc(v-bind(eleheight) * 15px);
      font-weight: 300;
    }

    &--second {
      // 4,74
      font-size: calc(v-bind(eleheight) * 35px);
      font-weight: 300;
    }

    &--prompt {
      opacity: 0.25;
      // position: absolute;
      // bottom: 10%;
      // right: 0;
      font-size: calc(v-bind(eleheight) * 10px);
      font-weight: 400;
    }
  }
}
</style>
