<template lang=pug>
  v-container(class="today-question")
    h2 {{ title }}
    v-scroll-x-transition(mode="out-in")
      component(:is="currentCondition" @change-status="changeStatus($event)")
</template>

<script>
import { STATUS } from './common'

export default {
  components: {
    unknown: () => import('./unknown.vue'),
    loading: () => import('./loading.vue'),
    'main-form': () => import('./mainForm.vue'),
    juding: () => import('./judging.vue'),
    result: () => import('./result.vue')
  },
  props: {
    title: { type: String, default: '問題' }
  },
  data() {
    return {
      status: STATUS.LOADING
    }
  },
  computed: {
    currentCondition() {
      if (STATUS.validateStatus(this.status)) {
        return this.status
      } else {
        return STATUS.UNKNOWN
      }
    }
  },
  methods: {
    changeStatus(nextStatus) {
      this.status = nextStatus
    }
  }
}
</script>

<style lang="scss" scoped>
.today-question {
  border: 1px solid black;
  margin: 13px auto;

  h2 {
    font-size: 32px;
    background: white;

    display: table;
    margin: -40px auto auto 10px;
    padding: 0px 25px;
  }
}
</style>
