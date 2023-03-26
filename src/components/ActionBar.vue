<script setup lang="ts">
import AppButton from "./AppButton.vue";
import { ref } from "vue";
import { AppTerminal } from "../applications/AppTerminal";
import { AppGithub } from "../applications/AppGithub";
import { AppLinkedin } from "../applications/AppLinkedin";

const buttonSize = ref(2.9);
</script>

<template>
  <div class="ActionBar">
    <AppButton name="app_menu" type="action" :size="buttonSize"></AppButton>
    <div class="ActionBar__dividor"></div>
    <AppButton
      name="terminal"
      type="primary"
      :size="buttonSize"
      @click="AppTerminal.build().open()"
    ></AppButton>
    <div class="ActionBar__dividor"></div>
    <AppButton
      name="github"
      type="secondary"
      :size="buttonSize"
      @click="AppGithub.build().open()"
    ></AppButton>
    <AppButton
      name="linkedin"
      type="secondary"
      :size="buttonSize"
      @click="AppLinkedin.build().open()"
    ></AppButton>
  </div>
</template>

<style scoped lang="scss">
.ActionBar {
  @include mixin-center-children;
  @include mixin-disable-pointer;

  display: flex;
  gap: calc(v-bind(buttonSize) * 0.35rem);

  width: fit-content;
  height: fit-content;

  padding: calc(v-bind(buttonSize) * 0.15rem) calc(v-bind(buttonSize) * 0.3rem);
  border-radius: calc(v-bind(buttonSize) * 100rem);

  border: solid;
  border-width: 1px;
  border-color: $color-border-actionbar;
  background-color: $color-block-transparent-actionbar;

  box-shadow: $shadow-block-float;

  @include mixin-glassblur;

  &__dividor {
    height: calc(v-bind(buttonSize) * 0.45rem);
    // margin-left: 0.5rem;
    // margin-right: 0.5rem;
    width: 2px;
    border-radius: calc(v-bind(buttonSize) * 100rem);
    background-color: $color-icon-dividor;
  }
}
</style>
