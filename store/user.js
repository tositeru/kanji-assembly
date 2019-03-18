import axios from 'axios'
import consola from 'consola'
import cookieparser from 'cookieparser'

export const state = () => ({
  auth: null
})

export const mutations = {
  setAuthToken(state, authToken) {
    state.auth = authToken
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
