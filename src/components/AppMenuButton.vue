<script setup lang="ts">
import { AppName } from "../types/TypeApplication";
import AppIcon from "./AppIcon.vue";
import { useButtonAction } from "../composables/useButtonAction";
import { computed } from "vue";

import APPLICATION_INDEX from "../applications";

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

const meta = computed(() => APPLICATION_INDEX[props.name]);
const styleAppIconColor = computed(() => {
  return pointerDown.value || pointerHover.value
    ? "var(--color-text-menu-focus)"
    : "var(--color-text-menu)";
});
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
      <AppIcon
        :color="styleAppIconColor"
        :name="props.name"
        :scale="0.7"
      ></AppIcon>
    </div>
    <div class="MenuAppButton__text">
      <p class="MenuAppButton__text__name">
        {{ meta.nameDisplay }}
      </p>
      <p
        v-if="meta.type !== 'action' && meta.description.length > 0"
        class="MenuAppButton__text__desc"
      >
        {{ meta.description }}
      </p>
    </div>
  </button>
</template>

<style scoped lang="scss">
.MenuAppButton {
  @include mixin-clean-button-style;

  width: 100%;
  min-width: 10.5rem;
  height: 100%;
  border-radius: 0.9rem;
  display: flex;
  gap: 0.85rem;

  padding: 0.7rem 1.75rem 1rem 1.25rem;

  font-size: 1rem;
  text-align: left;
  transition: all 0.3s;
  color: var(--color-text-menu);

  &--down {
    background-color: var(--color-block-transparent-menu-focus);
    color: var(--color-text-menu-focus);
    opacity: 0.9;
  }

  &--hover {
    background-color: var(--color-block-transparent-menu-focus);
    color: var(--color-text-menu-focus);
  }

  &__icon {
    width: 1.5rem;
    height: 1.5rem;
  }

  &__text {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    &__name {
      display: flex;
      align-items: center;
      height: 1.5rem;
      font-size: 0.9rem;
      letter-spacing: 0.075em;
      white-space: nowrap;
    }

    &__desc {
      font-size: 0.6rem;
      letter-spacing: 0.05em;
      line-height: 1.5em;
      opacity: 0.85;
    }
  }
}
</style>
