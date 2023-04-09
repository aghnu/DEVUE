<script setup lang="ts">
import AppButton from "./AppButton.vue";
import { ref } from "vue";
import { useWindowsStatesStore } from "../stores/windowsStates";
import AppMenu from "./AppMenu.vue";
import ScreenBlocker from "./ScreenBlocker.vue";
import { useDynamicColor } from "../composables/useDynamicColor";
import { APPLICATION_INDEX, applicationActionBar } from "../applications/META";
import { computed } from "@vue/reactivity";
import { AppName, ApplicationMetaInternal } from "../types/TypeApplication";
import { Trigger } from "../utilities/trigger";

const props = defineProps<{
  pressButtonTrigger: Trigger;
}>();

const buttonSize = ref(2.9);
const windowsState = useWindowsStatesStore();
const menuOpen = ref(false);
const actionBarElement = ref<HTMLDivElement>();

function handleMenuToggle() {
  menuOpen.value = !menuOpen.value;
}

function handleMenuClose() {
  menuOpen.value = false;
}

const { elementDropShadowStyle, elementBorderColorStyle } =
  useDynamicColor(actionBarElement);

const appsMeta = computed(() => {
  const appsMetaList: ApplicationMetaInternal[] = [];
  applicationActionBar.forEach((appName) => {
    const meta = APPLICATION_INDEX[appName];
    if (meta.type === "internal") appsMetaList.push(meta);
  });
  return appsMetaList;
});

// set up triggers
const triggerMap = computed(() => {
  // apps metas + menu + reset
  const map: Map<AppName, Trigger> = new Map([
    ["menu", Trigger.build()],
    ["reset", Trigger.build()],
  ]);

  appsMeta.value.forEach((meta) => {
    map.set(meta.name, Trigger.build());
  });

  return map;
});

props.pressButtonTrigger.listen((message) => {
  if (!message) return;
  const trigger = triggerMap.value.get(message as AppName);
  if (trigger) {
    trigger.notify();
  }
});
</script>

<template>
  <div class="ActionBar">
    <transition name="ActionBarTransition__menu">
      <AppMenu
        v-if="menuOpen"
        @close="handleMenuClose()"
        class="ActionBar__menu"
      ></AppMenu>
    </transition>
    <div class="ActionBar__inner" ref="actionBarElement">
      <Teleport v-if="menuOpen" to="#teleport-actionbar-menu">
        <ScreenBlocker @click="handleMenuClose"></ScreenBlocker
      ></Teleport>

      <AppButton
        name="menu"
        :size="buttonSize"
        :press="triggerMap.has('menu') ? triggerMap.get('menu') : null"
        @click="handleMenuToggle"
      ></AppButton>
      <div class="ActionBar__dividor"></div>

      <!-- Applications that is pinned to action bar -->

      <AppButton
        v-for="meta in appsMeta"
        :key="meta.name"
        :name="meta.name"
        :size="buttonSize"
        :press="triggerMap.has(meta.name) ? triggerMap.get(meta.name) : null"
        @click="
          () => {
            meta.objectClass.build().open();
            handleMenuClose();
          }
        "
      ></AppButton>

      <div class="ActionBar__dividor"></div>
      <AppButton
        name="reset"
        :size="buttonSize"
        :press="triggerMap.has('reset') ? triggerMap.get('reset') : null"
        @click="
          windowsState.resetMovingWindow();
          handleMenuClose();
        "
      ></AppButton>
    </div>
  </div>
</template>

<style scoped lang="scss">
.ActionBarTransition {
  &__menu {
    &-enter-active,
    &-leave-active {
      transition: all 0.2s, opacity 0.2s;
    }

    &-enter-from,
    &-leave-to {
      transform: scale(0.5) translate(0, 100%);
      opacity: 0;
    }
  }
}

.ActionBar {
  @include mixin-center-children;

  position: relative;
  width: 0%;
  height: 100%;

  &__inner {
    @include mixin-center-children;
    @include mixin-disable-pointer;
    @include mixin-glassblur();

    display: flex;
    gap: calc(v-bind(buttonSize) * 0.35rem);

    width: fit-content;
    height: fit-content;

    padding: calc(v-bind(buttonSize) * 0.15rem)
      calc(v-bind(buttonSize) * 0.3rem);
    border-radius: calc(v-bind(buttonSize) * 0.5rem);

    border: solid;
    border-width: 1px;
    border-color: v-bind(elementBorderColorStyle);
    background-color: var(--color-block-transparent-actionbar);

    box-shadow: v-bind(elementDropShadowStyle);
  }

  &__menu {
    position: absolute;
    bottom: 175%;
  }

  &__dividor {
    height: calc(v-bind(buttonSize) * 0.45rem);
    // margin-left: 0.5rem;
    // margin-right: 0.5rem;
    width: 2px;
    border-radius: calc(v-bind(buttonSize) * 100rem);
    background-color: var(--color-icon-dividor);
  }
}
</style>
