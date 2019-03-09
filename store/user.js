import axios from 'axios'

export const state = () => ({})

export const mutations = {}

export const actions = {
  // 日付から問題を取得する
  async signup({ commit }, { name, email, password }) {
    const res = await axios.post('/user/signup', {
      name: name,
      email: email,
      password: password
    })
    if (res.data === 'Bad') {
      return false
    }
    return true
  }
}
