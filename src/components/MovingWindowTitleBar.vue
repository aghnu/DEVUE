<template>
  <div class="MovingWindowTitleBar">
    <div class="MovingWindowTitleBar__control_section">
      <MovingWindowTitleBarControlButton />
    </div>
  </div>
</template>

<style scoped lang="scss">
.MovingWindowTitleBar {
  --MovingWindowTitleBar__control_section--gap: 0.65rem;

  height: 100%;
  width: 100%;

  display: flex;
  flex-direction: row-reverse;

  &__control_section {
    height: 100%;
    width: fit-content;

    display: flex;
    flex-direction: row-reverse;
    justify-content: flex-start;
    align-items: center;
    gap: var(--MovingWindowTitleBar__control_section--gap);
    padding-left: var(--MovingWindowTitleBar__control_section--gap);
    padding-right: var(--MovingWindowTitleBar__control_section--gap);
  }
}
</style>

<script setup lang="ts">
import MovingWindowTitleBarControlButton from "./MovingWindowTitleBarControlButton.vue";
</script>
