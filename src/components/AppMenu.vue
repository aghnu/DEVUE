<script setup lang="ts">
import MenuAppButton from "./MenuAppButton.vue";
import { AppTerminal } from "../applications/AppTerminal";
import { AppCalculator } from "../applications/AppCalculator";
import { AppGithub } from "../applications/AppGithub";
import { AppLinkedin } from "../applications/AppLinkedin";
import { useDynamicColor } from "../composables/useDynamicColor";
import { ref } from "vue";
import { AppWnfa } from "../applications/AppWnfa";
import { computed } from "@vue/reactivity";
import {
  APPLICATION_INDEX,
  APPLICATION_INDEX_NAME_EXTERNAL,
  APPLICATION_INDEX_NAME_INTERNAL,
} from "../applications/META";
import {
  ApplicationMetaExternal,
  ApplicationMetaInternal,
} from "../types/TypeApplication";

const emits = defineEmits<{
  (e: "close"): void;
}>();

const AppMenuElement = ref<HTMLDivElement>();
const { elementDropShadowStyle, elementBorderColorStyle } =
  useDynamicColor(AppMenuElement);

const AppInternalMetaArray = computed(() => {
  const appsMetaList: ApplicationMetaInternal[] = [];

  APPLICATION_INDEX_NAME_INTERNAL.forEach((appName) => {
    const meta = APPLICATION_INDEX[appName];
    if (meta.type === "internal") appsMetaList.push(meta);
  });
  return appsMetaList;
});

const AppExternalMetaArray = computed(() => {
  const appsMetaList: ApplicationMetaExternal[] = [];
  APPLICATION_INDEX_NAME_EXTERNAL.forEach((appName) => {
    const meta = APPLICATION_INDEX[appName];
    if (meta.type === "external") appsMetaList.push(meta);
  });
  return appsMetaList;
});

function handleClose() {
  emits("close");
}
</script>

<template>
  <div class="AppMenu" ref="AppMenuElement">
    <div :class="['AppMenu__container', 'AppMenu__container--primary']">
      <MenuAppButton
        v-for="meta in AppInternalMetaArray"
        :key="meta.name"
        :name="meta.name"
        @click="
          () => {
            meta.objectClass.build().open();
            handleClose();
          }
        "
      ></MenuAppButton>
    </div>
    <div :class="['AppMenu__container', 'AppMenu__container--secondary']">
      <MenuAppButton
        v-for="meta in AppExternalMetaArray"
        :key="meta.name"
        :name="meta.name"
        @click="
          () => {
            meta.objectClass.build().open();
            handleClose();
          }
        "
      ></MenuAppButton>
    </div>
  </div>
</template>

<style scoped lang="scss">
.AppMenu {
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
