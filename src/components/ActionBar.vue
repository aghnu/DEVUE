<script setup lang="ts">
import AppButton from "./AppButton.vue";
import { openApp } from "../applications/openApplication";
import { onMounted } from "vue";

onMounted(() => {
  // TODO: animation + store control action buttons with there own state that can be used for trigger animation
  openApp("terminal");
});
</script>

<template>
  <div class="ActionBar">
    <AppButton
      name="terminal"
      type="primary"
      :size="3.2"
      @click="() => openApp('terminal')"
    ></AppButton>
    <div class="ActionBar__dividor"></div>
    <AppButton
      name="github"
      type="secondary"
      :size="3.2"
      @click="() => openApp('github')"
    ></AppButton>
    <AppButton
      name="linkedin"
      type="secondary"
      :size="3.2"
      @click="() => openApp('linkedin')"
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

  padding: 0.45rem 0.9rem;
  border-radius: 2rem;

  // border: solid;
  // border-width: 0.1rem;
  // border-color: $color-text-dark;
  background-color: $color-block-transparent;

  box-shadow: $shadow-block-float;

  @include mixin-glassblur;

  &__dividor {
    height: 1.5rem;
    // margin-left: 0.5rem;
    // margin-right: 0.5rem;
    width: 0.1rem;
    opacity: 0.75;
    border-radius: 0.1rem;
    background-color: $color-icon-dividor;
  }
}
</style>
