<template lang="pug">
  v-container()
    g-title(class="text-xs-center")
      div(v-if="!doLogin" class="login")
        n-link(to='/login') ログイン
        | /
        n-link(to='/signup') サインアップ
    div(class="Ad") 広告スペース
    question(:question-date="questionDate")
      div(class="vertical-centering") 今日の問題
</template>

<script>
import moment from 'moment'
import QuestionDate from '~/components/question/questionDate'

export default {
  components: {
    question: () => import('~/components/question/question.vue')
  },
  data() {
    return {
      questionDate: new QuestionDate(moment().format('YYYY-MM-DD'), 0)
    }
  },
  computed: {
    doLogin() {
      return !!this.$store.state.user.auth
    }
  },
  beforeCreate() {
    this.questionDate = new QuestionDate(moment().format('YYYY-MM-DD'), 0)
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
.vertical-centering {
  margin: auto auto;
}

.Ad {
}
</style>
