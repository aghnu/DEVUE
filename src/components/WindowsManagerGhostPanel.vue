<script setup lang="ts">
import { computed, ref } from "@vue/reactivity";
import { onMounted, watch } from "vue";
import { MovingWindowLocalState } from "./WindowsManager.vue";
import { useDesktopStatesStore } from "../stores/desktopStates";
import { storeToRefs } from "pinia";

const props = defineProps<{
  focusedMovingWindowState: MovingWindowLocalState | null; // get focused window order and its state
  ghostPanelEnabled: boolean;
}>();
// vairables
const desktopStates = useDesktopStatesStore();

// reactive variables
const { pointerLocation } = storeToRefs(desktopStates);
const ghostPanelShow = computed(() => {
  return (
    props.ghostPanelEnabled &&
    pointerLocation.value !== "center" &&
    props.focusedMovingWindowState !== null
  );
});
const stylePanelZIndex = computed(() => {
  return String(
    props.focusedMovingWindowState !== null
      ? props.focusedMovingWindowState.order
      : 0
  );
});

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
      if (props.focusedMovingWindowState !== null) {
        stylePanelFromWidth.value =
          String(props.focusedMovingWindowState!.size[0]) + "px";
        stylePanelFromHeight.value =
          String(props.focusedMovingWindowState!.size[1]) + "px";
        stylePanelFromLeft.value =
          String(props.focusedMovingWindowState!.position[0]) + "px";
        stylePanelFromTop.value =
          String(props.focusedMovingWindowState!.position[1]) + "px";
      }
    },
    { immediate: true }
  );

  watch(
    pointerLocation,
    () => {
      switch (pointerLocation.value) {
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

<style lang="scss">
.WindowsManagerGhostPanel {
  &__window {
    position: absolute;
    padding: 0.25rem;

    width: v-bind(stylePanelToWidth);
    height: v-bind(stylePanelToHeight);
    left: v-bind(stylePanelToLeft);
    top: v-bind(stylePanelToTop);

    z-index: v-bind(stylePanelZIndex);

    transition: all 0.5s;

    &__inner {
      height: 100%;
      width: 100%;

      border-radius: 0.55rem;
      box-shadow: 0 0 0.55rem rgba(0, 0, 0, 0.2);
      background-color: rgba(0, 0, 0, 0.6);
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
