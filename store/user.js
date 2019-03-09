import axios from 'axios'

export const state = () => ({})

export const mutations = {}

export const actions = {
  async signup({ commit }, { name, email, password }) {
    const res = await axios.post('/user/signup', {
      name: name,
      email: email,
      password: password
    })
    return res.data
  }
}
