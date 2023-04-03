<script setup lang="ts">
import { AppName } from "../types/TypeApp";
import {
  APP_DISPLAY_DESC,
  APP_DISPLAY_NAME,
} from "../constants/AppDisplayName";
import AppButton from "./AppButton.vue";
import AppIcon from "./AppIcon.vue";
import { useButtonAction } from "../composables/useButtonAction";

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

const emits = defineEmits<{
  (e: "click"): void;
}>();

const props = defineProps<{
  name: AppName;
}>();
</script>

<template>
  <button
    class="MenuAppButton"
    :class="[
      { 'MenuAppButton--hover': pointerHover && !pointerDown },
      { 'MenuAppButton--down': pointerDown },
    ]"
    @mousedown="handlerPointerDown"
    @touchstart="handlerPointerDown"
    @mouseup="handlerPointerUp"
    @touchend="handlerPointerUp"
    @mouseover="handlerHover"
    @mouseleave="handlerLeave"
  >
    <div class="MenuAppButton__icon">
      <AppIcon color="#464646" :name="props.name" :scale="0.75"></AppIcon>
    </div>
    <div class="MenuAppButton__text">
      <p class="MenuAppButton__text__name">
        {{ APP_DISPLAY_NAME[name] }}
      </p>
      <p class="MenuAppButton__text__desc">{{ APP_DISPLAY_DESC[name] }}</p>
    </div>
  </button>
</template>

<style scoped lang="scss">
.MenuAppButton {
  @include mixin-clean-button-style;

  width: 9rem;
  height: 100%;
  border-radius: 1rem;
  display: flex;
  gap: 0.5rem;

  padding: 0.5rem 1rem;

  font-size: 1rem;
  text-align: left;
  transition: all 0.3s;
  color: #464646;

  &--down {
    background-color: rgb(100, 100, 100, 0.2);
  }

  &--hover {
    background-color: rgb(100, 100, 100, 0.1);
  }

  &__icon {
    width: 1.5rem;
    height: 1.5rem;
  }

  &__text {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    &__name {
      display: flex;
      align-items: center;
      height: 1.5rem;
      font-size: 0.85em;
    }

    &__desc {
      font-size: 0.5em;
    }
  }
}
</style>
