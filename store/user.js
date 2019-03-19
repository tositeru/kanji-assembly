import axios from 'axios'
import consola from 'consola'
import Cookie from 'js-cookie'

export const state = () => ({
  auth: null
})

export const mutations = {
  setAuthToken(state, authToken) {
    state.auth = authToken
  }
}

export const actions = {
  async signup({ state, commit }, { name, email, password }) {
    if (state.auth) {
      consola.error('User Signup', 'Invalid Operation')
      return null
    }

    const res = await axios.post('/user/signup', {
      name: name,
      email: email,
      password: password
    })
    return res.data
  },

  async login({ commit }, { email, password }) {
    if (state.auth) {
      consola.error('User Login', 'Invalid Operation')
      return null
    }

    try {
      const res = await axios.post('/user/login', {
        email: email,
        password: password
      })
      if (res.data.isSuccessed) {
        commit('setAuthToken', res.data.token)
        Cookie.set('auth', res.data.token, { expires: 10 })
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
  },
  async logout({ state, commit }) {
    if (!state.auth) {
      consola.error('User Logout', 'Invalid Operation')
      return null
    }

    try {
      await axios.post('/user/logout', {
        token: state.auth
      })

      commit('setAuthToken', null)
      Cookie.set('auth', null)
      return {
        isSuccessed: true
      }
    } catch (error) {
      consola.error('Failed user logout', error)
      return {
        isSuccessed: false,
        message: 'ログアウトに失敗しました'
      }
    }
  }
}
