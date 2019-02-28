<template lang="pug">
  span
    v-hover
      h1(class="display-3"
        slot-scope="{ hover }" :class="`elevation-${hover ? 2 : 0}`")
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

<style scoped>
h1 {
  margin-bottom: 10px;
}
</style>
