<template lang="pug">
  v-container()
    v-layout()
      h1(class="display-3" @click="goToTopPage()") 漢字組み立てパズル
    div(class="elevation-3")
      v-tabs(color="cyan" dark slider-color="yellow")
        v-tab(v-for="(tab, i) in tabList" :key="i" ripple) {{ tab.name }}
        v-tab-item(v-for="(tab, i) in tabList" :key="i")
          v-card(flat)
            v-card-text {{ tab.description }}
  </div>
</template>

<script>
class Tab {
  constructor(name, description) {
    this._name = name
    this._description = description
  }
  get name() {
    return this._name
  }
  get description() {
    return this._description
  }
}

export default {
  data() {
    return {
      tabList: [
        new Tab(
          '本サイトについて',
          '本サイトはお題として出された漢字を構成する線を組み立てて出来上がる漢字を当てるパズルを提供するサイトになります。'
        ),
        new Tab(
          'プライバシーポリシー',
          'ここにプライバシーポリシーを書いていく。'
        ),
        new Tab('製作者について', '作者についての情報')
      ]
    }
  },
  methods: {
    goToTopPage() {
      this.$router.push('/')
    }
  }
}
</script>
<style scoped>
</style>
