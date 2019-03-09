'use strict'
const crypto = require('crypto')
const moment = require('moment')
const consola = require('consola')

module.exports = (sequelize, DataTypes) => {
  const UserTmp = sequelize.define(
    'UserTmp',
    {
      name: {
        type: DataTypes.STRING,
        primaryKey: true,
        validate: {
          len: [3, 64]
        }
      },
      password: {
        type: DataTypes.STRING,
        validate: {
          len: [8, 255]
        }
      },
      email: {
        type: DataTypes.STRING,
        validate: {
          isEmail: true,
          max: 255
        }
      },
      token: {
        type: DataTypes.STRING,
        isUUID: 4
      }
    },
    {
      hooks: {
        beforeUpsert(values, options) {
          consola.log('User: Add UserTmp: ')
        }
      }
    }
  )
  UserTmp.associate = async function(models) {}

  UserTmp.add = async (name, password, email) => {
    try {
      const token = crypto.randomBytes(16).toString('base64')
      await UserTmp.upsert({
        name: name,
        password: crypto
          .createHash('SHA512')
          .update(password)
          .digest('hex'),
        email: email,
        token: token
      })

      // 他のエラーも一緒に判定できるようにあとで行っている
      if (password.length < 8 || password.length > 255) {
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
      if (password.length < 8 || password.length > 255) {
        errorMessages.password = '使用できないパスワードを登録に使用しました'
      }
      consola.error(
        `ユーザー登録失敗. name=${name},email=${email},password=${password};`,
        errorMessages
      )
      return errorMessages
    }
  }

  UserTmp.isValidToken = async token => {
    const expirationDate = moment().subtract(10, 'minutes')
    const usertmp = await UserTmp.findOne({
      where: {
        token: token,
        updatedAt: expirationDate.toISOString()
      }
    })
    if (!usertmp) {
      return false
    }
    usertmp.destroy()
    return true
  }

  return UserTmp
}
