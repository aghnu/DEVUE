<script setup lang="ts">
import { getAppIcon } from "../utilities/factorySVG";
import { AppName } from "../types/TypeApp";
import { computed } from "vue";
import { useWindowsStatesStore } from "../stores/windowsStates";
import { storeToRefs } from "pinia";
import { APP_DISPLAY_NAME } from "../constants/AppDisplayName";
import { useButtonAction } from "../composables/useButtonAction";

const props = defineProps<{
  name: AppName;
  type: "primary" | "secondary" | "action" | "warn";
  size: number;
}>();
const emits = defineEmits<{
  (e: "click"): void;
}>();

const windowsState = useWindowsStatesStore();
const { getApplicationsInstanceCount } = storeToRefs(windowsState);
const {
  pointerDown,
  pointerHover,
  handlerPointerDown,
  handlerPointerUp,
  handlerHover,
  handlerLeave,
} = useButtonAction(() => {
  emits("click");
});

const containerSize = computed(() => `${props.size}rem`);
const buttonSizeFactor = computed(() =>
  pointerDown.value ? 0.6 : pointerHover.value ? 1 : 0.8
);
const buttonSize = computed(() => `${props.size * buttonSizeFactor.value}rem`);
const iconHTML = computed(() => {
  switch (props.type) {
    case "primary":
    case "warn":
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

const buttonColor = computed(() => {
  return `var(--color-icon-${props.type})`;
});

const appInstancesCount = computed(() => {
  return getApplicationsInstanceCount.value(props.name);
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
    <div
      :class="[
        'AppButton__desc',
        {
          'AppButton__desc--show': pointerHover && !pointerDown,
        },
      ]"
      role="presentation"
    >
      <p>{{ APP_DISPLAY_NAME[name] }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.AppButton {
  @include mixin-center-children;

  overflow: visible;
  position: relative;

  height: v-bind(containerSize);
  width: fit-content;

  &__desc {
    @include mixin-center-children;
    position: absolute;

    top: calc(-1 * v-bind(buttonSize) * 0.6);

    font-size: calc(v-bind(buttonSize) * 0.2);
    letter-spacing: 0.1em;
    font-weight: 500;

    line-height: 1em;

    height: fit-content;
    width: fit-content;

    background-color: rgb(70, 70, 70);
    color: rgba(195, 195, 195, 0.75);

    border-radius: calc(v-bind(buttonSize) * 100);
    padding: calc(v-bind(buttonSize) * 0.12) calc(v-bind(buttonSize) * 0.22);

    transition: all 0.15s;

    opacity: 0;
    text-align: center;
    white-space: nowrap;
    &--show {
      top: calc(-1 * v-bind(buttonSize) * 0.75);
      opacity: 1;
    }
  }

  &__inner {
    @include mixin-clean-button-style;
    @include mixin-center-children;

    position: relative;

    background-color: v-bind(buttonColor);
    border-radius: calc(v-bind(buttonSize) * 0.42);

    height: v-bind(buttonSize);
    width: v-bind(buttonSize);

    transition: all 0.3s;

    &--secondary,
    &--action {
      background-color: var(--color-icon-secondary);
    }

    &__icon {
      @include mixin-center-children;
      height: 35%;
      width: 35%;
    }
  }

  &__counter {
    @include mixin-center-children;
    @include mixin-glassblur(0.1rem);

    position: absolute;
    bottom: 0;
    right: 0;

    height: 35%;
    line-height: 1em;
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
