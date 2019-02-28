<template lang=pug>
  v-container(fluid)
    g-title(class="text-xs-center")
      div(class="login")
        n-link(to='/login') ログイン
        | /
        n-link(to='/signup') サインアップ
    div(class="Ad") 広告スペース
    question(title="今日の問題")
</template>

<script>
export default {
  components: {
    question: () => import('~/components/question/question.vue')
  },
  data() {
    return {}
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
h1 {
  margin: 10px auto;
  .login {
    font-size: 32px;
    text-align: right;
    margin-right: 10%;
  }
}

.Ad {
}
</style>
