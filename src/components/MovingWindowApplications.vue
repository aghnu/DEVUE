<script lang="ts" setup>
import { useWindowsStatesStore } from "../stores/windowsStates";
import { storeToRefs } from "pinia";

const windowsState = useWindowsStatesStore();
const { movingWindows } = storeToRefs(windowsState);
</script>

<template>
  <div class="MovingWindowApplications">
    <TransitionGroup name="MovingWindowApplication__transition">
      <template v-for="[mid, mvState] in movingWindows" :key="mid">
        <component :is="mvState.vueComponent" :state="mvState"></component>
        <!-- <AppTerminal
          v-if="mvState.appInstance.name === 'terminal'"
          :state="mvState"
        />
        <AppCalculator
          v-else-if="mvState.appInstance.name === 'calculator'"
          :state="mvState"
        />
        <AppWnfa
          v-else-if="mvState.appInstance.name === 'wnfa'"
          :state="mvState"
        /> -->
      </template>
    </TransitionGroup>
  </div>
</template>

<style scoped lang="scss">
.MovingWindowApplication__transition {
  &-enter-active,
  &-leave-active {
    transition: all 0.3s, opacity 0.2s;
  }

  &-enter-from,
  &-leave-to {
    transform: scale(0.9);
    opacity: 0;
  }
}
</style>
