<template lang=pug>
  v-layout()
    v-flex(grop)
      v-sheet(color="grey lighten-3" height="50vh")
        | 判定中
        v-btn(@click="cancel") 取り消し
</template>

<script>
import { STATUS } from './common'

export default {
  data() {
    return {}
  },
  created() {
    setTimeout(() => {
      this.$emit('change-status', 'result')
    }, 2000)
  },
  methods: {
    cancel() {
      this.$emit('change-status', STATUS.RESULT)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
