<template lang="pug">
  v-form(v-model="loginInfo.valid")
    v-container(class="elevation-8")
      v-layout()
        v-flex()
          h2(class="display-1") ログイン
          n-link(to="/signin") ユーザー登録はこちらから
      v-layout(column)
        v-text-field(v-model="loginInfo.email" label="メールアドレス" type="text" :rules="[rules.required, rules.email]")
          template(v-slot:append)
            div(v-if="errorMessage.email" class="error--text") {{ errorMessage.email }}
        v-text-field(v-model="loginInfo.password" label="パスワード" :type="showPassword1 ? 'text' : 'password'"
          :append-icon="showPassword1 ? 'visibility_off' : 'visibility'" @click:append="showPassword1 = !showPassword1"
          :rules="[rules.required]" counter)
          template(v-slot:append)
            div(v-if="errorMessage.password" class="error--text") {{ errorMessage.password }}
        v-flex(class="text-xs-right")
          v-btn(@click="send") ログイン
</template>
<script>
import validator from 'validator'

export default {
  data() {
    return {
      showPassword1: false,
      loginInfo: {
        valid: false,
        email: '',
        password: ''
      },
      rules: {
        required: v => !!v || '入力してください',
        email: v => validator.isEmail(v) || 'メールアドレスを入力してください'
      },
      errorMessage: {}
    }
  },
  methods: {
    async send() {
      const result = await this.$store.dispatch('user/login', this.loginInfo)
      if (!result.isSuccessed) {
        this.errorMessage = result.messages
      }
      alert('please implement')
    }
  }
}
</script>
<style scoped>
</style>
