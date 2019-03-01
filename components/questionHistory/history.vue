<template lang="pug">
  v-container()
    v-layout(row justify-end)
      v-btn(@click="$emit('change-status', 'selectedQuestion')") 戻る
    v-layout()
      v-flex()
        p(class="text-xs-center display-2") {{ selectedDate.year }}年
        | {{ selectedDate.date + '-' + selectItem }}
    div(class="elevation-9")
      v-layout()
        v-flex()
          v-sheet(height="500" class="elevation-1")
            v-calendar(
              ref="calendar"
              v-model="start"
              type="month"
              :end="end"
              color="primary"
              @click:date="changeDate($event)"
              @click:day="changeDate($event)")
              template(v-slot:day="{ date }")
                v-layout(v-if="selectedDate.isSame(date)" justify-center)
                  div(class="check-mark")
                      v-icon(center color="red") check_circle
            v-dialog(v-model="doShowDialog" width="500px")
              v-card
                v-card-title(class="text-xs-center") 問題の選択
                v-card-text()
                  v-btn(v-for="(name, i) in items" :key="i" @click="selectQuestion(name)")
                    | {{ name }}
                v-card-actions
                    v-btn(@click="doShowDialog=false") 戻る
      v-layout(align-center justify-center row)
        v-btn(@click="$refs.calendar.prev()")
          v-icon(dark left) keyboard_arrow_left
          | 前の月
        v-spacer
        v-btn(@click="$refs.calendar.next()")
          | 次の月
          v-icon(dark left) keyboard_arrow_right
</template>
<script>
class MyDate {
  constructor(dateString) {
    this.set(dateString)
  }
  get date() {
    return this._date
  }
  get year() {
    return this._year
  }
  get month() {
    return this._month
  }
  get day() {
    return this._day
  }
  set(dateString) {
    const d = dateString.split('-')
    this._date = dateString
    this._year = parseInt(d[0])
    this._month = parseInt(d[1])
    this._day = parseInt(d[2])
  }
  isSame(dateString) {
    return this._date === dateString
  }
}

export default {
  data() {
    return {
      start: '2019-03-01',
      end: '2020-03-31',
      selectedDate: new MyDate('2019-03-01'),
      doShowDialog: false,
      selectItem: '普通',
      items: ['簡単', '普通', '難問']
    }
  },
  methods: {
    changeDate(e) {
      this.selectedDate.set(e.date)
      this.doShowDialog = true
    },
    selectQuestion(name) {
      this.selectItem = name
      this.doShowDialog = false
      this.$emit('change-status', 'selectedQuestion')
    }
  }
}
</script>
<style lang="scss" scoped>
.check-mark {
  i {
    font-size: 45px;
  }
}
</style>
