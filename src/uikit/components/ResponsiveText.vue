<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useTrackComputedStyle } from "../../composables/useTrackComputedStyle";
import { convertStyleUnitPxToNumber } from "../../utilities/helpers";

const props = withDefaults(
  defineProps<{
    text: string;
    align: "left" | "right" | "center";
  }>(),
  {
    align: "right",
  }
);

const textElement = ref<HTMLParagraphElement>();
const textContainerElement = ref<HTMLDivElement>();
const text = computed(() => props.text);

const widthTextStyle = useTrackComputedStyle(
  textElement,
  "width",
  ":after"
).propertyRef;
const widthContainerStyle = useTrackComputedStyle(
  textContainerElement,
  "width"
).propertyRef;
const parentFontSizeStyle = useTrackComputedStyle(
  textContainerElement,
  "fontSize"
).propertyRef;

const widthText = computed(() => {
  if (!widthTextStyle.value) return 0;
  return convertStyleUnitPxToNumber(widthTextStyle.value as string) ?? 0;
});

const widthContainer = computed(() => {
  if (!widthContainerStyle.value) return 0;
  return convertStyleUnitPxToNumber(widthContainerStyle.value as string) ?? 0;
});

const parentFontSizeStyleCorrected = computed(
  () => parentFontSizeStyle.value ?? "0px"
);
const fontSizeStyle = ref("0px");
onMounted(() => {
  // update fontSizeStyle of the text based on container size and pseudo element size
  watch([widthContainer, widthText], ([widthContainerNew, widthTextNew]) => {
    if (!textElement.value) return;
    const pseudoFontSize = convertStyleUnitPxToNumber(
      window.getComputedStyle(textElement.value, ":after")["fontSize"]
    );
    if (pseudoFontSize === null) return;

    fontSizeStyle.value =
      Math.min(widthContainerNew / widthTextNew, 1) * pseudoFontSize + "px";
  });

  // update pseudo element content text
  watch(
    text,
    () => {
      if (textElement.value) {
        textElement.value.dataset.text = props.text;
      }
    },
    { immediate: true }
  );
});
</script>

<template>
  <div ref="textContainerElement" class="ResponsiveText">
    <p ref="textElement" class="ResponsiveText__text">{{ text }}</p>
  </div>
</template>

<style scoped lang="scss">
.ResponsiveText {
  position: relative;
  width: 100%;
  height: fit-content;
  display: flex;
  &__text {
    position: relative;
    height: fit-content;
    width: 100%;
    font-size: v-bind(fontSizeStyle);
    white-space: nowrap;
    text-align: v-bind(align);

    &::after {
      position: absolute;
      visibility: hidden;
      right: 100%;
      font-size: v-bind(parentFontSizeStyleCorrected);
      content: attr(data-text);
    }
  }
}
</style>
