<script setup lang="ts">
import { AppName } from "../types/TypeApplication";
import { computed, ref } from "vue";
import { useWindowsStatesStore } from "../stores/windowsStates";
import { storeToRefs } from "pinia";
import { useButtonAction } from "../composables/useButtonAction";
import { APPLICATION_INDEX } from "../applications/META";
import { applicationActionBarStyle } from "../applications/META";
import { Trigger } from "../utilities/trigger";

const props = withDefaults(
  defineProps<{
    name: AppName;
    size: number;
    press?: Trigger | null;
  }>(),
  {
    press: null,
  }
);

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
const pressDown = ref(false);
const animationPointerDown = computed(
  () => pressDown.value || pointerDown.value
);

const containerSize = computed(() => `${props.size}rem`);
const buttonSizeFactor = computed(() =>
  animationPointerDown.value ? 0.6 : pointerHover.value ? 1 : 0.8
);
const buttonSize = computed(() => `${props.size * buttonSizeFactor.value}rem`);
const meta = computed(() => APPLICATION_INDEX[props.name]);

const iconHTML = computed(() => {
  const specialStyle = applicationActionBarStyle[props.name];
  if (specialStyle !== undefined) {
    return APPLICATION_INDEX[props.name].getAppIcon({
      size: "100%",
      color: specialStyle.colorText,
    });
  }

  if (meta.value.type === "internal") {
    return APPLICATION_INDEX[props.name].getAppIcon({
      size: "100%",
      color: "var(--color-icon-inner-dark)",
    });
  }

  return APPLICATION_INDEX[props.name].getAppIcon({
    size: "100%",
    color: "var(--color-icon-inner)",
  });
});

const buttonColor = computed(() => {
  const specialStyle = applicationActionBarStyle[props.name];
  if (specialStyle !== undefined) {
    return specialStyle.colorBackground;
  }

  if (meta.value.type === "internal") {
    return "var(--color-icon-primary)";
  }

  return "var(--color-icon-secondary)";
});

const appInstancesCount = computed(() => {
  return getApplicationsInstanceCount.value(props.name);
});

// handle manual press down trigger
let pressDownTimeout: number | undefined = undefined;
function handlePressDown() {
  // manually triggered by system
  window.clearTimeout(pressDownTimeout);
  pressDown.value = true;
  pressDownTimeout = window.setTimeout(() => {
    pressDown.value = false;
    emits("click");
  }, 450);
}
if (props.press !== null) {
  props.press.listen(() => {
    handlePressDown();
  });
}
</script>

<template>
  <div class="AppButton">
    <button
      class="AppButton__inner"
      :class="[{ 'AppButton__inner--down': animationPointerDown }]"
      @mousedown="handlerPointerDown"
      @touchstart="handlerPointerDown"
      @mouseup="handlerPointerUp"
      @touchend="handlerPointerUp"
      @mouseover="handlerHover"
      @mouseleave="handlerLeave"
    >
      <!-- eslint-disable-next-line vue/no-v-html -->
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
          'AppButton__desc--show': pointerHover && !animationPointerDown,
        },
      ]"
      role="presentation"
    >
      <p>{{ APPLICATION_INDEX[name].nameDisplay }}</p>
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
