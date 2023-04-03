<script setup lang="ts">
import { computed } from "vue";
import { AppName } from "../types/TypeApp";
import { getAppIcon } from "../utilities/factorySVG";

const props = withDefaults(
  defineProps<{
    name: AppName;
    color: string;
    scale: number;
  }>(),
  {
    scale: 1,
  }
);

const iconHTML = computed(() => {
  return getAppIcon(props.name, {
    size: `${props.scale * 100}%`,
    color: props.color,
  });
});
</script>

<template>
  <div class="AppIcon" v-html="iconHTML"></div>
</template>

<style scoped lang="scss">
.AppIcon {
  @include mixin-center-children;
  width: 100%;
  height: 100%;
}
</style>
