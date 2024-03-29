<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useWindowsStatesStore } from "../stores/windowsStates";
import { useDynamicColor } from "../composables/useDynamicColor";
import { AppName, ApplicationMetaInternal } from "../types/TypeApplication";
import { Trigger } from "../utilities/trigger";
import { storeToRefs } from "pinia";
import { applicationActionBar } from "../applications";

import AppMenu from "./AppMenu.vue";
import ActionBarButton from "./ActionBarButton.vue";
import ScreenBlocker from "./ScreenBlocker.vue";
import APPLICATION_INDEX from "../applications";

// import { useDateTime } from "../composables/useDateTime";

const props = defineProps<{
  pressButtonTrigger: Trigger;
}>();

const buttonSize = ref(4);
const windowsState = useWindowsStatesStore();
const { movingWindowTotalCount } = storeToRefs(windowsState);
const menuOpen = ref(false);
const actionBarElement = ref<HTMLDivElement>();

function handleMenuToggle() {
  menuOpen.value = !menuOpen.value;
}

function handleMenuClose() {
  menuOpen.value = false;
}

const { elementBorderColorStyle, elementDropShadowIntensityStyle } =
  useDynamicColor(actionBarElement);

// const { timeString, dateString } = useDateTime();

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

onMounted(() => {
  watch(
    movingWindowTotalCount,
    (value) => {
      if (value === 0) {
        const menuAppTrigger = triggerMap.value.get("menu");
        menuAppTrigger?.notify();
      }
    },
    { immediate: true }
  );
});
</script>

<template>
  <div class="ActionBar">
    <transition name="ActionBarTransition__menu">
      <AppMenu
        v-if="menuOpen"
        class="ActionBar__menu"
        @close="handleMenuClose()"
      ></AppMenu>
    </transition>
    <div ref="actionBarElement" class="ActionBar__inner">
      <Teleport v-if="menuOpen" to="#teleport-actionbar-menu">
        <ScreenBlocker @click="handleMenuClose"></ScreenBlocker
      ></Teleport>

      <ActionBarButton
        name="menu"
        :size="buttonSize"
        :press="triggerMap.has('menu') ? triggerMap.get('menu') : null"
        @click="handleMenuToggle"
      ></ActionBarButton>
      <!-- <div class="ActionBar__dividor"></div> -->

      <!-- Applications that is pinned to action bar -->

      <ActionBarButton
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
      ></ActionBarButton>

      <!-- <div class="ActionBar__dividor"></div> -->
      <ActionBarButton
        name="reset"
        :size="buttonSize"
        :press="triggerMap.has('reset') ? triggerMap.get('reset') : null"
        @click="
          windowsState.resetMovingWindow();
          handleMenuClose();
        "
      ></ActionBarButton>
      <!-- <div class="ActionBar__info">
        <div class="ActionBar__info__date_time">
          <p class="ActionBar__info__date_time__time">{{ timeString }}</p>
          <p class="ActionBar__info__date_time__date">{{ dateString }}</p>
        </div>
      </div> -->
    </div>
  </div>
</template>

<style scoped lang="scss">
.ActionBar {
  @include mixin-center-children;

  position: relative;
  width: 0%;
  height: 100%;

  .ActionBarTransition {
    &__menu {
      &-enter-active,
      &-leave-active {
        transition: transform 0.185s, bottom 0.185s, opacity 0.185s;
      }

      &-enter-from,
      &-leave-to {
        transform: scale(0.9);
        bottom: 90%;
        opacity: 0;
      }
    }
  }

  &__inner {
    @include mixin-center-children;
    @include mixin-disable-pointer;
    @include mixin-glassblur;

    display: flex;
    gap: calc(v-bind(buttonSize) * 0.4rem);

    width: fit-content;
    height: fit-content;

    padding: calc(v-bind(buttonSize) * 0.05rem)
      calc(v-bind(buttonSize) * 0.35rem);
    border-radius: calc(v-bind(buttonSize) * 0.5rem);

    border: solid;
    border-width: 2px;
    border-color: v-bind(elementBorderColorStyle);
    background-color: var(--color-block-transparent-actionbar);

    box-shadow: v-bind(elementDropShadowIntensityStyle);
  }

  &__menu {
    position: absolute;
    bottom: 175%;
    // transform: scale(1) translate(0, calc(v-bind(buttonSize) * -5rem));
  }

  &__dividor {
    height: calc(v-bind(buttonSize) * 0.45rem);
    margin-left: calc(v-bind(buttonSize) * -0.1rem);
    margin-right: calc(v-bind(buttonSize) * -0.1rem);
    width: calc(v-bind(buttonSize) * 0.05rem);
    border-radius: calc(v-bind(buttonSize) * 100rem);
    background-color: var(--color-icon-dividor);
  }

  &__info {
    @include mixin-center-children;
    min-width: calc(v-bind(buttonSize) * 1.8rem);
    width: fit-content;

    &__date_time {
      font-size: calc(v-bind(buttonSize) * 0.215rem);
      color: var(--color-text-actionbar);
      text-align: center;
      letter-spacing: 0.165em;
      font-weight: 500;

      display: flex;
      flex-direction: column;
      gap: calc(v-bind(buttonSize) * 0.13rem);

      white-space: nowrap;
      &__time {
        line-height: 1em;
        height: 1em;
        font-size: 1.07em;
      }

      &__date {
        line-height: 1em;
        height: 1em;
        font-size: 1em;
      }
    }
  }
}
</style>
