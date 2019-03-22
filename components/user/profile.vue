<template lang="pug">
	div
		h2(class="display-3 text-xs-center") マイページ
			v-btn(@click="logout") ログアウト
		v-layout(align-center justify-center)
			v-flex(v-flex xs12 sm6)
				v-card(flat class="elevation-3")
					v-card-text()
						v-list(two-line)
							v-list-tile
								v-list-tile-action
									v-icon() account_box
								v-list-tile-content
									v-list-tile-title {{user.name}}
									v-list-tile-sub-title 名前
							v-list-tile
								v-list-tile-action
									v-icon() mail
								v-list-tile-content
									v-list-tile-title {{user.email}}
									v-list-tile-sub-title メールアドレス
					v-card-actions(reverse)
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
  data() {
    return {
      showPassword1: false,
      doEdit: false,
      user: {
        name: '',
        email: '',
        password: ''
      },
      rules: {
        required: v => !!v || '入力してください',
        min: v => v.length > 8 || '8文字以上にしてください'
      }
    }
  },
  async mounted() {
    const userParameter = await this.$store.dispatch('user/get')
    if (userParameter) {
      this.user.name = userParameter.name
      this.user.email = userParameter.email
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

<style lang="scss" scoped>
</style>
