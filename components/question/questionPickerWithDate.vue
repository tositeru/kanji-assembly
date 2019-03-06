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
          :label="`選択中の問題 ${selectItem}`"
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
        :events="markColorOfDays"
      )
        v-spacer()
        v-btn(flat color="primary" @click="menu = false") Cancel
    v-dialog(v-model="selectQuestionIdDialog" width="500px")
      v-card
        v-card-title(class="text-xs-center") 問題の選択
        v-card-text()
          v-btn(v-for="(name, i) in items" :key="i" @click="selectQuestion(i)")
            | {{ name }}
        v-card-actions
            v-btn(@click="closeQuestionList()") 戻る
</template>
<script>
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
      selectItem: '普通',
      items: ['簡単', '普通', '難問']
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
  mounted() {},
  methods: {
    openQuestionList(selectDate) {
      alert('問題がなかったら何もしないようにする')
      this.selectQuestionIdDialog = true
      this.prevDate = this.currentDate
      this.currentDate = selectDate
    },
    selectQuestion(indexInDay) {
      this.selectItem = this.items[indexInDay]
      alert(
        `選択した日付とIDの問題をサーバーに要求する.\n ${this.currentDate} ${
          this.selectItem
        }`
      )
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
      // TODO サーバーから問題がある日を取得する。
      // 画面を読み込んだ時に通信する？
      const [, , day] = date.split('-')
      if ([12, 23, 26].includes(parseInt(day, 10))) return ['red']
      return false
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
