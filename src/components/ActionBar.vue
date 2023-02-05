<script setup lang="ts">
import AppButton from "./AppButton.vue";
import { createMovingWindowMockup } from "../logics/doWindowCreation";
import { useWindowsStatesStore } from "../stores/windowsStates";

const windowsState = useWindowsStatesStore();

function handlerClick() {
  windowsState.addMovingWindow(createMovingWindowMockup());
}
</script>

<template>
  <div class="ActionBar">
    <AppButton name="terminal" :size="2.5" @click="handlerClick"></AppButton>
  </div>
</template>

<style scoped lang="scss">
.ActionBar {
  @include mixin-center-children;
  @include mixin-disable-pointer;

  width: 100%;
  height: 100%;

  background-color: red;
}
</style>
