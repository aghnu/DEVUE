<template>
  <footer class="AppFooter">
    <p class="AppFooter__text">© 2022 AGHNU.ME</p>
  </footer>
</template>

<style scoped lang="scss">
.AppFooter {
  @include mixin-center-children;

  height: 100%;
  widows: 100%;
  &__text {
    color: $color-text-footer;
    font-weight: 300;
    font-size: 0.75rem;
    letter-spacing: 0.65rem;
    white-space: nowrap;
    margin-bottom: 0.75rem;
  }
}
</style>
