<script setup lang="ts"></script>

<template>
  <div class="AppTerminal">
    <iframe
      class="AppTerminal__external"
      src="https://www.aghnu.me"
      frameborder="0"
    >
    </iframe>
  </div>
</template>

<style scoped lang="scss">
.AppTerminal {
  width: 100%;
  height: 100%;

  &__external {
    display: block;
    border: none;
  }
}
</style>
