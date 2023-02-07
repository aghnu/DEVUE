<script setup lang="ts">
import { getAppIcon } from "../utilities/factorySVG";
import { AppName } from "../types/TypeApp";
import { ref, computed, onMounted, onUnmounted } from "vue";

const props = defineProps<{
  name: AppName;
  type: "primary" | "secondary";
  size: number;
}>();

const emits = defineEmits<{
  (e: "click"): void;
}>();

const iconHTML = getAppIcon(props.name, {
  size: "100%",
  color: "var(--color-text-dark)",
});
const pointerDown = ref(false);
const pointerHover = ref(false);

const containerSize = computed(() => `${props.size}rem`);
const buttonSize = computed(() =>
  pointerDown.value
    ? `${props.size * 0.6}rem`
    : pointerHover.value
    ? `${props.size}rem`
    : `${props.size * 0.8}rem`
);

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
      ]"
      @mousedown="handlerPointerDown"
      @touchstart="handlerPointerDown"
      @mouseup="handlerPointerUp"
      @touchend="handlerPointerUp"
      @mouseover="handlerHover"
      @mouseleave="handlerLeave"
    >
      <div class="AppButton__inner__icon" v-html="iconHTML"></div>
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

    height: v-bind(buttonSize);
    width: v-bind(buttonSize);
    box-shadow: $shadow-block-down;

    transition: height 0.3s, width 0.3s, box-shadow 0.3s;

    &--down {
      box-shadow: $shadow-block-down;
    }

    &--secondary {
      background-color: $color-icon-secondary;
    }

    &__icon {
      @include mixin-center-children;
      height: 57%;
      widows: 57%;
    }
  }
}
</style>
