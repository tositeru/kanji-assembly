<template lang="pug">
  sub
    v-layout(row reverse)
      v-btn(@click="backToQuestion()") 戻る
    v-sheet(color="grey lighten-3" style="overflow:scroll;")
      v-layout(align-center justify-space-around column fill-height)
        v-flex(v-for="(hint, i) in hints" :key="i" class="text-xs-center")
          div(v-if="hint.opened")
            div(class="hint-text title") {{hint.text}}
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

<style lang="scss"scoped>
.hint-text {
  margin: 10px;
  min-height: 32px;
  line-height: 1.5;
}
</style>
