<script setup lang="ts">
import { useTrackComputedStyle } from "../../composables/useTrackComputedStyle";
import ResponsiveText from "../../uikit/components/ResponsiveText.vue";
import { ref, computed, onMounted, watch } from "vue";
import {
  convertStyleUnitPxToNumber,
  repeatActionForSetFrames,
} from "../../utilities/helpers";
import { useWindowsStatesStore } from "../../stores/windowsStates";
import { storeToRefs } from "pinia";
import { Trigger } from "../../utilities/trigger";

const props = defineProps<{
  main: string;
  sub: string;
}>();

const windowsState = useWindowsStatesStore();
const { topWindow } = storeToRefs(windowsState);
const displayRefreshTrigger = new Trigger();
const topWindowSnap = computed(() => topWindow.value?.snapped);

const appCalculatorDisplayElement = ref<HTMLDivElement>();
const displayElementHeightStyle = useTrackComputedStyle(
  appCalculatorDisplayElement,
  "height"
).propertyRef;
const displayElementHeight = computed(() => {
  if (!displayElementHeightStyle.value) return 0;
  const height = convertStyleUnitPxToNumber(
    displayElementHeightStyle.value as string
  );
  return height ? height / 200 : 0;
});

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
        ]"
      >
        <ResponsiveText
          :text="main"
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
    position: absolute;
    top: 20%;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    padding-left: 0.8rem;
    padding-right: 0.8rem;
  }

  &__line {
    width: 100%;

    display: flex;
    flex-direction: column;
    justify-content: center;
    color: var(--color-calculator-text-display);

    &--first {
      font-size: calc(v-bind(displayElementHeight) * 1.25rem);
    }

    &--second {
      font-size: calc(v-bind(displayElementHeight) * 3.65rem);
    }
  }

  &__text {
    text-align: right;
    line-height: 1em;
    font-weight: 500;
  }
}
</style>
