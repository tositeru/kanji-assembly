<template lang="pug">
  v-layout()
    v-menu(ref='menu' v-model="menu"
      :close-on-content-click="false"
      lazy
      transition="scale-transition"
      offset-y
    )
      template(v-slot:activator="{ on }")
        v-text-field(
          v-model="currentDate"
          :label="`選択中の問題 ${selectQuestionName}`"
          prepend-icon="event"
          append-icon='event'
          @click:append="startQuestionSelectFlow(currentDate)"
          readonly
          max-width="50px"
          v-on="on")
      v-date-picker(
        v-model="currentDate"
        no-title scrollable
        locale="ja"
        @input='startQuestionSelectFlow($event)'
        event-color="green lighten-1"
        :events="markColorOfDays"
      )
        v-spacer()
        v-btn(flat color="primary" @click="menu = false") Cancel
    v-dialog(v-model="selectQuestionIdDialog" width="50%")
      v-card
        v-card-title(class="text-xs-center") 問題の選択
        v-card-text()
          v-layout(justify-space-around)
            v-btn(v-for="(id, i) in currentQuestionIdList" :key="i" @click="nextQuestionSelectFlow(i)")
              | その{{ i+1 }}
        v-card-actions
            v-btn(@click="closeQuestionList()") 戻る
      v-dialog(v-model="notifyNoneQuestionDialog" width="50%")
        v-card
          v-card-text(class="text-xs-center")
            | その日に問題はありません。
</template>
<script>
import moment from 'moment'

/**
 * 問題選択用のコルーチン
 * date-pickerまたは日にちを渡すことから始める
 * キャンセル処理は他で用意している
 *
 * @param This Vueインスタンス
 * @param initialDate 選択対象となる日にち
 */
function* generateQuestionSelectFlow(This, initialDate) {
  // 渡された日にちに問題があるかチェック
  const questions = This.questionList[initialDate]
  if (!questions) {
    This.notifyNoneQuestionDialog = true
    return
  }
  // 日にちの設定
  // キャンセルしたときのための処理も含む
  This.currentQuestionIdList = questions
  This.selectQuestionIdDialog = true
  This.prevDate = This.currentDate
  This.currentDate = initialDate

  // 指定した日にちの問題IDを取得
  const indexInDay = yield
  This.selectQuestionId = This.currentQuestionIdList[indexInDay]

  // 変更があったことだけを告げる
  This.$store.commit('question/setQuestionDate', {
    date: This.currentDate,
    dateId: indexInDay
  })

  // 終了処理
  This.prevDate = null
  This.cancelToSelectQuestion()
}

export default {
  data() {
    return {
      menu: null,
      selectQuestionIdDialog: false,
      currentDate: '2019-03-01',
      prevDate: null,
      selectQuestionId: 1,
      currentQuestionIdList: [],
      questionList: {},
      notifyNoneQuestionDialog: false,
      questionSelectFlow: null
    }
  },
  computed: {
    selectQuestionName() {
      return `その${this.selectQuestionId + 1}`
    }
  },
  watch: {
    menu: function(val) {
      if (!val) {
        this.cancelToSelectQuestion()
      }
    },
    selectQuestionIdDialog: function(val) {
      if (!val) {
        this.closeQuestionList()
      }
    }
  },
  async mounted() {
    this.currentDate = this.$store.state.question.currentDate.date
    if (!this.currentDate) {
      this.currentDate = moment().format('YYYY-MM-DD')
      this.$store.commit('question/setQuestionDate', {
        date: moment().format('YYYY-MM-DD'),
        dateId: 0
      })
    }
    const month = moment(this.currentDate).format('YYYY-MM')
    this.questionList = await this.$store.dispatch(
      'question/getListInMonth',
      month
    )
  },
  methods: {
    startQuestionSelectFlow(initialDate) {
      this.questionSelectFlow = generateQuestionSelectFlow(this, initialDate)
      this.questionSelectFlow.next()
    },
    nextQuestionSelectFlow(value) {
      this.questionSelectFlow.next(value)
    },

    closeQuestionList() {
      this.selectQuestionIdDialog = false
      this.questionSelectFlow = null
    },
    cancelToSelectQuestion() {
      this.menu = false
      if (this.prevDate) {
        this.currentDate = this.prevDate
      }
      this.prevDate = null
      this.closeQuestionList()
    },

    markColorOfDays(date) {
      const idList = this.questionList[date]
      if (!idList) {
        return false
      } else {
        return ['red']
      }
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
