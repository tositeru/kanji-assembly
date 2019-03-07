<template lang=pug>
  v-layout()
    v-flex(grop)
      v-sheet(color="grey lighten-3" height="50vh")
        div(v-if="corrected") 正解！
        div(v-else) 不正解
        v-btn(@click="OK") 確認
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
</style>
