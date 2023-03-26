<script setup lang="ts">
import { getAppIcon } from "../utilities/factorySVG";
import { AppName } from "../types/TypeApp";
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useWindowsStatesStore } from "../stores/windowsStates";
import { storeToRefs } from "pinia";

const props = defineProps<{
  name: AppName;
  type: "primary" | "secondary" | "action";
  size: number;
}>();

const emits = defineEmits<{
  (e: "click"): void;
}>();

const windowsState = useWindowsStatesStore();
const { getApplicationsInstanceCount } = storeToRefs(windowsState);

const pointerDown = ref(false);
const pointerHover = ref(false);

const containerSize = computed(() => `${props.size}rem`);
const buttonSizeFactor = computed(() =>
  pointerDown.value ? 0.6 : pointerHover.value ? 1 : 0.8
);
const buttonSize = computed(() => `${props.size * buttonSizeFactor.value}rem`);
const iconHTML = computed(() => {
  switch (props.type) {
    case "primary":
      return getAppIcon(props.name, {
        size: "100%",
        color: "var(--color-icon-inner-dark)",
      });
    case "secondary":
    case "action":
      return getAppIcon(props.name, {
        size: "100%",
        color: "var(--color-icon-inner)",
      });
  }
});

const appInstancesCount = computed(() => {
  return getApplicationsInstanceCount.value(props.name);
});

function handlerPointerDown() {
  pointerDown.value = true;
}

function handlerPointerUp() {
  if (pointerDown.value) {
    pointerDown.value = false;
    emits("click");
  }
}

function handlerHover() {
  pointerHover.value = true;
}

function handlerLeave() {
  pointerHover.value = false;
}

onMounted(() => {
  document.addEventListener("mouseup", handlerPointerUp);
  document.addEventListener("touchend", handlerPointerUp);
});

onUnmounted(() => {
  document.removeEventListener("mouseup", handlerPointerUp);
  document.removeEventListener("touchend", handlerPointerUp);
});
</script>

<template>
  <div class="AppButton">
    <button
      class="AppButton__inner"
      :class="[
        { 'AppButton__inner--down': pointerDown },
        { 'AppButton__inner--secondary': type === 'secondary' },
        { 'AppButton__inner--action': type === 'action' },
      ]"
      @mousedown="handlerPointerDown"
      @touchstart="handlerPointerDown"
      @mouseup="handlerPointerUp"
      @touchend="handlerPointerUp"
      @mouseover="handlerHover"
      @mouseleave="handlerLeave"
    >
      <div class="AppButton__inner__icon" v-html="iconHTML"></div>
      <div
        v-if="appInstancesCount"
        :class="['AppButton__counter']"
        role="presentation"
      >
        {{ appInstancesCount }}
      </div>
    </button>
  </div>
</template>

<style scoped lang="scss">
.AppButton {
  @include mixin-center-children;

  overflow: visible;
  position: relative;

  height: v-bind(containerSize);
  width: fit-content;

  &__inner {
    @include mixin-clean-button-style;
    @include mixin-center-children;

    position: relative;

    background-color: $color-icon-primary;
    border-radius: 50%;

    // border: solid;
    // border-width: 0.1rem;
    // border-color: $color-text-dark;

    height: v-bind(buttonSize);
    width: v-bind(buttonSize);
    // box-shadow: $shadow-block-down;

    transition: height 0.3s, width 0.3s, box-shadow 0.3s;

    // &--down {
    //   box-shadow: $shadow-block-down;
    // }

    &--secondary,
    &--action {
      background-color: $color-icon-secondary;
    }

    &__icon {
      @include mixin-center-children;
      height: 35%;
      widows: 35%;
    }
  }

  &__counter {
    @include mixin-center-children;
    @include mixin-glassblur(0.1rem);

    position: absolute;
    bottom: 0;
    right: 0;

    height: 35%;
    width: fit-content;
    min-width: 35%;

    border-radius: 10rem;

    transition: all 0.3s;
    background-color: rgba(255, 255, 255, 0.75);

    color: rgba(34, 34, 34, 0.5);
    font-size: calc(v-bind(buttonSize) * 0.2);
    padding: 0.25em 0.5em;

    font-weight: 500;
  }
}
</style>
