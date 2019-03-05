<template lang=pug>
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
  async created() {
    try {
      const Q = await this.$store.dispatch('question/query', {
        date: '2019-03-01',
        dateId: 0
      })
      if (Q) {
        this.$emit('change-status', STATUS.MAIN)
      } else {
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
