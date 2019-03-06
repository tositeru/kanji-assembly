<template lang="pug">
  v-container(class="today-question elevation-4")
    div(class="title elevation-1")
      slot()
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
    result: () => import('./result.vue'),
    hint: () => import('./hint.vue')
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
  margin: 13px auto;

  .title {
    font-size: 32px;
    background: white;

    height: 40px;

    display: table;
    margin: -30px auto auto 10px;
    padding-top: 10px;
    padding-left: 10px;
    padding-right: 10px;
  }
}
</style>
