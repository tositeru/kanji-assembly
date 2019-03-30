<template lang="pug">
  span
    v-hover
      h1(slot-scope="{ hover }" :class="`elevation-${hover ? 2 : 0}`")
        span(@click="goToTopPage()") 漢字組み立てパズル
    slot
</template>
<script>
export default {
  methods: {
    goToTopPage() {
      this.$router.push('/')
    }
  }
}
</script>

<style lang="scss"scoped>
$breakpoint-xs: 600px;

/* $break-point以下の時に@contentを適用 */
@mixin max-screen($break-point) {
  @media screen and (max-width: $break-point) {
    @content;
  }
}

h1 {
  margin-bottom: 10px;
  font-size: 56px;

  @include max-screen($breakpoint-xs) {
    font-size: 32px;
    font-weight: 700;
  }
}
</style>
