<script setup lang="ts">
import Desktop from "./components/AppDesktop.vue";
</script>

<template>
  <Desktop />
</template>

<style lang="scss">
:root {
  @include colors;
  font-size: 15px;
  font-family: $font-family-main;
  background-color: var(--color-background);

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;
}

#app {
  position: fixed;
  left: 0;
  top: 0;

  width: 100%;
  height: 100%;
}

* {
  box-sizing: border-box;
}

p {
  padding: 0;
  margin: 0;
}
</style>
