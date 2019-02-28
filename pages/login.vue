<template lang="pug">
  section()
    h1(class="display-4 text-xs-center" @click="goToTopPage()") 漢字組み立てパズル
    v-form(v-model="loginInfo.valid")
      v-container(class="elevation-8")
        v-layout()
          v-flex()
            h2(class="display-1") ログイン
            n-link(to="/signin") ユーザー登録はこちらから
        v-layout(column)
          v-text-field(v-model="loginInfo.name" label="名前" type="text" :rules="[rules.required]")
          v-text-field(v-model="loginInfo.password" label="パスワード" :type="showPassword1 ? 'text' : 'password'"
            :append-icon="showPassword1 ? 'visibility_off' : 'visibility'" @click:append="showPassword1 = !showPassword1"
            :rules="[rules.required, rules.min]" counter)
          v-flex(class="text-xs-right")
            v-btn(@click="send") ログイン
</template>
<script>
export default {
  data() {
    return {
      showPassword1: false,
      loginInfo: {
        valid: false,
        name: '',
        password: ''
      },
      rules: {
        required: v => !!v || '入力してください',
        min: v => v.length > 8 || '8文字以上にしてください'
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
