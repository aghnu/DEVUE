<script lang="ts" setup>
import AppTerminal from "../applications/components/AppTerminal.vue";
import { useWindowsStatesStore } from "../stores/windowsStates";
import { storeToRefs } from "pinia";

const windowsState = useWindowsStatesStore();
const { movingWindows } = storeToRefs(windowsState);
</script>

<template>
  <div class="MovingWindowApplications">
    <TransitionGroup name="MovingWindowApplication__transition">
      <template v-for="[_, mvState] in movingWindows" :key="mvState.id">
        <AppTerminal
          v-if="mvState.appInstance.name === 'terminal'"
          :state="mvState"
        />
      </template>
    </TransitionGroup>
  </div>
</template>

<style scoped lang="scss">
.MovingWindowApplication__transition {
  &-enter-active,
  &-leave-active {
    transition: all 0.3s;
  }

  &-enter-from,
  &-leave-to {
    transform: scale(0.85);
    opacity: 0;
  }
}
</style>
