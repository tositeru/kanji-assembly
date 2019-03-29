<template lang="pug">
  v-container()
    g-title(class="text-xs-center")
    div(v-if="afterSend")
      v-card()
        v-card-title(class="success success--text text--lighten-4 display-1 text-xs-center") パスワード再設定用メール送信完了
        v-card-text()
          | パスワード再設定用メールを送信しました。送信されたメールに記載されているURLからパスワードの再設定を行ってください。
    v-form(v-else)
      v-container(class="elevation-8")
        v-layout()
          v-flex()
            h2(class="display-1") パスワード再設定
        v-layout(column)
          v-text-field(v-model="email" label="メールアドレス" type="text" :rules="[rules.required, rules.email]")
          v-flex(v-if="errorMessage")
            div(class="error error--text text--lighten-4 display-1 text-xs-center") {{ errorMessage }}
          v-flex(class="text-xs-right")
            v-btn(@click="send") 再設定用メール送信
</template>
<script>
import validator from 'validator'

export default {
  middleware: ['notAuthenticated'],
  data() {
    return {
      afterSend: false,
      email: '',
      rules: {
        required: v => !!v || '入力してください',
        email: v => validator.isEmail(v) || 'メールアドレスを入力してください'
      },
      errorMessage: ''
    }
  },
  methods: {
    async send() {
      this.errorMessage = ''
      const result = await this.$store.dispatch(
        'user/requestResetPassword',
        this.email
      )
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
