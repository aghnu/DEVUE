<script lang="ts" setup>
import { useWindowsStatesStore } from "../stores/windowsStates";
import { storeToRefs } from "pinia";
import {
  AppNameInternal,
  ApplicationMetaInternal,
} from "../types/TypeApplication";

import APPLICATION_INDEX from "../applications";

const windowsState = useWindowsStatesStore();
const { movingWindows } = storeToRefs(windowsState);

function getComponent(name: AppNameInternal) {
  return (APPLICATION_INDEX[name] as ApplicationMetaInternal).vueComponent;
}
</script>

<template>
  <div class="MovingWindowApplications">
    <TransitionGroup name="MovingWindowApplication__transition">
      <template v-for="[mid, mvState] in movingWindows" :key="mid">
        <component
          :is="getComponent(mvState.appInstance.name as AppNameInternal)"
          :state="mvState"
        ></component>
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
