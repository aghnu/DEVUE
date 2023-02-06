<script setup lang="ts">
import { useWindowsStatesStore } from "../stores/windowsStates";
import { storeToRefs } from "pinia";
import { computed } from "vue";

const windowsState = useWindowsStatesStore();
const { actionEvent } = storeToRefs(windowsState);

const lockInteraction = computed(() => {
  if (actionEvent.value !== null) {
    switch (actionEvent.value.type) {
      case "resize":
      case "move":
        return true;
    }
    return false;
  }
  return false;
});
</script>

<template>
  <div
    :class="[
      'MovingWindowContent',
      { 'MovingWindowContent--locked': lockInteraction },
    ]"
  >
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
.MovingWindowContent {
  height: 100%;
  width: 100%;
  &--locked {
    pointer-events: none;
  }
}
</style>
