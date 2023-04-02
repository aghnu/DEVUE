<script setup lang="ts">
import { computed, ref } from "vue";
import { useResponsiveFontSizeFactor } from "../../composables/useResponsiveFontSizeFactor";
import { useTrackComputedStyle } from "../../composables/useTrackComputedStyle";
import { convertStyleUnitPxToNumber } from "../../utilities/helpers";
import { Trigger } from "../../utilities/trigger";

const props = withDefaults(
  defineProps<{
    text: string;
    align: "left" | "right" | "center";
    refreshTrigger: Trigger | null;
  }>(),
  {
    refreshTrigger: null,
  }
);

const textElement = ref<HTMLParagraphElement>();
const textContainerElement = ref<HTMLDivElement>();

const styleJustifyContent = computed(() => {
  switch (props.align) {
    case "left":
      return "flex-start";
    case "right":
      return "flex-end";
    case "center":
      return "center";
  }
});
const widthTextStyle = useTrackComputedStyle(textElement, "width").propertyRef;
const widthContainerStyle = useTrackComputedStyle(
  textContainerElement,
  "width"
).propertyRef;

const widthText = computed(() => {
  if (!widthTextStyle.value) return 0;
  return convertStyleUnitPxToNumber(widthTextStyle.value as string) ?? 0;
});

const widthContainer = computed(() => {
  if (!widthContainerStyle.value) return 0;
  return convertStyleUnitPxToNumber(widthContainerStyle.value as string) ?? 0;
});

const { fontSizeFactor, refreshSizeFactor } = useResponsiveFontSizeFactor(
  widthText,
  widthContainer
);

// connect trigger
if (props.refreshTrigger) {
  props.refreshTrigger.listen(() => {
    refreshSizeFactor();
  });
}
</script>

<template>
  <div class="ResponsiveText" ref="textContainerElement">
    <p class="ResponsiveText__text" ref="textElement">{{ text }}</p>
  </div>
</template>

<style scoped lang="scss">
.ResponsiveText {
  width: 100%;
  display: flex;
  justify-content: v-bind(styleJustifyContent);
  &__text {
    width: fit-content;
    font-size: calc(v-bind(fontSizeFactor) * 1em);
    white-space: nowrap;
  }
}
</style>
