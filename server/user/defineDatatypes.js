'use strict'

/**
 * SignupParameters Options
 * @typedef {Object} SignupParametersOptions
 * @property {bool} doSendMail
 */

/**
 * ユーザー登録時に使用するパラメータ
 * @class SignupParameters
 */
class SignupParameters {
  /**
   * コンストラクタ
   * @param {string} name
   * @param {string} email
   * @param {string} password
   * @param {SignupParametersOptions|null} options
   */
  constructor(name, email, password, options) {
    this._name = name
    this._email = email
    this._password = password
    const opts = options || {}
    this._doSendMail = opts.doSendMail || true
  }

  get name() {
    return this._name
  }
  get email() {
    return this._email
  }
  get password() {
    return this._password
  }
  get doSendMail() {
    return this._doSendMail
  }

  /**
   * JSON形式に変換する
   */
  toObj() {
    return {
      name: this._name,
      email: this._email,
      password: this._password,
      doSendMail: this._doSendMail
    }
  }

  /**
   * 使用できる状態にあるかチェック
   */
  doValid() {
    return this._name && this._email && this._password
  }
}

/**
 * ログイン時に使用するパラメータ
 * @class LoginParameters
 */
class LoginParameters {
  /**
   * コンストラクタ
   * @param {string} email
   * @param {string} password
   */
  constructor(email, password) {
    this._email = email
    this._password = password
  }

  get email() {
    return this._email
  }
  get password() {
    return this._password
  }

  /**
   * JSON形式に変換する
   */
  toObj() {
    return {
      email: this._email,
      password: this._password
    }
  }

  /**
   * 使用できる状態にあるかチェック
   */
  doValid() {
    return this._email || this._password
  }
}

module.exports = {
  SignupParameters: SignupParameters,
  LoginParameters: LoginParameters
}
