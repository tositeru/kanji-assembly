<template lang="pug">
  div
    div(v-if="isSuccessed")
      v-card()
        v-card-title(class="success success--text text--lighten-4 display-1 text-xs-center") 仮登録完了
        v-card-text()
          | {{ this.successedMessage }}
    v-form(v-else v-model="signupInfo.valid")
      v-container(class="elevation-8")
        v-layout()
          v-flex()
            h2(class="display-1") ユーザー登録
        v-layout(column)
          v-text-field(v-model="signupInfo.name" label="名前" type="text" :rules="[rules.required]" :loading="doCheckingName" @change='changeName' append-icon='check_circle')
            template(v-slot:append)
              div(v-if="errorMessage.name" class="error--text") {{ errorMessage.name }}
          v-text-field(v-model="signupInfo.email" label="メール" type="text" :rules="[rules.required, rules.email]" :loading="doCheckingEmail" @change='changeEmail' append-icon='check_circle')
            template(v-slot:append)
              div(v-if="errorMessage.email" class="error--text") {{ errorMessage.email }}
          v-text-field(v-model="signupInfo.password" label="パスワード" :type="showPassword1 ? 'text' : 'password'"
            :append-icon="showPassword1 ? 'visibility_off' : 'visibility'" @click:append="showPassword1 = !showPassword1"
            :rules="[rules.required, rules.min]" counter loading)
            template(v-slot:progress)
              v-progress-linear(:value="progressPassword" :color="passwordColor" height="7")
            template(v-slot:append)
              div(v-if="errorMessage.password" class="error--text") {{ errorMessage.password }}
          v-text-field(v-model="signupInfo.confirmPassword" label="パスワード(確認用)" :type="showPassword2 ? 'text' : 'password'"
            :append-icon="showPassword2 ? 'visibility_off' : 'visibility'" @click:append="showPassword2 = !showPassword2"
            :rules="[rules.required, rules.matchPassword]" counter)
          v-flex(class="text-xs-right")
            v-btn(@click="send") 登録
</template>

<script>
import validator from 'validator'
import consola from 'consola'
import axios from 'axios'

const SUCCESSED_MESSAGE =
  'ユーザー登録に成功しました。' +
  '登録したメールアドレスに認証用のメールが送信されますので、そちらをご確認してください。'

const MIN_PASSWORD_LENGTH = 8
export default {
  data: function() {
    return {
      isSuccessed: false,
      successedMessage: SUCCESSED_MESSAGE,
      showPassword1: false,
      showPassword2: false,
      doCheckingName: false,
      doCheckingEmail: false,
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
          this.signupInfo.password === v || 'パスワードが一致しません',
        usableName: v =>
          this.isUsableName || '同じ名前のユーザーが存在しています'
      },
      errorMessage: {}
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
        this.isSuccessed = result.isSuccessed
        if (!result.isSuccessed) {
          this.errorMessage = result.messages
        }
      } catch (err) {
        consola.error('signup error', err)
      }
    },
    async changeName() {
      this.doCheckingName = true
      this.errorMessage.name = (await checkUserParam(
        'name',
        this.signupInfo.name
      ))
        ? null
        : '同じ名前のユーザーが存在しています'
      this.doCheckingName = false
    },
    async changeEmail() {
      this.doCheckingEmail = true
      this.errorMessage.email = (await checkUserParam(
        'email',
        this.signupInfo.email
      ))
        ? null
        : '同じメールアドレスのユーザーが存在しています'
      this.doCheckingEmail = false
    }
  }
}
async function checkUserParam(key, param) {
  try {
    const params = {}
    params[key] = param
    const res = await axios.get('/user/check', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      params: params
    })
    return res.data.status[key]
  } catch (err) {
    alert(err)
  }
  this.doCheckingEmail = false
}
</script>
<style scoped>
</style>