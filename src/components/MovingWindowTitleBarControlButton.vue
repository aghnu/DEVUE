<template>
  <div
    class="MovingWindowTitleBarControlButton"
    :class="{ 'MovingWindowTitleBarControlButton--focused': props.focused }"
  ></div>
</template>

<style scoped lang="scss">
.MovingWindowTitleBarControlButton {
  --MovingWindowTitleBarControlButton--button_size: 0.8rem;

  background-color: rgb(87, 87, 87);
  height: var(--MovingWindowTitleBarControlButton--button_size);
  width: var(--MovingWindowTitleBarControlButton--button_size);

  border-radius: var(--MovingWindowTitleBarControlButton--button_size);

  &--focused {
    background-color: v-bind(styleButtonColor);
  }
}
</style>

<script setup lang="ts">
import { computed } from "@vue/reactivity";

const props = defineProps<{
  focused: boolean;
  color: "g" | "r" | "y"; // mockup, change later
}>();

const styleButtonColor = computed(() => {
  switch (props.color) {
    case "g":
      return "#00CA4E";
    case "r":
      return "#FF605C";
    case "y":
      return "#FFBD44";
  }
});
</script>
