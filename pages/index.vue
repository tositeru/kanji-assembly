<template lang=pug>
  section(class="background")
    h1 漢字組み立てパズル
      div(class="login") ログイン/サインイン
    div(class="Ad") 広告スペース
    question(title="今日の問題")
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
  components: {
    question: () => import('~/components/question/question.vue')
  },
  data() {
    return {
      menus: [
        { name: 'サイトについて', link: '#' },
        { name: '統計', link: '#' },
        { name: '問題一覧', link: '#' }
      ]
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.background {
  width: 100vw;
  height: 100vh;

  h1 {
    margin: 0px auto;
    font-size: 72px;
    text-align: center;
    .login {
      font-size: 32px;
      text-align: right;
      margin-right: 10%;
    }
  }

  .Ad {
  }

  .bottom-menu {
    width: 100%;
    // position: absolute;
    // bottom: 0px;
  }
}
</style>
