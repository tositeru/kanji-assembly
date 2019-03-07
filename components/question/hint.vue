<template lang="pug">
  sub
    v-layout(row reverse)
      v-btn(@click="backToQuestion()") 戻る
    v-sheet(color="grey lighten-3" height="50vh")
      v-layout(align-center justify-center row fill-height)
        v-flex(v-for="(hint, i) in hints" :key="i" class="text-xs-center")
          div(v-if="hint.opened")
            | {{hint.text}}
          div(v-else)
            v-btn(@click="openHint(i)") 助言{{i+1}}を見る
</template>

<script>
import { STATUS } from './common.js'

export default {
  data() {
    return {}
  },
  computed: {
    hints() {
      return this.$store.state.question.currentQuestion.hints
    }
  },
  methods: {
    backToQuestion() {
      this.$emit('change-status', STATUS.MAIN)
    },
    async openHint(hintId) {
      await this.$store.dispatch('question/openHint', hintId)
    }
  }
}
</script>

<style scoped>
</style>
