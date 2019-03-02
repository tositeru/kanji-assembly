<template lang=pug>
  v-layout()
    v-flex(grop)
      v-sheet(color="grey lighten-3" height="50vh")
        | 判定中
        v-progress-circular(indeterminate color="primary")
        v-btn(@click="cancel") 取り消し
</template>

<script>
import { STATUS } from './common'

export default {
  data() {
    return {}
  },
  async created() {
    await this.$store.dispatch(
      'question/sendAnswer',
      this.$store.state.question.answers
    )
    this.$emit('change-status', 'result')
  },
  methods: {
    cancel() {
      this.$emit('change-status', STATUS.MAIN)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
