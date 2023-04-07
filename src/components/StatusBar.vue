<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useWindowsStatesStore } from "../stores/windowsStates";
import AppIcon from "./AppIcon.vue";
import { APP_DISPLAY_NAME } from "../constants/AppDisplayName";
import { useDynamicColor } from "../composables/useDynamicColor";
import { ref } from "vue";

const windowsStore = useWindowsStatesStore();
const { topWindow } = storeToRefs(windowsStore);
const statusBarElement = ref<HTMLDivElement>();

const { elementDropShadowStyle, elementBorderColorStyle } =
  useDynamicColor(statusBarElement);
</script>

<template>
  <div class="StatusBar" ref="statusBarElement">
    <div class="StatusBar__appinfo">
      <template v-if="topWindow !== null">
        <div class="StatusBar__appinfo__icon">
          <AppIcon
            :name="topWindow.appInstance.name"
            :color="'var(--color-text-statusbar)'"
          ></AppIcon>
        </div>
        <p class="StatusBar__appinfo__name">
          {{ APP_DISPLAY_NAME[topWindow.appInstance.name] }}
        </p>
      </template>
      <template v-else>
        <div class="StatusBar__appinfo__icon"></div>
        <p class="StatusBar__appinfo__name">DEVUE</p>
      </template>
    </div>
  </div>
</template>

<style lang="scss">
.StatusBar {
  @include mixin-glassblur();

  height: 1.5rem;
  color: var(--color-text-statusbar);
  background-color: var(--color-block-transparent-statusbar);

  display: flex;
  justify-content: space-between;
  align-items: center;

  box-shadow: v-bind(elementDropShadowStyle);

  &__appinfo {
    @include mixin-center-children;
    height: 100%;
    width: fit-content;
    padding: 0 0.75rem;

    gap: 0.75rem;

    &__icon {
      height: 60%;
      width: 60%;
    }

    &__name {
      letter-spacing: 0.25em;
      height: 1em;
      line-height: 1em;
      text-align: center;
      white-space: nowrap;
      font-size: 0.75em;
    }
  }
}
</style>
