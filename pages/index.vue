<template lang="pug">
  v-container()
    g-title(class="text-xs-center")
      div(v-if="!doLogin" class="login")
        n-link(to='/login') ログイン
        | /
        n-link(to='/signup') サインアップ
    div(class="Ad")
    question(:question-date="questionDate")
      div(class="vertical-centering") 今日の問題 その{{ questionId+1 }} 
        span(class="select-question-dialog-btn") 他は→
          v-icon(@click="selectQuestionIdDialog=true") list
      v-dialog(v-model="selectQuestionIdDialog" v-bind="getSelectQuestionIdDialogAttributes")
        v-card
          v-card-title(class="text-xs-center") 問題の選択
          v-card-text()
            v-layout(align-space-around justify-center fill-height class="select-question-id-layout")
              v-flex(v-for="(id, i) in currentQuestionIdList" :key="i")
                v-btn(@click="selectQuestionId(i)" class="question-id-btn")
                  | その{{ i+1 }}
          v-card-actions
              v-btn(@click="selectQuestionIdDialog=false") 戻る
</template>

<script>
import consola from 'consola'
import moment from 'moment'
import QuestionDate from '~/components/question/questionDate'

export default {
  components: {
    question: () => import('~/components/question/question.vue')
  },
  data() {
    return {
      questionDate: new QuestionDate(moment().format('YYYY-MM-DD'), 0),
      questionId: 0,
      questionSum: 3,
      currentQuestionIdList: [],
      selectQuestionIdDialog: false
    }
  },
  computed: {
    doLogin() {
      return !!this.$store.state.user.auth
    },
    getSelectQuestionIdDialogAttributes() {
      let width = '0%'
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          width = '90vw'
          break
        case 'sm':
          width = '80vw'
          break
        default:
          width = '50vw'
          break
      }
      return {
        width: width
      }
    }
  },
  beforeCreate() {
    this.questionDate = new QuestionDate(moment().format('YYYY-MM-DD'), 0)
    this.$store.commit('question/setQuestionDate', {
      date: this.questionDate.date,
      dateId: 0
    })
  },
  async mounted() {
    try {
      const month = moment(this.questionDate.date).format('YYYY-MM')
      const result = await this.$store.dispatch(
        'question/getListInMonth',
        month
      )
      if (result) {
        this.currentQuestionIdList = result[this.questionDate.date]
      }
    } catch (error) {
      consola.error('failed get question datas', error)
    }
  },
  methods: {
    selectQuestionId(id) {
      this.$store.commit('question/setQuestionDate', {
        date: this.questionDate.date,
        dateId: id
      })
      this.questionId = id
      this.selectQuestionIdDialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
$breakpoint-xs: 600px;

/* $break-point以下の時に@contentを適用 */
@mixin max-screen($break-point) {
  @media screen and (max-width: $break-point) {
    @content;
  }
}

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

.select-question-dialog-btn {
  font-size: 12px;
}

.select-question-id-layout {
  flex-direction: row;
  @include max-screen($breakpoint-xs) {
    flex-direction: column;
  }
}

.question-id-btn {
  @include max-screen($breakpoint-xs) {
    width: 100%;
  }
}
</style>
