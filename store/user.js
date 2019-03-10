import axios from 'axios'
import consola from 'consola'
import cookieparser from 'cookieparser'

export const state = () => ({
  auth: null
})

export const mutations = {
  setAuth(state, auth) {
    state.auth = auth
  }
}

export const actions = {
  nuxtServerInit({ commit }, { req }) {
    let auth = null
    if (req.headers.cookie) {
      const parsed = cookieparser.parse(req.headers.cookie)
      try {
        auth = JSON.parse(parsed.auth)
      } catch (err) {
        // No valid cookie found
        consola.error('Found invalid user...', err)
      }
    }
    commit('setAuth', auth)
  },

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
