<script setup lang="ts">
import MenuAppButton from "./MenuAppButton.vue";
import { AppTerminal } from "../applications/AppTerminal";
import { AppCalculator } from "../applications/AppCalculator";
import { AppGithub } from "../applications/AppGithub";
import { AppLinkedin } from "../applications/AppLinkedin";

const emits = defineEmits<{
  (e: "close"): void;
}>();

function handleClose() {
  emits("close");
}
</script>

<template>
  <div class="ApplicationMenu">
    <div
      :class="[
        'ApplicationMenu__container',
        'ApplicationMenu__container--primary',
      ]"
    >
      <MenuAppButton
        name="terminal"
        @click="
          () => {
            AppTerminal.build().open();
            handleClose();
          }
        "
      ></MenuAppButton>
      <MenuAppButton
        name="calculator"
        @click="
          () => {
            AppCalculator.build().open();
            handleClose();
          }
        "
      ></MenuAppButton>
    </div>
    <div
      :class="[
        'ApplicationMenu__container',
        'ApplicationMenu__container--secondary',
      ]"
    >
      <MenuAppButton
        name="github"
        @click="
          () => {
            AppGithub.build().open();
            handleClose();
          }
        "
      ></MenuAppButton>
      <MenuAppButton
        name="linkedin"
        @click="
          () => {
            AppLinkedin.build().open();
            handleClose();
          }
        "
      ></MenuAppButton>
    </div>
  </div>
</template>

<style scoped lang="scss">
.ApplicationMenu {
  width: min-content;
  height: fit-content;

  // #c5c5c5 #464646 - light mode
  // #212121 #d4d4d4 - black mode
  background-color: #c5c5c5;
  border-radius: 0.85rem;
  // padding: 0.25rem;

  display: flex;
  flex-direction: column;

  overflow: hidden;

  &__container {
    padding: 0.6rem 1.1rem;
    // border-radius: 0.5rem;
    width: 100%;
    height: fit-content;

    display: grid;
    grid-template-columns: 50% 50%;
    row-gap: 1.25rem;
    column-gap: 0.75rem;
    align-items: center;
    justify-items: center;
    justify-content: center;

    @include width-narrow() {
      grid-template-columns: 100%;
    }

    &--primary {
      background-color: rgba(150, 150, 150, 0.25);
    }

    &--secondary {
    }
  }
}
</style>
