<template lang="pug">
	span
		v-text-field(v-model="params.name" label="名前" type="text" :rules="[rules.required, rules.minName]" :loading="doCheckingName" @change='changeName' append-icon='check_circle')
			template(v-slot:append)
				div(v-if="errorMessage.name" class="error--text") {{ errorMessage.name }}
				div(v-if="innerErrorMessage.name" class="error--text") {{ innerErrorMessage.name }}
		v-text-field(v-model="params.email" label="メールアドレス" type="text" :rules="[rules.required, rules.email]" :loading="doCheckingEmail" @change='changeEmail' append-icon='check_circle')
			template(v-slot:append)
				div(v-if="errorMessage.email" class="error--text") {{ errorMessage.email }}
				div(v-if="innerErrorMessage.email" class="error--text") {{ innerErrorMessage.email }}
		v-text-field(v-model="params.password" label="パスワード" :type="showPassword ? 'text' : 'password'"
			:append-icon="showPassword ? 'visibility_off' : 'visibility'" @click:append="showPassword = !showPassword"
			:rules="[rules.required, rules.min]" counter loading)
			template(v-slot:progress)
				v-progress-linear(:value="progressPassword" :color="passwordColor" height="7")
			template(v-slot:append)
				div(v-if="errorMessage.password" class="error--text") {{ errorMessage.password }}
		v-text-field(v-model="params.confirmPassword" label="パスワード(確認用)" :type="showConfirmPassword ? 'text' : 'password'"
			:append-icon="showConfirmPassword ? 'visibility_off' : 'visibility'" @click:append="showConfirmPassword = !showConfirmPassword"
			:rules="[rules.required, rules.matchPassword]" counter)
		v-text-field(v-show="typeof params.oldPassword === 'string'" v-model="params.oldPassword" label="現在のパスワード" :type="showOldPassword ? 'text' : 'password'"
			:append-icon="showOldPassword ? 'visibility_off' : 'visibility'" @click:append="showOldPassword = !showOldPassword"
			:rules="[rules.required]" counter)
			template(v-slot:append)
				div(v-if="errorMessage.oldPassword" class="error--text") {{ errorMessage.oldPassword }}
</template>
<script>
import validator from 'validator'
import axios from 'axios'
import loginParameter from './loginParameter.js'

export class Parameters {
  constructor(name, email, password) {
    this.name = name
    this.email = email
    this.password = password
    this.confirmPassword = ''
    this.oldPassword = null
  }

  /**
   * @param {string} value
   */
  setOldPassword(value) {
    this.oldPassword = value
  }
}

export class ErrorMessages {
  constructor() {
    this.name = null
    this.email = null
    this.password = null
    this.oldPassword = null
    this.caption = null
  }

  set(errorMessages, caption) {
    this.name = errorMessages.name
    this.email = errorMessages.email
    this.password = errorMessages.password
    this.oldPassword = errorMessages.oldPassword
    if (errorMessages.caption) {
      this.caption = errorMessages.caption
    } else {
      this.caption = caption
    }
  }

  hasError() {
    return (
      this.name ||
      this.email ||
      this.password ||
      this.oldPassword ||
      this.caption
    )
  }
}

const MIN_PASSWORD_LENGTH = 8
export default {
  props: {
    params: Parameters,
    errorMessage: ErrorMessages
  },
  data: function() {
    return {
      showPassword: false,
      showConfirmPassword: false,
      showOldPassword: false,
      doCheckingName: false,
      doCheckingEmail: false,
      rules: {
        required: v => !!v || '入力してください',
        minName: v => v.length > 1 || '二文字以上にしてください',
        email: v => validator.isEmail(v) || 'メールアドレスを入力してください',
        min: v =>
          v.length >= MIN_PASSWORD_LENGTH ||
          `${MIN_PASSWORD_LENGTH}文字以上にしてください`,
        matchPassword: v =>
          this.params.password === v || 'パスワードが一致しません'
      },
      innerErrorMessage: {}
    }
  },
  computed: {
    progressPassword() {
      return Math.min(
        100,
        (this.params.password.length * 100.0) / MIN_PASSWORD_LENGTH
      )
    },
    passwordColor() {
      const messages = ['error', 'warning', 'success']
      return messages[Math.floor(this.progressPassword / 50)]
    }
  },
  mounted() {
    this.params.setOldPassword(loginParameter.getPassword())
  },
  methods: {
    async changeName() {
      this.doCheckingName = true
      this.innerErrorMessage.name = (await checkUserParam(
        'name',
        this.params.name
      ))
        ? '同じ名前のユーザーが存在しています'
        : null
      this.doCheckingName = false
    },
    async changeEmail() {
      this.doCheckingEmail = true
      this.innerErrorMessage.email = (await checkUserParam(
        'email',
        this.params.email
      ))
        ? '同じメールアドレスのユーザーが存在しています'
        : null
      this.doCheckingEmail = false
    }
  }
}

async function checkUserParam(key, param) {
  try {
    const params = {}
    params[key] = param
    const res = await axios.get('/user/check', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      params: params
    })

    return res.data.status[key]
  } catch (err) {
    alert(err)
  }
  this.doCheckingEmail = false
}
</script>
<style lang="sass" scoped>

</style>
