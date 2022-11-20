<template>
  <div class="Desktop">
    <div class="Desktop__windows">
      <WindowsContainer />
    </div>
    <div class="Desktop__action_bar">
      <ActionBar />
    </div>
  </div>
</template>

<style scoped lang="scss">
.Desktop {
  height: 100%;
  width: 100%;

  &__windows {
    height: 80%;
    padding: 0.5rem;
  }

  &__action_bar {
    height: 20%;
  }
}
</style>

<script setup lang="ts">
import ActionBar from "./ActionBar.vue";
import WindowsContainer from "./WindowsContainer.vue";
import { onMounted, onUnmounted } from "vue";
import { useDesktopStatesStore } from "../stores/desktopStates";

const desktopStates = useDesktopStatesStore();

// handlers
const handlerUpdatePointerPositionMouse = (event: MouseEvent) => {
  event.preventDefault();
  desktopStates.updatePositionPointer([event.clientX, event.clientY]);
}

const handlerUpdatePointerPositionTouch = (event: TouchEvent) => {
  event.preventDefault();
  desktopStates.updatePositionPointer([event.touches[0].clientX, event.touches[0].clientY]);
}

// life cycle
onMounted(() => {
  // udpate pointer position state
  document.addEventListener('mousemove', handlerUpdatePointerPositionMouse);
  document.addEventListener('touchmove', handlerUpdatePointerPositionTouch);
});

onUnmounted(() => {
  // clean up pointer listeners
  document.removeEventListener('mousemove', handlerUpdatePointerPositionMouse);
  document.removeEventListener('touchmove', handlerUpdatePointerPositionTouch);
})

</script>
