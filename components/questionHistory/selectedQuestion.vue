<template lang="pug">
  span
    v-layout(row justify-end)
      v-btn(@click="openQuestionHistory()") 問題を選択
    v-layout()
      question()
</template>
<script>
import Question from '~/components/question/question.vue'

export default {
  components: {
    question: Question
  },
  data() {
    return {}
  },
  methods: {
    openQuestionHistory() {
      this.$emit('change-status', 'history')
    }
  }
}
</script>
<style lang="scss"scoped>
</style>
