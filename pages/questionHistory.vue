<template lang="pug">
  v-container()
    g-title(class="text-xs-center")
    v-layout(justify-center)
      v-flex()
        h2(class="display-3 text-xs-center") 問題一覧
    v-scroll-x-transition(mode="out-in")
      component(:is="currentCondition" @change-status="changeStatus($event)")
</template>
<script>
import History from '~/components/questionHistory/history.vue'
import SelectedQuestion from '~/components/questionHistory/selectedQuestion.vue'

export default {
  components: {
    history: History,
    selectedQuestion: SelectedQuestion
  },
  data() {
    return {
      status: 'history'
    }
  },
  computed: {
    currentCondition() {
      return this.status
    }
  },
  methods: {
    changeStatus(nextStatus) {
      this.status = nextStatus
    }
  }
}
</script>
<style lang="scss"scoped>
</style>
