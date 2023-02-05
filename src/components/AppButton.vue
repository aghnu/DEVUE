<script setup lang="ts">
import { getAppIcon } from "../utilities/factorySVG";
import { AppName } from "../types/TypeApp";
import { ref, computed, onMounted, onUnmounted } from "vue";
import { emit } from "process";

const props = defineProps<{
  name: AppName;
  size: number;
}>();

const emits = defineEmits<{
  (e: "click"): void;
}>();

const iconHTML = getAppIcon(props.name, { size: "100%", color: "white" });
const pointerDown = ref(false);
const pointerHover = ref(false);

const buttonSize = computed(() =>
  pointerDown.value
    ? `${props.size * 0.8}rem`
    : pointerHover.value
    ? `${props.size * 1.1}rem`
    : `${props.size}rem`
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
  <button
    class="AppButton"
    :class="[{ 'AppButton--down': pointerDown }]"
    @mousedown="handlerPointerDown"
    @touchstart="handlerPointerDown"
    @mouseup="handlerPointerUp"
    @touchend="handlerPointerUp"
    @mouseover="handlerHover"
    @mouseleave="handlerLeave"
  >
    <div class="AppButton__icon" v-html="iconHTML"></div>
  </button>
</template>

<style scoped lang="scss">
.AppButton {
  @include mixin-clean-button-style;
  @include mixin-center-children;

  background-color: black;
  border-radius: 50%;

  height: v-bind(buttonSize);
  width: v-bind(buttonSize);
  box-shadow: 0rem 0rem 0.75rem rgba(0, 0, 0, 0.75);

  transition: height 0.3s, width 0.3s, box-shadow 0.3s;

  &--down {
    box-shadow: 0rem 0rem 0.75rem rgba(0, 0, 0, 0.5);
  }

  &__icon {
    @include mixin-center-children;
    height: 50%;
    widows: 50%;
  }
}
</style>
