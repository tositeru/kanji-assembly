<template lang=pug>
  v-layout()
    v-flex(grop)
      v-sheet(color="grey lighten-3" height="50vh")
        | 正解！
        v-btn(@click="OK") 確認
</template>

<script>
import { STATUS } from './common'

export default {
  data() {
    return {}
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
