<template lang="pug">
  v-container()
    g-title(class="text-xs-center")
    v-layout(justify-center)
      v-flex()
        h2(class="display-3 text-xs-center") 問題一覧
    question(:question-date="questionDate")
      template()
        questionPickerWithDate()
    //- v-scroll-x-transition(mode="out-in")
    //-   component(:is="currentCondition" @change-status="changeStatus($event)")
</template>
<script>
import moment from 'moment'
import QuestionDate from '~/components/question/questionDate'
import Question from '~/components/question/question.vue'
import questionPickerWithDate from '~/components/question/questionPickerWithDate.vue'

export default {
  components: {
    question: Question,
    questionPickerWithDate: questionPickerWithDate
  },
  data() {
    return {
      questionDate: new QuestionDate(moment().format('YYYY-MM-DD'), 0)
    }
  },
  computed: {},
  methods: {}
}
</script>
<style lang="scss"scoped>
</style>
