<script setup lang="ts">
import MovingWindow from "../../components/MovingWindow.vue";
import { MovingWindowLocalState } from "../../types/TypeWindows";

defineProps<{
  state: MovingWindowLocalState;
}>();
</script>

<template>
  <MovingWindow :state="state">
    <div class="AppPixel"></div>
  </MovingWindow>
</template>

<style lang="scss">
.AppPixel {
  height: 100%;
  width: 100%;
}
</style>
