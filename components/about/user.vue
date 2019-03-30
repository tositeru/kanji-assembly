<template lang="pug">
	div
		v-card(flat)
			v-card-text
				p 本サイトではユーザー登録を行うことが可能です。
			v-card-text
				p ユーザー登録をすると以下の機能を利用することができます。(予定)
				ul
					li 以前に出題された問題を閲覧すること
					li 過去に解いた問題をマークすること
				p 随時、上記以外のユーザー機能を追加していく予定です。
		privacy-policy()
</template>
<script>
import PrivacyPolicy from './privacyPolicy.vue'

export default {
  components: {
    'privacy-policy': PrivacyPolicy
  }
}
</script>
<style lang="scss" scoped>
ul {
  margin-left: 20px;
  list-style: desc;
}
</style>
