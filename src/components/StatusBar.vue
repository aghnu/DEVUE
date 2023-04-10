<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useWindowsStatesStore } from "../stores/windowsStates";
import AppIcon from "./AppIcon.vue";
import { useDynamicColor } from "../composables/useDynamicColor";
import { ref } from "vue";
import { APPLICATION_INDEX } from "../applications/META";

const windowsStore = useWindowsStatesStore();
const { topWindow } = storeToRefs(windowsStore);
const statusBarElement = ref<HTMLDivElement>();

const { elementDropShadowStyle } = useDynamicColor(statusBarElement);
</script>

<template>
  <div ref="statusBarElement" class="StatusBar">
    <Transition name="StatusBar__appinfo__transition" mode="out-in">
      <div
        v-if="topWindow !== null"
        :key="topWindow.appInstance.name"
        class="StatusBar__appinfo"
      >
        <div class="StatusBar__appinfo__icon">
          <AppIcon
            :name="topWindow.appInstance.name"
            :color="'var(--color-text-statusbar)'"
          ></AppIcon>
        </div>
        <p class="StatusBar__appinfo__name">
          {{ APPLICATION_INDEX[topWindow.appInstance.name].nameDisplay }}
        </p>
      </div>
      <div v-else key="DEVUE" class="StatusBar__appinfo">
        <div class="StatusBar__appinfo__icon"></div>
        <p class="StatusBar__appinfo__name">DEVUE</p>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss">
.StatusBar {
  @include mixin-glassblur();

  height: 1.6rem;
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

    &__transition {
      &-enter-active,
      &-leave-active {
        transition: opacity 0.2s;
      }

      &-enter-from,
      &-leave-to {
        opacity: 0 !important;
      }
    }

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
