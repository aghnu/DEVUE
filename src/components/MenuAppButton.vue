<script setup lang="ts">
import { AppName } from "../types/TypeApplication";
import AppIcon from "./AppIcon.vue";
import { useButtonAction } from "../composables/useButtonAction";
import { APPLICATION_INDEX } from "../applications/META";
import { computed } from "vue";

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
        color="var(--color-text-menu)"
        :name="props.name"
        :scale="0.75"
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
  height: 100%;
  border-radius: 0.75rem;
  display: flex;
  gap: 0.85rem;

  padding: 0.65rem 1.5rem 1rem 1rem;

  font-size: 1rem;
  text-align: left;
  transition: all 0.3s;
  color: var(--color-text-menu);

  &--down {
    background-color: rgba(175, 175, 175, 0.35);
  }

  &--hover {
    background-color: rgba(175, 175, 175, 0.2);
  }

  &__icon {
    width: 1.5rem;
    height: 1.5rem;
  }

  &__text {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    &__name {
      display: flex;
      align-items: center;
      height: 1.5rem;
      font-size: 0.9rem;
      white-space: nowrap;
    }

    &__desc {
      font-size: 0.5rem;
    }
  }
}
</style>
