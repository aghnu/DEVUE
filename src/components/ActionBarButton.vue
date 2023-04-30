<script setup lang="ts">
import { AppName } from "../types/TypeApplication";
import { computed, ref } from "vue";
import { useWindowsStatesStore } from "../stores/windowsStates";
import { storeToRefs } from "pinia";
import { useButtonAction } from "../composables/useButtonAction";
import { APPLICATION_INDEX } from "../applications/META";
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
const pressHover = ref(false);
const buttonElement = ref<HTMLElement>();
const animationPointerDown = computed(
  () => pressDown.value || pointerDown.value
);
const animationPointerHover = computed(
  () => pressHover.value || pointerHover.value
);
const containerSize = computed(() => `${props.size}rem`);
const buttonSizeFactor = computed(() =>
  animationPointerDown.value ? 0.4 : animationPointerHover.value ? 1 : 0.6
);
const buttonSize = computed(() => `${props.size * buttonSizeFactor.value}rem`);

const iconHTML = computed(() => {
  return APPLICATION_INDEX[props.name].getAppIcon({
    size: "100%",
    color: "var(--color-text-actionbar)",
  });
});

const appInstancesCount = computed(() => {
  return getApplicationsInstanceCount.value(props.name);
});

// handle manual press down trigger
let pressDownTimeout: number | undefined = undefined;
function handlePressDown() {
  // manually triggered by system

  // reset state
  pressHover.value = false;
  pressDown.value = false;
  window.clearTimeout(pressDownTimeout);

  // start animation
  pressHover.value = true;
  pressDownTimeout = window.setTimeout(() => {
    pressDown.value = true;
    window.clearTimeout(pressDownTimeout);
    pressDownTimeout = window.setTimeout(() => {
      pressDown.value = false;
      pressHover.value = false;
      emits("click");
    }, 400);
  }, 1000);
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
      ref="buttonElement"
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
          'AppButton__desc--show':
            animationPointerHover && !animationPointerDown,
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
    @include mixin-glassblur;

    position: absolute;

    top: calc(-1 * v-bind(buttonSize) * 0.6);

    font-size: calc(v-bind(buttonSize) * 0.16);
    letter-spacing: 0.1em;
    font-weight: 500;

    line-height: 1em;

    height: fit-content;
    width: fit-content;

    background-color: var(--color-block-transparent-menu);
    color: var(--color-text-menu);

    border-radius: calc(v-bind(buttonSize) * 1);
    padding: calc(v-bind(buttonSize) * 0.1) calc(v-bind(buttonSize) * 0.18);

    transition: all 0.15s;

    opacity: 0;
    text-align: center;
    white-space: nowrap;
    &--show {
      top: calc(-1 * v-bind(buttonSize) * 0.7);
      opacity: 1;
    }
  }

  &__inner {
    @include mixin-clean-button-style;
    @include mixin-center-children;

    position: relative;

    height: v-bind(buttonSize);
    width: v-bind(buttonSize);

    transition: all 0.25s;

    &__icon {
      @include mixin-center-children;
      height: 50%;
      width: 50%;
    }
  }

  &__counter {
    @include mixin-center-children;
    @include mixin-glassblur(0.1rem);

    position: absolute;
    bottom: -5%;
    right: -5%;

    height: 30%;
    line-height: 1em;
    width: fit-content;
    min-width: 30%;

    border-radius: 10rem;

    transition: all 0.3s;

    background-color: var(--color-block-transparent-menu);
    color: var(--color-text-menu);

    font-size: calc(v-bind(buttonSize) * 0.2);
    padding: 0.2em 0.4em;

    font-weight: 500;
  }
}
</style>
