<script setup lang="ts">
import AppMenuButton from "./AppMenuButton.vue";
import { useDynamicColor } from "../composables/useDynamicColor";
import { ref, computed } from "vue";
import {
  ApplicationMetaExternal,
  ApplicationMetaInternal,
} from "../types/TypeApplication";

import APPLICATION_INDEX from "../applications";
import { applicationMenu } from "../applications";

const emits = defineEmits<{
  (e: "close"): void;
}>();

const AppMenuElement = ref<HTMLDivElement>();
const { elementBorderColorStyle } = useDynamicColor(AppMenuElement);

const AppInternalMetaArray = computed(() => {
  const appsMetaList: ApplicationMetaInternal[] = [];

  applicationMenu.forEach((appName) => {
    const meta = APPLICATION_INDEX[appName];
    if (meta.type === "internal") appsMetaList.push(meta);
  });

  return appsMetaList;
});

const AppExternalMetaArray = computed(() => {
  const appsMetaList: ApplicationMetaExternal[] = [];

  applicationMenu.forEach((appName) => {
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
  <div ref="AppMenuElement" class="AppMenu">
    <div :class="['AppMenu__container', 'AppMenu__container--primary']">
      <AppMenuButton
        v-for="meta in AppInternalMetaArray"
        :key="meta.name"
        :name="meta.name"
        @click="
          () => {
            meta.objectClass.build().open();
            handleClose();
          }
        "
      ></AppMenuButton>
    </div>
    <div :class="['AppMenu__container', 'AppMenu__container--secondary']">
      <AppMenuButton
        v-for="meta in AppExternalMetaArray"
        :key="meta.name"
        :name="meta.name"
        @click="
          () => {
            meta.objectClass.build().open();
            handleClose();
          }
        "
      ></AppMenuButton>
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
  border-radius: 0.9rem;
  // padding: 0.25rem;

  /* box-shadow: v-bind(elementDropShadowIntensityStyle); */
  border: solid;
  border-width: 2px;
  border-color: v-bind(elementBorderColorStyle);

  display: flex;
  flex-direction: column;

  overflow: hidden;

  &__container {
    padding: 0.75rem 0.9rem;
    // border-radius: 0.5rem;
    height: fit-content;

    display: grid;
    grid-template-columns: 50% 50%;
    row-gap: 0.85rem;
    column-gap: 0.5rem;
    align-items: center;
    justify-items: center;
    justify-content: center;

    @include width-narrow() {
      grid-template-columns: 100%;
    }

    &--primary {
      background-color: rgba(150, 150, 150, 0.075);
    }

    // &--secondary {
    // }
  }
}
</style>
