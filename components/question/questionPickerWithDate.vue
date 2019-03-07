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
          @click:append="openQuestionList(currentDate)"
          readonly
          max-width="50px"
          v-on="on")
      v-date-picker(
        v-model="currentDate"
        no-title scrollable
        locale="ja"
        @input='openQuestionList($event)'
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
            v-btn(v-for="(id, i) in currentQuestionIdList" :key="i" @click="selectQuestion(i)")
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
 * 問題選択の関数の流れのメモ
 *  1. 日付ボタンをクリック  -> v-date-pickerが開く
 *  2. 日付を選択          -> openQuestionList()を呼び出す
 *  3. その日の問題を選択    -> selectQuestion()内でサーバーに選択した問題をリクエストする
 *  cancel.1   その日の問題ダイアログをキャンセル -> closeQuestionList()
 *  cancel.all 選択中止 -> cancelToSelectQuestion()
 *  日付の右側にあるアイコンをクリックすると 3.その日の問題を選択 を開始する
 */

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
      notifyNoneQuestionDialog: false
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
    openQuestionList(selectDate) {
      const questions = this.questionList[selectDate]
      if (!questions) {
        this.notifyNoneQuestionDialog = true
        return
      }

      this.currentQuestionIdList = questions
      this.selectQuestionIdDialog = true
      this.prevDate = this.currentDate
      this.currentDate = selectDate
    },
    selectQuestion(indexInDay) {
      this.selectQuestionId = this.currentQuestionIdList[indexInDay]
      // 変更があったことだけを告げる
      this.$store.commit('question/setQuestionDate', {
        date: this.currentDate,
        dateId: indexInDay
      })
      this.prevDate = null
      this.cancelToSelectQuestion()
    },
    closeQuestionList() {
      this.selectQuestionIdDialog = false
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
