<script setup lang="ts">
import { computed } from "vue";
import { AppName } from "../types/TypeApplication";
import APPLICATION_INDEX from "../applications";

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
    color: props.color,
  });
});
</script>

<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div class="AppIcon" v-html="iconHTML"></div>
</template>

<style scoped lang="scss">
.AppIcon {
  @include mixin-center-children;
  width: 100%;
  height: 100%;
}
</style>
