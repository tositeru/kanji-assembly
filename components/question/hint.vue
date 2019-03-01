<template lang="pug">
  sub
    v-layout(row reverse)
      v-btn(@click="backToQuestion()") 戻る
    v-sheet(color="grey lighten-3" height="50vh")
      v-layout(align-center justify-center row fill-height)
        v-flex(v-for="(hint, i) in hints" :key="i" class="text-xs-center")
          div(v-if="hint.doShow")
            | {{hint.description}}
          div(v-else)
            v-btn(@click="hint.open()") 助言{{i+1}}を見る
</template>

<script>
import { STATUS } from './common.js'

class Hint {
  constructor(description) {
    this._description = description
    this._doShow = false
  }

  get description() {
    return this._description
  }
  get doShow() {
    return this._doShow
  }

  open() {
    if (this._doShow) return
    this._doShow = true
  }
}

export default {
  data() {
    return {
      hints: [
        new Hint('6画の漢字です'),
        new Hint('部首はうかんむりです'),
        new Hint('読みにウが含まれます')
      ]
    }
  },
  methods: {
    backToQuestion() {
      this.$emit('change-status', STATUS.MAIN)
    }
  }
}
</script>

<style scoped>
</style>
