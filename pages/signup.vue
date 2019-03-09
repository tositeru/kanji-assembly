<template lang="pug">
  v-container()
    g-title(class="text-xs-center")
    signup-form()
</template>
<script>
import SignupForm from '~/components/user/signupForm'

export default {
  components: {
    'signup-form': SignupForm
  },
  data() {
    return {}
  },
  computed: {},
  methods: {}
}
</script>
<style scoped>
</style>
