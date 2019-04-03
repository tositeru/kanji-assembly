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
          append-icon='list'
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
        :allowed-dates='setQuestionDates'
      )
        v-spacer()
        v-btn(flat color="primary" @click="menu = false") Cancel
    v-dialog(v-model="selectQuestionIdDialog" v-bind="getSelectQuestionIdDialogAttributes")
      v-card
        v-card-title(class="text-xs-center") 問題の選択
        v-card-text()
          v-layout(align-space-around justify-center fill-height class="select-question-id-layout")
            v-flex(v-for="(id, i) in currentQuestionIdList" :key="i")
              v-btn(@click="nextQuestionSelectFlow(i)" class="question-id-btn")
                | その{{ i+1 }}
        v-card-actions
            v-btn(@click="closeQuestionList()") 戻る
    v-dialog(v-model="notifyNoneQuestionDialog" persistent min-width="50%")
      v-card
        v-card-text(class="text-xs-center")
          | その日に問題はありません。
        v-card-actions
            v-btn(@click="cancelToSelectQuestion()") 戻る
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
  This.prevDate = This.currentDate
  This.cancelToSelectQuestion()
}

const currentMoment = moment().format('YYYY-MM-DD')
export default {
  data() {
    return {
      menu: null,
      selectQuestionIdDialog: false,
      currentDate: currentMoment,
      prevDate: currentMoment,
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
    const result = await this.$store.dispatch('question/getListInMonth', month)
    if (result) {
      this.questionList = result
      this.questionList[month] = true
    }
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
      this.notifyNoneQuestionDialog = false
      this.questionSelectFlow = null
    },
    cancelToSelectQuestion() {
      this.menu = false
      this.currentDate = this.prevDate
      this.closeQuestionList()
    },

    markColorOfDays(date) {
      const idList = this.questionList[date]
      if (!idList) {
        return false
      } else {
        return ['red']
      }
    },
    async setQuestionDates(date) {
      const day = date.split('-')[2]
      if (day === '01') {
        // データがなかったら、サーバーに問い合わせる。
        // 選択している月が変更されたときのイベントが取得できなかったので、余分に前後の月のデータを取得している
        // Vuetifyにちょうどよいイベントがなかったので、ここで行っている
        // 既に読み込んでいたら読み込まないようにキャッシュしている。
        try {
          const prevMonth = moment(date)
            .subtract(1, 'months')
            .format('YYYY-MM')
          if (!this.questionList[prevMonth]) {
            const resultPrev = await this.$store.dispatch(
              'question/getListInMonth',
              prevMonth
            )
            Object.assign(this.questionList, resultPrev)
            this.questionList[prevMonth] = true
          }

          const nextMonth = moment(date)
            .add(1, 'months')
            .format('YYYY-MM')
          if (!this.questionList[nextMonth]) {
            const resultNext = await this.$store.dispatch(
              'question/getListInMonth',
              nextMonth
            )
            Object.assign(this.questionList, resultNext)
            this.questionList[nextMonth] = true
          }

          return !!this.questionList[date]
        } catch (error) {
          return false
        }
      }
      return true
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
