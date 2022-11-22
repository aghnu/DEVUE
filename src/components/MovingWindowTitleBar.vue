<template>
  <div class="MovingWindowTitleBar">
    <div class="MovingWindowTitleBar__control_section">
      <MovingWindowTitleBarControlButton
        :focused="props.focused"
        :color="'r'"
      />
      <MovingWindowTitleBarControlButton
        :focused="props.focused"
        :color="'y'"
      />
      <MovingWindowTitleBarControlButton
        :focused="props.focused"
        :color="'g'"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.MovingWindowTitleBar {
  --MovingWindowTitleBar__control_section--gap: 0.45rem;

  height: 100%;
  width: 100%;

  display: flex;
  flex-direction: row;

  &__control_section {
    height: 100%;
    width: fit-content;

    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--MovingWindowTitleBar__control_section--gap);
    padding-left: calc(
      1.75 * var(--MovingWindowTitleBar__control_section--gap)
    );
    padding-right: calc(
      1.75 * var(--MovingWindowTitleBar__control_section--gap)
    );
  }
}
</style>

<script setup lang="ts">
import MovingWindowTitleBarControlButton from "./MovingWindowTitleBarControlButton.vue";

const props = defineProps<{
  focused: boolean;
}>();
</script>
