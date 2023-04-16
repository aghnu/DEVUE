<script setup lang="ts"></script>

<template>
  <div class="WidgetsManager"></div>
</template>

<style lang="scss">
.WidgetsManager {
  @include mixin-center-children;

  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  pointer-events: none;
}
</style>
