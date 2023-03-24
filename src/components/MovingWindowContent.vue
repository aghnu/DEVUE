<script setup lang="ts">
import { useWindowsStatesStore } from "../stores/windowsStates";
import { useMovingWindowStyleGlobalCursor } from "../composables/useMovingWindowConfig";
import { storeToRefs } from "pinia";
import { computed } from "vue";

const props = defineProps<{
  focused: boolean;
}>();

const windowsState = useWindowsStatesStore();
const { actionEvent } = storeToRefs(windowsState);
const { styleWindowCursor } = useMovingWindowStyleGlobalCursor("auto");

const lockInteraction = computed(() => {
  if (props.focused === false) {
    return true;
  }

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
  <div class="MovingWindowContent">
    <div
      :class="[
        'MovingWindowContent__container',
        { 'MovingWindowContent__container--locked': lockInteraction },
      ]"
    >
      <slot></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
.MovingWindowContent {
  height: 100%;
  width: 100%;

  cursor: v-bind(styleWindowCursor);

  &__container {
    height: 100%;
    width: 100%;
    &--locked {
      pointer-events: none;
    }
  }
}
</style>
