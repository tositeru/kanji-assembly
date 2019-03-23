<template lang="pug">
  v-container()
    g-title(class="text-xs-center")
    user-profile()
</template>

<script>
import Profile from '~/components/user/profile.vue'

export default {
  middleware: ['authenticated'],
  components: {
    'user-profile': Profile
  },
  data() {
    return {}
  }
}
</script>

<style scoped>
</style>
