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
    <AppButton
      name="terminal"
      type="primary"
      :size="3"
      @click="handlerClick"
    ></AppButton>
    <div class="ActionBar__dividor"></div>
    <AppButton
      name="github"
      type="secondary"
      :size="3"
      @click="handlerClick"
    ></AppButton>
    <AppButton
      name="linkedin"
      type="secondary"
      :size="3"
      @click="handlerClick"
    ></AppButton>
  </div>
</template>

<style scoped lang="scss">
.ActionBar {
  @include mixin-center-children;
  @include mixin-disable-pointer;

  display: flex;
  gap: 1.5rem;

  width: fit-content;
  height: fit-content;

  padding: 0.75rem 2rem;
  border-radius: 1rem;
  box-shadow: $shadow-block-down;

  background-color: $color-block-transparent;

  &__dividor {
    height: 1.75rem;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
    width: 0.1rem;
    border-radius: 0.1rem;
    background-color: $color-text-dark;
  }
}
</style>
