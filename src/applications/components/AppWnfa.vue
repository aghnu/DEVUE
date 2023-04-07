<script setup lang="ts">
import MovingWindow from "../../components/MovingWindow.vue";
import { MovingWindowLocalState } from "../../types/TypeWindows";

defineProps<{
  state: MovingWindowLocalState;
}>();
</script>

<template>
  <MovingWindow :state="state">
    <div class="AppWnfa">
      <iframe
        class="AppWnfa__internal"
        src="https://www.aghnu.me/WNFA/"
        frameborder="0"
      />
    </div>
  </MovingWindow>
</template>

<style lang="scss">
.AppWnfa {
  height: 100%;
  width: 100%;
  &__internal {
    display: block;
    height: 100%;
    width: 100%;
    border: none;
  }
}
</style>
