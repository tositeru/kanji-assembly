<template lang="pug">
  v-container()
    g-title(class="text-xs-center")
    profile()
</template>

<script>
import Profile from '~/components/user/profile.vue'

export default {
  middleware: ['authenticated'],
  components: {
    profile: Profile
  },
  data() {
    return {}
  }
}
</script>

<style scoped>
</style>
