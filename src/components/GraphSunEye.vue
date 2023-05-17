<script setup lang="ts">
import { gsap } from "gsap";
import { getShapeSun } from "../utilities/factorySVG";
import { onMounted, onUnmounted, ref } from "vue";

const graphSvg = getShapeSun({
  size: "100%",
  color: "var(--color-block-bright)",
});
let sunGraphAnimationinterval: undefined | number;
const graphElement = ref<HTMLDivElement>();
function startSunGraphAnimation() {
  const makeBeamBlink = (beams: NodeListOf<Element>) => {
    if (beams.length === 0) return;
    const beamSelected = beams[
      Math.floor(Math.random() * beams.length)
    ] as HTMLElement;

    const opacity = Math.floor(Math.random() * 2);
    gsap.to(beamSelected, {
      opacity: opacity,
      duration: Math.random() * 1 + 1,
      ease: "power1",
      overwrite: "auto",
      onComplete: () => {
        gsap.to(beamSelected, {
          opacity: 1 - opacity,
          duration: 1,
          ease: "power1",
          overwrite: "auto",
        });
      },
    });
  };

  const moveEye = (eye: Element | null) => {
    if (eye === null) return;
    if (Math.random() <= 0.6) return;

    gsap.to(eye, {
      transform: `translate(
        ${Math.random() * 15 - 7.5}px, 
        ${Math.random() * 8 - 4}px)`,
      duration: Math.random() * 0.35 + 0.05,
      ease: "power1",
      overwrite: "auto",
    });
  };

  if (graphElement.value) {
    const beams = graphElement.value.querySelectorAll(".beam");
    const eye = graphElement.value.querySelector(".eye");
    window.clearInterval(sunGraphAnimationinterval);
    sunGraphAnimationinterval = window.setInterval(() => {
      makeBeamBlink(beams);
      moveEye(eye);
    }, 750);
    makeBeamBlink(beams);
    moveEye(eye);
  }
}
function stopSunGraphAnimation() {
  window.clearInterval(sunGraphAnimationinterval);
}

onMounted(() => {
  startSunGraphAnimation();
});

onUnmounted(() => {
  stopSunGraphAnimation();
});
</script>

<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div ref="graphElement" class="GraphSunEye" v-html="graphSvg"></div>
</template>

<style scoped lang="scss">
.GraphSunEye {
  height: 100%;
  width: 100%;
}
</style>
