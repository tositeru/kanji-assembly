<template lang=pug>
  v-footer(height="auto" class="cyan cyan--text text--lighten-5")
    v-layout(justify-center row wrap)
      v-tabs(fixed-tabs dark color="cyan" show-arrows class="bottom-menu")
        v-tabs-slider(color="yellow")
        v-tab(v-for="(menu, i) in menus" :key="i" :to="menu.link" class="menu-item") {{ menu.name }}
      v-flex(primary py-3 text-xs-center xs12)
        | 2019 tositeru
</template>

<script>
export default {
  data() {
    return {
      menus: [
        { name: 'サイトについて', link: '/about' },
        { name: 'ユーザー', link: '/user' },
        { name: '問題一覧', link: '/questionHistory' }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
footer {
  margin-top: 25px;
}

.bottom-menu {
  width: 100%;
  // position: absolute;
  // bottom: 0px;
}
</style>
