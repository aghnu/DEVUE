<script setup lang="ts">
import { computed, ref } from "vue";
import MovingWindow from "../../components/MovingWindow.vue";
import { MovingWindowLocalState } from "../../types/TypeWindows";
import { AppTerminal } from "../AppTerminal";

const props = defineProps<{
  state: MovingWindowLocalState;
}>();

const htmlLoaded = ref(false);
const visibilityStyle = computed(() =>
  htmlLoaded.value ? "visible" : "hidden"
);

function handleIframeload(e: Event) {
  const element = e.target as HTMLIFrameElement;
  (props.state.appInstance as AppTerminal).initTerminal(element);
  htmlLoaded.value = true;
}
</script>

<template>
  <MovingWindow :state="state">
    <div class="AppTerminal">
      <iframe
        class="AppTerminal__internal"
        src="https://www.aghnu.me?options=desktop"
        frameborder="0"
        @load="handleIframeload"
      />
    </div>
  </MovingWindow>
</template>

<style lang="scss">
.AppTerminal {
  height: 100%;
  width: 100%;
  &__internal {
    display: block;
    height: 100%;
    width: 100%;
    border: none;
    visibility: v-bind(visibilityStyle);
  }
}
</style>
