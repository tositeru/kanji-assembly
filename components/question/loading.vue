<template lang=pug>
  v-layout()
    v-flex(grop)
      v-sheet(color="grey lighten-3" height="50vh")
        | 読み込み中
</template>

<script>
import { STATUS } from './common'

export default {
  data() {
    return {}
  },
  created() {
    setTimeout(() => {
      this.$emit('change-status', STATUS.MAIN)
    }, 1000)
  }
}
</script>

<style lang="scss" scoped>
</style>
