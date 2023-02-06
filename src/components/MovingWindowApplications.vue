<script lang="ts" setup>
import AppTerminal from "../applications/components/AppTerminal.vue";
import { useWindowsStatesStore } from "../stores/windowsStates";
import { storeToRefs } from "pinia";

const windowsState = useWindowsStatesStore();
const { movingWindows, topWindow } = storeToRefs(windowsState);
</script>

<template>
  <div class="MovingWindowApplications">
    <template v-for="[id, mvState] in movingWindows" :key="id">
      <AppTerminal
        v-if="mvState.appInstance.name === 'terminal'"
        :id="id"
        :position="mvState.position"
        :size="mvState.size"
        :order="mvState.order"
        :focused="topWindow !== null && mvState.id === topWindow.id"
      />
    </template>
  </div>
</template>
