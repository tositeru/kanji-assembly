<template lang="pug">
  v-container()
    g-title(class="text-xs-center")
    div(v-if="afterSend")
      v-card()
        v-card-title(class="success success--text text--lighten-4 display-1 text-xs-center") パスワード再設定用メール送信完了
        v-card-text()
          | パスワードを再設定しました。
          nuxt-link(to="/login") ログイン画面からログインしてください。
    v-form(v-else)
      v-container(class="elevation-8")
        v-layout()
          v-flex()
            h2(class="display-1") パスワード再設定
        v-layout(column)
          v-text-field(v-model="password" label="パスワード" :type="showPassword1 ? 'text' : 'password'"
            :append-icon="showPassword1 ? 'visibility_off' : 'visibility'" @click:append="showPassword1 = !showPassword1"
            :rules="[rules.required, rules.min]" counter loading)
            template(v-slot:progress)
              v-progress-linear(:value="progressPassword" :color="passwordColor" height="7")
            template(v-slot:append)
              div(v-if="errorMessage.password" class="error--text") {{ errorMessage.password }}
          v-text-field(v-model="confirmPassword" label="パスワード(確認用)" :type="showPassword2 ? 'text' : 'password'"
            :append-icon="showPassword2 ? 'visibility_off' : 'visibility'" @click:append="showPassword2 = !showPassword2"
            :rules="[rules.required, rules.matchPassword]" counter)
          v-flex(v-if="errorMessage")
            div(class="error error--text text--lighten-4 display-1 text-xs-center") {{ errorMessage }}
          v-flex(class="text-xs-right")
            v-btn(@click="send") 再設定用メール送信
</template>
<script>
const MIN_PASSWORD_LENGTH = 8
export default {
  middleware: ['notAuthenticated'],
  data() {
    return {
      afterSend: false,
      email: '',
      showPassword1: false,
      showPassword2: false,
      password: '',
      confirmPassword: '',
      rules: {
        required: v => !!v || '入力してください',
        min: v =>
          v.length >= MIN_PASSWORD_LENGTH ||
          `${MIN_PASSWORD_LENGTH}文字以上にしてください`,
        matchPassword: v => this.password === v || 'パスワードが一致しません'
      },
      errorMessage: ''
    }
  },
  computed: {
    progressPassword() {
      return Math.min(100, (this.password.length * 100.0) / MIN_PASSWORD_LENGTH)
    },
    passwordColor() {
      const messages = ['error', 'warning', 'success']
      return messages[Math.floor(this.progressPassword / 50)]
    }
  },
  methods: {
    async send() {
      this.errorMessage = ''
      const param = {
        token: this.$route.params.token,
        password: this.password
      }
      const result = await this.$store.dispatch('user/resetPassword', param)
      if (!result.isSuccessed) {
        this.errorMessage = result.message
        return
      }
      this.afterSend = true
    }
  }
}
</script>
<style scoped>
</style>
