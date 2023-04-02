<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import GlobalAnimation from "../../utilities/globalAnimation";

const props = defineProps<{
  text: string;
  align: "left" | "right" | "center";
}>();

const textContent = computed(() => props.text);
const textElement = ref<HTMLParagraphElement>();
const textContainerElement = ref<HTMLDivElement>();

const widthText = ref(0);
const widthContainer = ref(0);
const styleTextFontSizeFactor = ref(1);

function computedPxToNumber(stylePx: string) {
  const groups = stylePx.match(/^([0-9\.]*)px$/);
  if (groups) return Number(groups[1]);
  return null;
}

function updateWidthText() {
  // undefined
  if (textElement.value === undefined) return;

  // computed width not exist or legal
  const widthTextNew = computedPxToNumber(
    getComputedStyle(textElement.value).width
  );
  if (widthTextNew === null) return;

  // update refs
  widthText.value = widthTextNew;
}

function updateWidthContainer() {
  // undefined
  if (textContainerElement.value === undefined) return;

  // computed width not exist or legal
  const widthContainerNew = computedPxToNumber(
    getComputedStyle(textContainerElement.value).width
  );
  if (widthContainerNew === null) return;

  // update refs
  widthContainer.value = widthContainerNew;
}

let stopTextSize = false;
function updateStyleTextFontSizeFactor(factor: number) {
  if (factor === styleTextFontSizeFactor.value) return;

  stopTextSize = true;
  styleTextFontSizeFactor.value = factor;
}

function handleSizeChange(widthText: number, widthContainer: number) {
  const newFactor =
    widthContainer / (widthText / styleTextFontSizeFactor.value);
  updateStyleTextFontSizeFactor(Math.min(newFactor, 1));
  console.log("COOL");
}

onMounted(() => {
  GlobalAnimation.getInstance().subscribe(updateWidthContainer);
  GlobalAnimation.getInstance().subscribe(updateWidthText);
  watch(widthContainer, (value) => {
    handleSizeChange(widthText.value, value);
  });
  watch(widthText, (value) => {
    if (stopTextSize) {
      stopTextSize = false;
      return;
    }
    handleSizeChange(value, widthContainer.value);
  });
});

onUnmounted(() => {
  GlobalAnimation.getInstance().unsubscribe(updateWidthText);
  GlobalAnimation.getInstance().unsubscribe(updateWidthContainer);
});
</script>

<template>
  <div class="ResponsiveText" ref="textContainerElement">
    <p class="ResponsiveText__text" ref="textElement">{{ text }}</p>
  </div>
</template>

<style scoped lang="scss">
.ResponsiveText {
  width: 100%;
  background-color: green;
  &__text {
    background-color: blue;
    width: fit-content;
    font-size: calc(v-bind(styleTextFontSizeFactor) * 1em);
  }
}
</style>
