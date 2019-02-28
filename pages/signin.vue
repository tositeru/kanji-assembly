<template lang="pug">
  section()
    h1(class="display-4 text-xs-center" @click="goToTopPage()") 漢字組み立てパズル
    v-form(v-model="loginInfo.valid")
      v-container(class="elevation-8")
        v-layout()
          v-flex()
            h2(class="display-1") ユーザー登録
        v-layout(column)
          v-card
          v-text-field(v-model="loginInfo.name" label="名前" type="text" :rules="[rules.required]")
          v-text-field(v-model="loginInfo.password" label="パスワード" :type="showPassword1 ? 'text' : 'password'"
            :append-icon="showPassword1 ? 'visibility_off' : 'visibility'" @click:append="showPassword1 = !showPassword1"
            :rules="[rules.required, rules.min]" counter)
          v-text-field(v-model="loginInfo.confirmPassword" label="パスワード(確認用)" :type="showPassword2 ? 'text' : 'password'"
            :append-icon="showPassword2 ? 'visibility_off' : 'visibility'" @click:append="showPassword2 = !showPassword2"
            :rules="[rules.required, rules.min, rules.matchPassword]" counter)
          v-flex(class="text-xs-right")
            v-btn(@click="send") 登録
</template>
<script>
export default {
  data() {
    return {
      showPassword1: false,
      showPassword2: false,
      loginInfo: {
        valid: false,
        name: '',
        password: '',
        confirmPassword: ''
      },
      rules: {
        required: v => !!v || '入力してください',
        min: v => v.length > 8 || '8文字以上にしてください',
        matchPassword: v =>
          this.loginInfo.password === v || 'パスワードが一致しません'
      }
    }
  },
  methods: {
    send() {
      alert('please implement')
    },
    goToTopPage() {
      this.$router.push('/')
    }
  }
}
</script>
<style scoped>
</style>
