<template>
  <footer class="AppFooter">
    <p class="AppFooter__text">© 2023 GENGYUAN HUANG</p>
  </footer>
</template>

<style scoped lang="scss">
.AppFooter {
  @include mixin-center-children;

  height: 0;
  width: 100%;

  &__text {
    letter-spacing: 0.85em;
    font-size: 0.65rem;
    pointer-events: none;
    white-space: nowrap;
    color: transparent;
  }
}
</style>
