<template lang="pug">
  v-layout(align-center justify-space-between column fill-height)
    v-flex(align-self-center)
      v-sheet(color="grey lighten-3" height="40vh")
        div(v-if="corrected" class="display-3 text-xs-center result-text") 正解！
          div(class="body-2") やったね！
        div(v-else class="display-3 text-xs-center result-text") 不正解
          div(class="body-2") 残念…
    v-flex()
      v-btn(@click="OK" class="") 確認
</template>

<script>
import { STATUS } from './common'

export default {
  data() {
    return {}
  },
  computed: {
    corrected() {
      return this.$store.state.question.currentQuestion.corrected
    }
  },
  methods: {
    OK() {
      this.$emit('change-status', STATUS.MAIN)
    }
  }
}
</script>

<style lang="scss" scoped>
.result-text {
  padding-top: 15vh;
  padding-bottom: 20vh;
  height: 85%;
  line-height: 85%;
}

button {
  margin: 0;
  width: 100%;
}
</style>
