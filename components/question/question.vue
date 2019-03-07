<template lang="pug">
  v-container(class="today-question elevation-4")
    div(class="title elevation-1")
      slot()
    v-scroll-x-transition(mode="out-in")
      component(:is="currentCondition" @change-status="changeStatus($event)")
</template>

<script>
import { STATUS } from './common'
import QuestionDate from './questionDate'

export default {
  components: {
    unknown: () => import('./unknown.vue'),
    loading: () => import('./loading.vue'),
    'main-form': () => import('./mainForm.vue'),
    juding: () => import('./judging.vue'),
    result: () => import('./result.vue'),
    hint: () => import('./hint.vue')
  },
  props: {
    questionDate: QuestionDate
  },
  data() {
    return {
      status: STATUS.LOADING,
      unwatchQuestionDate: null
    }
  },
  computed: {
    currentCondition() {
      if (STATUS.validateStatus(this.status)) {
        return this.status
      } else {
        return STATUS.UNKNOWN
      }
    }
  },
  watch: {
    questionDate: function(newDate, oldDate) {
      this.status = STATUS.LOADING
    }
  },
  mounted() {
    // 初期の問題の日時の設定
    this.$store.commit('question/setQuestionDate', {
      date: this.questionDate.date,
      dateId: 0
    })
    this.unwatchQuestionDate = this.$store.watch(
      (state, getter) => {
        return state.question.currentDateUpdateNotifier
      },
      (newDate, old) => {
        this.status = STATUS.LOADING
      }
    )
  },
  destroyed() {
    if (this.unwatchQuestionDate) {
      this.unwatchQuestionDate()
    }
  },
  methods: {
    changeStatus(nextStatus) {
      this.status = nextStatus
    }
  }
}
</script>

<style lang="scss" scoped>
.today-question {
  margin: 13px auto;

  .title {
    font-size: 32px;
    background: white;

    height: 40px;

    display: table;
    margin: -30px auto auto 10px;
    padding-top: 10px;
    padding-left: 10px;
    padding-right: 10px;
  }
}
</style>
