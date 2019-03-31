<template lang="pug">
  v-layout()
    v-flex(grop)
      v-sheet(color="grey lighten-3" height="50vh")
        v-flex(v-if="!error")
          v-progress-circular(indeterminate color="primary")
        v-flex(v-else)
          | {{error}}
</template>

<script>
import { STATUS } from './common'

export default {
  data() {
    return {
      error: false
    }
  },
  async mounted() {
    try {
      const QDate = this.$store.state.question.currentDate
      const Q = await this.$store.dispatch('question/query', {
        date: QDate.date,
        dateId: QDate.dateId
      })
      if (Q) {
        this.$emit('change-status', STATUS.MAIN)
      } else {
        this.error = Q.message
        this.$emit('change-status', STATUS.UNKNOWN)
      }
    } catch (e) {
      this.error = e
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
