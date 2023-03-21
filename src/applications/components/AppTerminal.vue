<script setup lang="ts">
import MovingWindow from "../../components/MovingWindow.vue";
import { TerminalDataInit } from "../../types/TypeMessage";
import { MovingWindowLocalState } from "../../types/TypeWindows";
import { getGlobalCSSVarValue } from "../../utilities/getGlobalCSSVarValue";

defineProps<{
  state: MovingWindowLocalState;
}>();

function terminalInit(element: HTMLIFrameElement) {
  const data: TerminalDataInit = {
    type: "init",
    colorPlain: getGlobalCSSVarValue("--color-terminal-plain") ?? "#a9a9a9",
    colorFocus: getGlobalCSSVarValue("--color-terminal-focus") ?? "#f9ca8f",
    colorBackground: getGlobalCSSVarValue("--color-terminal-background") ?? "#020202",
    colorAppBackground: "transparent",
    colorDesc: getGlobalCSSVarValue("--color-terminal-desc") ?? "#7fc5d0",
    fontSize: "14px",
  };
  element.contentWindow?.postMessage(data, "*");
}

function handlerIframeload(e: Event) {
  terminalInit(e.target as HTMLIFrameElement);
}
</script>

<template>
  <MovingWindow :state="state">
    <div class="AppTerminal">
      <iframe
        class="AppTerminal__internal"
        src="https://www.aghnu.me?options=desktop"
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
