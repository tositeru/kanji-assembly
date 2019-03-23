<template lang="pug">
	div
		h2(class="display-3 text-xs-center") マイページ
			v-btn(@click="logout") ログアウト
		v-layout(v-if="loading")
			| 読み込み中
		v-layout(v-else align-center justify-center)
			v-flex(xs12 sm6)
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
									v-card-title(class="display-1 text-xs-center") ユーザー情報の変更
									v-card-text
										user-parameter-form(v-bind:params="this.updateInfo" v-bind:errorMessage="this.errorMessages")
										v-flex(v-if="errorMessages.hasError()")
											div(class="error error--text text--lighten-4 display-1 text-xs-center") {{ errorMessages.caption }}
									div(class="text-xs-center caption") 変更する必要のないものは入力しなくても大丈夫です('現在のパスワード'は除く)
									v-card-actions
										v-spacer
										v-btn(color="blue darken-1" flat @click="doEdit = false") キャンセル
										v-btn(color="blue darken-1" flat @click="send()") 送信
</template>

<script>
import consola from 'consola'
import {default as UserParameterForm, Parameters, ErrorMessages} from './userParameterForm.vue'

export default {
	components: {
		'user-parameter-form': UserParameterForm
	},
  data() {
    return {
			loading: true,
			user: {
				name: '',
				email: ''
			},
			updateInfo: new Parameters('', '', ''),
			errorMessages: new ErrorMessages,
      doEdit: false,
		}
  },
  async mounted() {
    const userParameter = await this.$store.dispatch('user/get')
    if (userParameter) {
      this.user.name = userParameter.name
			this.user.email = userParameter.email
			
			this.updateInfo.name = this.user.name
			this.updateInfo.email = this.user.email
		}
		this.updateInfo.setOldPassword('')
		this.loading = false
  },
  methods: {
    async send() {
			try {
				const result = await this.$store.dispatch('user/update', this.updateInfo)
				if (result.isSuccessed) {
					this.doEdit = false
					this.errorMessages.set({}, null)

					this.user.name = this.updateInfo.name
					this.user.email = this.updateInfo.email
				} else {
					this.errorMessages.set(result.errors, '更新に失敗しました。')
				}
			} catch (error) {
				consola.error('Failed to update user parameters', error)
				this.errorMessages.set({}, '更新に失敗しました。')
			}
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
