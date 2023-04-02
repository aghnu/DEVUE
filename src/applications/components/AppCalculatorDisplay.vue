<script setup lang="ts">
import { useTrackComputedStyle } from "../../composables/useTrackComputedStyle";
import ResponsiveText from "../../uikit/components/ResponsiveText.vue";
import { ref, computed } from "vue";
import { convertStyleUnitPxToNumber } from "../../utilities/helpers";

const props = defineProps<{
  main: string;
  sub: string;
}>();

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
    position: absolute;
    top: 20%;
    width: 100%;

    padding-left: 0.8rem;
    padding-right: 0.8rem;
  }

  &__line {
    width: 100%;

    display: flex;
    flex-direction: column;
    justify-content: center;

    color: var(--color-icon-inner);

    &--first {
      font-size: calc(v-bind(displayElementHeight) * 1.5rem);
    }

    &--second {
      font-size: calc(v-bind(displayElementHeight) * 4rem);
    }
  }

  &__text {
    text-align: right;
    line-height: 1em;
    font-weight: 500;
  }
}
</style>
