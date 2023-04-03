<script setup lang="ts">
import { computed, ref } from "@vue/reactivity";
import { onMounted, watch } from "vue";
import { usePointerLocation } from "../composables/usePointerLocation";
import { useWindowsStatesStore } from "../stores/windowsStates";
import { useTopWindowStartedMoving } from "../composables/useTopWindowStartedMoving";
import { storeToRefs } from "pinia";
import { useDesktopStatesStore } from "../stores/desktopStates";
import { PointerLocation } from "../types/TypeDesktop";
import { WINDOW_CONFIG } from "../constants/WindowManager";

// vairables
const windowsState = useWindowsStatesStore();
const desktopState = useDesktopStatesStore();

const { sizeWindowsManager } = storeToRefs(desktopState);
const { topWindow } = storeToRefs(windowsState);
const { pointerLocation } = usePointerLocation();
const { isTopWindowStartedMoving } = useTopWindowStartedMoving();

const ghostPanelShow = computed(() => {
  return (
    isTopWindowStartedMoving.value &&
    pointerLocation.value !== "center" &&
    topWindow.value !== null
  );
});
const stylePanelZIndex = computed(() => {
  return String(topWindow.value !== null ? topWindow.value.order : 0);
});
const isSnapNarrow = computed(
  () =>
    sizeWindowsManager.value[0] <= WINDOW_CONFIG.DEFAULT_SIZE_MIN_WINDOW[0] * 2
);

const stylePanelFromWidth = ref("unset");
const stylePanelFromHeight = ref("unset");
const stylePanelFromLeft = ref("unset");
const stylePanelFromTop = ref("unset");

const stylePanelToWidth = ref("unset");
const stylePanelToHeight = ref("unset");
const stylePanelToLeft = ref("unset");
const stylePanelToTop = ref("unset");

// life cycles
onMounted(() => {
  watch(
    ghostPanelShow,
    () => {
      if (topWindow.value !== null && topWindow.value.snapped === "center") {
        stylePanelFromWidth.value = String(topWindow.value.size[0]) + "px";
        stylePanelFromHeight.value = String(topWindow.value.size[1]) + "px";
        stylePanelFromLeft.value = String(topWindow.value.position[0]) + "px";
        stylePanelFromTop.value = String(topWindow.value.position[1]) + "px";
      } else {
        stylePanelFromWidth.value = stylePanelToWidth.value;
        stylePanelFromHeight.value = stylePanelToHeight.value;
        stylePanelFromLeft.value = stylePanelToLeft.value;
        stylePanelFromTop.value = stylePanelToTop.value;
      }
    },
    { immediate: true }
  );

  watch(
    pointerLocation,
    (snapped) => {
      // connect snapped based on desktop width
      // if snapped and width too small, make it top
      const snappedCorrected: PointerLocation =
        snapped === "center" ? "center" : isSnapNarrow.value ? "top" : snapped;

      switch (snappedCorrected) {
        case "left":
          stylePanelToWidth.value = "50%";
          stylePanelToHeight.value = "100%";
          stylePanelToLeft.value = "0";
          stylePanelToTop.value = "0";
          break;
        case "right":
          stylePanelToWidth.value = "50%";
          stylePanelToHeight.value = "100%";
          stylePanelToLeft.value = "50%";
          stylePanelToTop.value = "0";
          break;
        case "top":
          stylePanelToWidth.value = "100%";
          stylePanelToHeight.value = "100%";
          stylePanelToLeft.value = "0";
          stylePanelToTop.value = "0";
          break;
      }
    },
    {
      immediate: true,
    }
  );
});
</script>

<template>
  <div class="WindowsManagerGhostPanel">
    <Transition name="WindowsManagerGhostPanel__window">
      <div v-if="ghostPanelShow" class="WindowsManagerGhostPanel__window">
        <div class="WindowsManagerGhostPanel__window__inner"></div>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.WindowsManagerGhostPanel {
  &__window {
    @include mixin-glassblur();
    position: absolute;
    padding: 0.5rem;

    width: v-bind(stylePanelToWidth);
    height: v-bind(stylePanelToHeight);
    left: v-bind(stylePanelToLeft);
    top: v-bind(stylePanelToTop);

    z-index: v-bind(stylePanelZIndex);

    will-change: height, width, left, top, z-index;

    transition: all 0.35s;

    &__inner {
      height: 100%;
      width: 100%;

      background-color: var(--color-block-transparent);

      border-radius: 0.6rem;
    }
  }
}

.WindowsManagerGhostPanel__window {
  &-enter-from {
    opacity: 0;

    width: v-bind(stylePanelFromWidth);
    height: v-bind(stylePanelFromHeight);
    left: v-bind(stylePanelFromLeft);
    top: v-bind(stylePanelFromTop);
  }

  &-leave-to {
    opacity: 0;

    width: v-bind(stylePanelFromWidth);
    height: v-bind(stylePanelFromHeight);
    left: v-bind(stylePanelFromLeft);
    top: v-bind(stylePanelFromTop);
  }
}
</style>
