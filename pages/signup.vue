<template lang="pug">
  v-container()
    g-title(class="text-xs-center")
    v-form(v-model="signupInfo.valid")
      v-container(class="elevation-8")
        v-layout()
          v-flex()
            h2(class="display-1") ユーザー登録
        v-layout(column)
          v-card
          v-text-field(v-model="signupInfo.name" label="名前" type="text" :rules="[rules.required]")
          v-text-field(v-model="signupInfo.email" label="メール" type="text" :rules="[rules.required, rules.email]")
          v-text-field(v-model="signupInfo.password" label="パスワード" :type="showPassword1 ? 'text' : 'password'"
            :append-icon="showPassword1 ? 'visibility_off' : 'visibility'" @click:append="showPassword1 = !showPassword1"
            :rules="[rules.required, rules.min]" counter loading)
            template(v-slot:progress)
              v-progress-linear(:value="progressPassword" :color="passwordColor" height="7")
          v-text-field(v-model="signupInfo.confirmPassword" label="パスワード(確認用)" :type="showPassword2 ? 'text' : 'password'"
            :append-icon="showPassword2 ? 'visibility_off' : 'visibility'" @click:append="showPassword2 = !showPassword2"
            :rules="[rules.required, rules.matchPassword]" counter)
          v-flex(class="text-xs-right")
            v-btn(@click="send") 登録
</template>
<script>
import validator from 'validator'
import consola from 'consola'

const MIN_PASSWORD_LENGTH = 8
export default {
  data() {
    return {
      showPassword1: false,
      showPassword2: false,
      signupInfo: {
        valid: false,
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
      rules: {
        required: v => !!v || '入力してください',
        email: v => validator.isEmail(v) || 'メールアドレスを入力してください',
        min: v =>
          v.length >= MIN_PASSWORD_LENGTH ||
          `${MIN_PASSWORD_LENGTH}文字以上にしてください`,
        matchPassword: v =>
          this.signupInfo.password === v || 'パスワードが一致しません'
      }
    }
  },
  computed: {
    progressPassword() {
      return Math.min(
        100,
        (this.signupInfo.password.length * 100.0) / MIN_PASSWORD_LENGTH
      )
    },
    passwordColor() {
      const messages = ['error', 'warning', 'success']
      return messages[Math.floor(this.progressPassword / 50)]
    }
  },
  methods: {
    async send() {
      try {
        const result = await this.$store.dispatch(
          'user/signup',
          this.signupInfo
        )
        consola.log(result)
      } catch (err) {
        consola.error('signup error', err)
      }
    }
  }
}
</script>
<style scoped>
</style>
