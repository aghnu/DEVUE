<script setup lang="ts">
import ResponsiveText from "../../uikit/components/ResponsiveText.vue";

const props = defineProps<{
  main: string;
}>();
</script>

<template>
  <div class="AppCalculatorDisplay">
    <div
      :class="[
        'AppCalculatorDisplay__line',
        'AppCalculatorDisplay__line--first',
      ]"
    >
      <!-- <p class="AppCalculatorDisplay__text">12 + (56 - 23)</p> -->
      <ResponsiveText :text="main" :align="'left'" />
    </div>
    <div
      :class="[
        'AppCalculatorDisplay__line',
        'AppCalculatorDisplay__line--second',
      ]"
    >
      <!-- <p class="AppCalculatorDisplay__text">= 89</p> -->
    </div>
  </div>
</template>

<style lang="scss">
.AppCalculatorDisplay {
  width: 100%;
  height: 100%;

  padding: 0.5rem 0.5rem 2rem 0.5rem;

  &__line {
    width: 100%;
    height: 50%;

    display: flex;
    flex-direction: column;
    justify-content: center;

    color: var(--color-icon-inner);
    background-color: red;

    &--first {
      font-size: 1.75rem;
    }

    &--second {
      font-size: 4rem;
    }
  }

  &__text {
    text-align: right;
    line-height: 1em;
    font-weight: 500;
  }
}
</style>
