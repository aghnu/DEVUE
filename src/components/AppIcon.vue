<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { AppName } from "../types/TypeApplication";
import APPLICATION_INDEX from "../applications";
import { getCSSVarValueRecursive } from "../utilities/getGlobalCSSVarValue";
import gsap from "gsap";

const props = withDefaults(
  defineProps<{
    name: AppName;
    color: string;
    scale?: number;
  }>(),
  {
    scale: 1,
  }
);

const iconHTML = computed(() => {
  return APPLICATION_INDEX[props.name].getAppIcon({
    size: `${props.scale * 100}%`,
    color: "var(--app-icon-color)",
  });
});

const appIconColor = computed(() => props.color);

const appIconElement = ref<HTMLDivElement>();

function setAppIconColor(name: string, duration: number) {
  if (appIconElement.value) {
    gsap.to(appIconElement.value, {
      "--app-icon-color":
        getCSSVarValueRecursive(name, appIconElement.value) ?? "transparent",
      duration: duration,
      ease: "power1",
      overwrite: "auto",
    });
  }
}

onMounted(() => {
  watch(appIconColor, (value) => {
    setAppIconColor(value, 0.3);
  });
  setAppIconColor(props.color, 0);
});
</script>

<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div ref="appIconElement" class="AppIcon" v-html="iconHTML"></div>
</template>

<style scoped lang="scss">
.AppIcon {
  @include mixin-center-children;
  width: 100%;
  height: 100%;
}
</style>
