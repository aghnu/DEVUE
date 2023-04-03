<script setup lang="ts">
import AppButton from "./AppButton.vue";
import { ref } from "vue";
import { AppTerminal } from "../applications/AppTerminal";
import { AppGithub } from "../applications/AppGithub";
import { AppLinkedin } from "../applications/AppLinkedin";
import { AppCalculator } from "../applications/AppCalculator";
import { useWindowsStatesStore } from "../stores/windowsStates";
import ApplicationMenu from "./ApplicationMenu.vue";
import ScreenBlocker from "./ScreenBlocker.vue";

const buttonSize = ref(2.9);
const windowsState = useWindowsStatesStore();
const menuOpen = ref(false);

function handleMenuToggle() {
  menuOpen.value = !menuOpen.value;
}

function handleMenuClose() {
  menuOpen.value = false;
}
</script>

<template>
  <div class="ActionBar">
    <transition name="ActionBarTransition__menu">
      <ApplicationMenu
        v-if="menuOpen"
        @close="handleMenuClose()"
        class="ActionBar__menu"
      ></ApplicationMenu>
    </transition>
    <div class="ActionBar__inner">
      <Teleport v-if="menuOpen" to="#teleport-actionbar-menu">
        <ScreenBlocker @click="handleMenuClose"></ScreenBlocker
      ></Teleport>

      <AppButton
        name="app_menu"
        type="action"
        :size="buttonSize"
        @click="handleMenuToggle"
      ></AppButton>
      <div class="ActionBar__dividor"></div>
      <AppButton
        name="terminal"
        type="primary"
        :size="buttonSize"
        @click="
          AppTerminal.build().open();
          handleMenuClose();
        "
      ></AppButton>
      <AppButton
        name="calculator"
        type="primary"
        :size="buttonSize"
        @click="
          AppCalculator.build().open();
          handleMenuClose();
        "
      ></AppButton>
      <div class="ActionBar__dividor"></div>
      <AppButton
        name="reset"
        type="warn"
        :size="buttonSize"
        @click="
          windowsState.resetMovingWindow();
          handleMenuClose();
        "
      ></AppButton>
    </div>
  </div>
</template>

<style scoped lang="scss">
.ActionBarTransition {
  &__menu {
    &-enter-active,
    &-leave-active {
      transition: all 0.3s, opacity 0.2s;
    }

    &-enter-from,
    &-leave-to {
      transform: scale(0.5) translate(0, 100%);
      opacity: 0;
    }
  }
}

.ActionBar {
  @include mixin-center-children;

  position: relative;
  width: 0%;
  height: 100%;

  &__inner {
    @include mixin-center-children;
    @include mixin-disable-pointer;
    @include mixin-glassblur;

    display: flex;
    gap: calc(v-bind(buttonSize) * 0.35rem);

    width: fit-content;
    height: fit-content;

    padding: calc(v-bind(buttonSize) * 0.15rem)
      calc(v-bind(buttonSize) * 0.3rem);
    border-radius: calc(v-bind(buttonSize) * 0.5rem);

    border: solid;
    border-width: 1px;
    border-color: var(--color-border-actionbar);
    background-color: var(--color-block-transparent-actionbar);

    box-shadow: var(--shadow-block-float);
  }

  &__menu {
    position: absolute;
    bottom: 200%;
  }

  &__dividor {
    height: calc(v-bind(buttonSize) * 0.45rem);
    // margin-left: 0.5rem;
    // margin-right: 0.5rem;
    width: 2px;
    border-radius: calc(v-bind(buttonSize) * 100rem);
    background-color: var(--color-icon-dividor);
  }
}
</style>
