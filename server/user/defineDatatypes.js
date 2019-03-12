'use strict'

module.exports = {
  /**
   * サインアップ用のパラメータを作成する
   * @param {string} name
   * @param {string} email
   * @param {string} password
   * @param {object} options
   */
  makeSignupParameters(name, email, password, options) {
    const data = {
      name: name,
      email: email,
      password: password
    }
    if (options) {
      if (options.notSendMail) {
        data.notSendMail = options.notSendMail
      }
    }
    return data
  },

  /**
   * ログイン用のパラメータを作成する
   * @param {string} email
   * @param {string} password
   */
  makeLoginParameters(email, password) {
    return {
      email: email,
      password: password
    }
  }
}
