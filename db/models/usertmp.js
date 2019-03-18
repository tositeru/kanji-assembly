'use strict'
const crypto = require('crypto')
const moment = require('moment')
const consola = require('consola')
const { TABLE_DEFINETION } = require('../tables/user-tmps.js')
// const ServerDataTypes = require('../../server/user/defineDatatypes')
const commonCrypt = require('./commonCrypt')

module.exports = (sequelize, DataTypes) => {
  const UserTmp = sequelize.define('UserTmp', TABLE_DEFINETION, {})
  UserTmp.associate = async function(models) {}

  /**
   * 仮ユーザー登録を行う
   * @param {ServerDataTypes.SignupParameters} signupParam
   */
  UserTmp.add = async signupParam => {
    try {
      const token = crypto.randomBytes(64).toString('hex')
      const encryptPassword = commonCrypt.encryptPassword(signupParam.password)
      await UserTmp.upsert({
        name: signupParam.name,
        password: encryptPassword.hashedPassword,
        password2: encryptPassword.salt,
        email: signupParam.email,
        token: token
      })

      // 他のエラーも一緒に判定できるようにあとで行っている
      if (
        signupParam.password.length < 8 ||
        signupParam.password.length > 255
      ) {
        throw new RangeError('使用できないパスワードの長さを登録に使用しました')
      }
      return token
    } catch (error) {
      const checkColumns = [
        {
          name: 'name',
          message: '使用できない名前を登録に使用しました'
        },
        {
          name: 'email',
          message: '使用できないメールアドレスを登録に使用しました'
        }
      ]
      const errString = error.toString()
      const errorMessages = {}
      for (const col of checkColumns) {
        if (errString.includes(col.name)) {
          errorMessages[col.name] = col.message
        }
      }
      // パスワードはハッシュ化しているので直接確認する
      if (
        signupParam.password.length < 8 ||
        signupParam.password.length > 255
      ) {
        errorMessages.password = '使用できないパスワードを登録に使用しました'
      }
      consola.error(
        `ユーザー登録失敗. name=${signupParam.name},email=${
          signupParam.email
        },password=${signupParam.password};`,
        error
      )
      return errorMessages
    }
  }

  UserTmp.isValidToken = async token => {
    const expirationDate = moment().subtract(10, 'minutes')
    const usertmp = await UserTmp.findOne({
      where: {
        token: token,
        updatedAt: {
          [sequelize.Op.gte]: expirationDate.toISOString()
        }
      }
    })
    if (!usertmp) {
      return null
    }
    const result = {
      name: usertmp.name,
      email: usertmp.email,
      password: usertmp.password,
      password2: usertmp.password2
    }
    usertmp.destroy()
    return result
  }

  return UserTmp
}
