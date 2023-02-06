<template>
  <footer class="AppFooter">
    <p class="AppFooter__text">© 2022 Gengyuan Huang</p>
  </footer>
</template>

<style scoped lang="scss">
.AppFooter {
  @include mixin-center-children;

  height: 100%;
  widows: 100%;
  &__text {
    color: $color-text-dark;
    font-weight: 300;
    font-size: 0.8rem;
    letter-spacing: 0.15rem;
    white-space: nowrap;
    margin-bottom: 1rem;
  }
}
</style>
