<script setup lang="ts">
import { getIconClose } from "../utilities/factorySVG";
const props = defineProps<{
  focused: boolean;
}>();

const emits = defineEmits<{
  (e: "action:close"): void;
}>();

const iconClose = getIconClose({
  color: "var(--color-text-dark)",
  size: "100%",
});
</script>

<template>
  <div class="MovingWindowTitleBar">
    <div class="MovingWindowTitleBar__control_section">
      <button
        :class="[
          'MovingWindowTitleBar__button',
          { 'MovingWindowTitleBar__button--focused': props.focused },
        ]"
        @click="() => emits('action:close')"
        v-html="iconClose"
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
  justify-content: flex-end;

  &__button {
    @include mixin-clean-button-style;

    height: 0.85rem;
    width: 0.85rem;
  }

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
