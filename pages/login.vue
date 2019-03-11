<template lang="pug">
  v-container()
    g-title(class="text-xs-center")
    login-form()
</template>
<script>
import LoginForm from '~/components/user/loginForm.vue'

export default {
  middleware: ['notAuthenticated'],
  components: {
    'login-form': LoginForm
  },
  data() {
    return {}
  },
  methods: {}
}
</script>
<style scoped>
</style>
