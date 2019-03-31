<template lang="pug">
  v-footer(height="auto" class="cyan cyan--text text--lighten-5")
    v-layout(justify-center row wrap)
      v-tabs(fixed-tabs dark color="cyan" show-arrows class="bottom-menu")
        v-tabs-slider(color="yellow")
        v-tab(:to="top.link" class="menu-item") {{ top.name }}
        v-tab(:to="about.link" class="menu-item") {{ about.name }}
        template(v-if="isLogin")
          v-tab(:to="user.link" class="menu-item") {{ user.name }}
          v-tab(:to="questionList.link" class="menu-item") {{ questionList.name }}
        template(v-else)
          v-tab(:to="login.link" class="menu-item") {{ login.name }}
          v-tab(class="menu-item" @click="doShowInviteSignupDialog=true") {{ questionList.name }}
            v-dialog(v-model="doShowInviteSignupDialog" :width="getInviteSignupDialogWidth")
              v-card()
                v-card-title() ユーザー登録が必要です
                v-card-text() 問題一覧を見るためにはユーザー登録が必要です。
                v-card-actions()
                  v-btn(@click="doShowInviteSignupDialog=false") OK
                  v-btn(@click="jumpToSignup") 登録画面へ
      v-flex(primary py-3 text-xs-center xs12)
        | 2019 tositeru
</template>

<script>
export default {
  data() {
    return {
      doShowInviteSignupDialog: false,
      top: { name: 'Top', link: '/' },
      about: { name: 'サイトについて', link: '/about' },
      user: { name: 'ユーザー', link: '/user' },
      questionList: { name: '問題一覧', link: '/questionHistory' },
      login: { name: 'ログイン', link: '/login' }
    }
  },
  computed: {
    isLogin() {
      return !!this.$store.state.user.auth
    },
    getInviteSignupDialogWidth() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return '90vw'
        case 'sm':
          return '80vw'
        default:
          return '50vw'
      }
    }
  },
  methods: {
    jumpToSignup() {
      this.$router.push('/signup')
      this.doShowInviteSignupDialog = false
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
