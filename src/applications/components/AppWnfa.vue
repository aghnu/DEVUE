<script setup lang="ts">
import { computed, ref } from "vue";
import MovingWindow from "../../components/MovingWindow.vue";
import { MovingWindowLocalState } from "../../types/TypeWindows";

defineProps<{
  state: MovingWindowLocalState;
}>();

const htmlLoaded = ref(false);
const visibilityStyle = computed(() =>
  htmlLoaded.value ? "visible" : "hidden"
);

function handleIframeload() {
  htmlLoaded.value = true;
}
</script>

<template>
  <MovingWindow :state="state">
    <div class="AppWnfa">
      <iframe
        class="AppWnfa__internal"
        src="https://www.aghnu.me/WNFA/"
        frameborder="0"
        @load="handleIframeload"
      />
    </div>
  </MovingWindow>
</template>

<style lang="scss">
.AppWnfa {
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
