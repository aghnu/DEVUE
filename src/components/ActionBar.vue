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
      :size="2.6"
      @click="() => openApp('terminal')"
    ></AppButton>
    <div class="ActionBar__dividor"></div>
    <AppButton
      name="github"
      type="secondary"
      :size="2.6"
      @click="() => openApp('github')"
    ></AppButton>
    <AppButton
      name="linkedin"
      type="secondary"
      :size="2.6"
      @click="() => openApp('linkedin')"
    ></AppButton>
  </div>
</template>

<style scoped lang="scss">
.ActionBar {
  @include mixin-center-children;
  @include mixin-disable-pointer;

  display: flex;
  gap: 1.75rem;

  width: fit-content;
  height: fit-content;

  padding: 0.5rem 1rem;
  border-radius: 1rem;

  border: solid;
  border-width: 0.1rem;
  border-color: $color-text-dark;
  background-color: $color-block-transparent;

  box-shadow: $shadow-block-float;

  &__dividor {
    height: 1.75rem;
    // margin-left: 0.5rem;
    // margin-right: 0.5rem;
    width: 0.1rem;
    border-radius: 0.1rem;
    background-color: $color-text-dark;
  }
}
</style>
