<template lang="pug">
  v-container()
    v-layout()
      g-title()
    div(class="elevation-3")
      v-tabs(color="cyan" dark slider-color="yellow"  show-arrows)
        v-tab(v-for="(tab, i) in tabList" :key="i" ripple) {{ tab.name }}
        v-tab-item()
          site()
        v-tab-item()
          user()
        v-tab-item()
          author()
  </div>
</template>

<script>
import Site from '~/components/about/site.vue'
import User from '~/components/about/user.vue'
import Author from '~/components/about/author.vue'

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
  components: {
    site: Site,
    user: User,
    author: Author
  },
  data() {
    return {
      tabList: [
        new Tab(
          '本サイトについて',
          '本サイトはお題として出された漢字を構成する線を組み立てて出来る漢字を当てるパズルを提供するサイトになります。'
        ),
        new Tab(
          'プライバシーポリシー',
          'ここにプライバシーポリシーを書いていく。'
        ),
        new Tab('製作者について', '作者についての情報')
      ]
    }
  }
}
</script>
<style scoped>
</style>
