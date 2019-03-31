<template lang="pug">
  v-sheet(color="grey lighten-3" height="50vh" width="100%")
    v-layout(align-center justify-center row fill-height)
      v-flex(v-if="!error" shrink align-self-center)
        v-progress-circular(indeterminate color="primary" :size="128" :width="16")
      v-flex(v-else class="text-xs-center")
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
      if (Q.failed) {
        this.error = Q.message
        // this.$emit('change-status', STATUS.UNKNOWN)
      } else {
        this.$emit('change-status', STATUS.MAIN)
      }
    } catch (e) {
      this.error = e
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
