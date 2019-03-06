<template lang="pug">
  v-container()
    g-title(class="text-xs-center")
    v-layout(justify-center)
      v-flex()
        h2(class="display-3 text-xs-center") 問題一覧
    question()
      template()
        questionPickerWithDate()
    //- v-scroll-x-transition(mode="out-in")
    //-   component(:is="currentCondition" @change-status="changeStatus($event)")
</template>
<script>
import Question from '~/components/question/question.vue'
import questionPickerWithDate from '~/components/question/questionPickerWithDate.vue'

export default {
  components: {
    question: Question,
    questionPickerWithDate: questionPickerWithDate
  },
  data() {
    return {}
  },
  computed: {},
  methods: {}
}
</script>
<style lang="scss"scoped>
</style>
