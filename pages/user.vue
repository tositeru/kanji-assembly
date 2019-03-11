<template lang="pug">
  v-container()
    v-layout()
      g-title()
    v-layout()
      v-card(flat class="elevation-3")
        v-card-title() {{ user.name }}さんのページ
          v-btn(@click="logout") ログアウト
        v-card-text() 何かしらの情報
        v-card-actions()
          v-btn(@click="doEdit = !doEdit") 編集
          v-dialog(v-model="doEdit" persistent max-width="60%")
            v-form
              v-card
                v-card-title 編集
                v-card-text
                  v-text-field(v-model="user.name" label="名前" type="text" :rules="[rules.required]")
                  v-text-field(v-model="user.password" label="パスワード" :type="showPassword1 ? 'text' : 'password'"
                    :append-icon="showPassword1 ? 'visibility_off' : 'visibility'" @click:append="showPassword1 = !showPassword1"
                    :rules="[rules.required, rules.min]" counter)
                v-card-actions
                  v-spacer
                  v-btn(color="blue darken-1" flat @click="doEdit = false") Close
                  v-btn(color="blue darken-1" flat @click="save()") Save
</template>

<script>
export default {
  middleware: ['authenticated'],
  data() {
    return {
      showPassword1: false,
      doEdit: false,
      user: {
        name: '名無しのゴンベ',
        password: '１２３４５６'
      },
      rules: {
        required: v => !!v || '入力してください',
        min: v => v.length > 8 || '8文字以上にしてください'
      }
    }
  },
  methods: {
    save() {
      alert('please implement')
      this.doEdit = false
    },
    async logout() {
      const result = await this.$store.dispatch('user/logout')
      if (result.isSuccessed) {
        this.$router.push('/')
      }
    }
  }
}
</script>

<style scoped>
</style>
