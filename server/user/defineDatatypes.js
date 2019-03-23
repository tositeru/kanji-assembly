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

/**
 * ユーザーパラメータ更新時に使うパラメータ
 * @class
 */
class UpdateParameters {
  /**
   * @param {string} name
   * @param {string} email
   * @param {string} password
   * @param {string} oldPassword
   * @param {boolean} doSendMail
   */
  constructor(name, email, password, oldPassword, doSendMail = true) {
    this.name = name
    this.email = email
    this.password = password
    this.oldPassword = oldPassword
    this.doSendMail = doSendMail
  }

  /**
   * JSON形式に変換する
   */
  toObj() {
    return {
      name: this.name,
      email: this.email,
      password: this.password,
      oldPassword: this.oldPassword,
      doSendMail: this.doSendMail
    }
  }

  /**
   * 使用できる状態にあるかチェック
   */
  doValid() {
    if (!this.oldPassword) {
      return false
    }
    return this.name || this.email || this.password
  }
}

module.exports = {
  SignupParameters: SignupParameters,
  LoginParameters: LoginParameters,
  UpdateParameters: UpdateParameters
}
