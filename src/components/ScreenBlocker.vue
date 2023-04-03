<script setup lang="ts">
const emits = defineEmits<{
  (e: "click"): void;
}>();

function handleClick() {
  emits("click");
}
</script>

<template>
  <div class="ScreenBlocker" @click="handleClick" @touchend="handleClick"></div>
</template>

<style scoped lang="scss">
.ScreenBlocker {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
</style>
