<template lang=pug>
  section()
    h1 漢字組み立てパズル
      div(class="login") ログイン/サインイン
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
  margin: 0px auto;
  font-size: 72px;
  text-align: center;
  .login {
    font-size: 32px;
    text-align: right;
    margin-right: 10%;
  }
}

.Ad {
}
</style>
