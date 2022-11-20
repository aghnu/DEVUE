<template>
  <div class="Desktop">
    <div class="Desktop__windows">
      <WindowsContainer />
    </div>
    <div class="Desktop__action-bar">
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
  }

  &__action-bar {
    height: 20%;
  }
}
</style>

<script setup lang="ts">
import ActionBar from "./ActionBar.vue";
import WindowsContainer from "./WindowsContainer.vue";
</script>
