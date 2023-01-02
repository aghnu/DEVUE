<script setup lang="ts">
import { ref, Ref, onMounted, onUnmounted } from "vue";

const logoTextElement: Ref<undefined | HTMLSpanElement> = ref();
const logoTextString: string = "AGHNU";
let intervalAnimationLogo: number | undefined = undefined;

onMounted(() => {
  // animation
  let i = 0;
  intervalAnimationLogo = window.setInterval(() => {
    if (logoTextElement.value !== undefined) {
      const char = logoTextString[i];
      i = (i + 1) % logoTextString.length;
      logoTextElement.value.innerHTML = char;
    }
  }, 1000);
});

onUnmounted(() => {
  clearInterval(intervalAnimationLogo);
});
</script>

<template>
  <div class="Logo">
    <span class="Logo__text" ref="logoTextElement"></span>
    <span class="Logo__text">.</span>
  </div>
</template>

<style scoped lang="scss">
.Logo {
  width: 10rem;
  height: 2rem;

  display: flex;
  align-items: center;
  justify-content: center;

  &__text {
    padding: 0;
    margin: 0;
    font-size: 5rem;
    font-weight: 1000;
    color: #7a7a7a;
  }
}
</style>
