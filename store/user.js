import axios from 'axios'
import consola from 'consola'

export const state = () => ({
  userID: null
})

export const mutations = {
  setUserID(state, userID) {
    state.userID = userID
  }
}

export const actions = {
  async signup({ commit }, { name, email, password }) {
    const res = await axios.post('/user/signup', {
      name: name,
      email: email,
      password: password
    })
    return res.data
  },

  async login({ commit }, { email, password }) {
    try {
      const res = await axios.post('/login', {
        email: email,
        password: password
      })
      if (res.data.isSuccessed) {
        commit('setUserID', res.data.id)
      }
      return res.data
    } catch (error) {
      consola.error('Failed user login', error)
      return {
        isSuccessed: false,
        messages: {
          network: 'ログインに失敗しました。'
        }
      }
    }
  }
}
