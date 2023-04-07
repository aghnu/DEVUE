<script setup lang="ts">
import MenuAppButton from "./MenuAppButton.vue";
import { AppTerminal } from "../applications/AppTerminal";
import { AppCalculator } from "../applications/AppCalculator";
import { AppGithub } from "../applications/AppGithub";
import { AppLinkedin } from "../applications/AppLinkedin";
import { useDynamicColor } from "../composables/useDynamicColor";
import { ref } from "vue";
import { AppWnfa } from "../applications/AppWnfa";

const emits = defineEmits<{
  (e: "close"): void;
}>();

const applicationMenuElement = ref<HTMLDivElement>();
const { elementDropShadowStyle, elementBorderColorStyle } = useDynamicColor(
  applicationMenuElement
);

function handleClose() {
  emits("close");
}
</script>

<template>
  <div class="ApplicationMenu" ref="applicationMenuElement">
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
      <MenuAppButton
        name="wnfa"
        @click="
          () => {
            AppWnfa.build().open();
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
  @include mixin-glassblur();

  width: min-content;
  height: fit-content;

  // #c5c5c5 #464646 - light mode
  // #212121 #d4d4d4 - black mode
  background-color: var(--color-block-transparent-menu);
  border-radius: 0.85rem;
  // padding: 0.25rem;

  box-shadow: v-bind(elementDropShadowStyle);
  border: solid;
  border-width: 2px;
  border-color: v-bind(elementBorderColorStyle);

  display: flex;
  flex-direction: column;

  overflow: hidden;

  &__container {
    padding: 0.75rem 0.9rem;
    // border-radius: 0.5rem;
    width: 100%;
    height: fit-content;

    display: grid;
    grid-template-columns: 50% 50%;
    row-gap: 0.85rem;
    column-gap: 0.25rem;
    align-items: center;
    justify-items: center;
    justify-content: center;

    @include width-narrow() {
      grid-template-columns: 100%;
    }

    &--primary {
      background-color: rgba(150, 150, 150, 0.1);
    }

    &--secondary {
    }
  }
}
</style>
