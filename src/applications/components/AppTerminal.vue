<script setup lang="ts">
import MovingWindow from "../../components/MovingWindow.vue";
import { TerminalDataInit } from "../../types/TypeMessage";
import { MovingWindowLocalState } from "../../types/TypeWindows";

defineProps<{
  state: MovingWindowLocalState;
  focused: boolean;
}>();

function terminalInit(element: HTMLIFrameElement) {
  const data: TerminalDataInit = {
    type: "init",
    colorPlain: "#7d7d7d",
    colorFocus: "#f9ca8f",
    colorBackground: "#080808",
    colorAppBackground: "transparent",
    colorDesc: "#7fc5d0",
    fontSize: "14px",
  };
  element.contentWindow?.postMessage(data, "*");
}

function handlerIframeload(e: Event) {
  terminalInit(e.target as HTMLIFrameElement);
}
</script>

<template>
  <MovingWindow
    :id="state.id"
    :position="state.position"
    :size="state.size"
    :order="state.order"
    :focused="focused"
  >
    <div class="AppTerminal">
      <iframe
        class="AppTerminal__internal"
        src="http://localhost:8080?options=desktop"
        frameborder="0"
        @load="handlerIframeload"
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
  }
}
</style>
