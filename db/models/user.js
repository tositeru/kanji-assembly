'use strict'
const fs = require('fs')
const path = require('path')
const consola = require('consola')
const jwt = require('jsonwebtoken')
const uuid = require('uuid/v4')
const { TABLE_DEFINETION } = require('../tables/users.js')
const CommonCrypt = require('./commonCrypt')

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', TABLE_DEFINETION, {
    getterMethods: {
      name() {
        return this.getDataValue(`name`)
      },
      email() {
        return this.getDataValue(`email`)
      },
      password() {
        return this.getDataValue(`password`)
      },
      password2() {
        return this.getDataValue(`password2`)
      },
      status() {
        return this.getDataValue(`status`)
      }
    }
  })
  User.associate = function(models) {
    // associations can be defined here
  }

  User.STATUS_LOCKED = 0
  User.STATUS_LOGOUT = 1
  User.STATUS_LOGIN = 2
  User.STATUS_CHANGE_PASAWORD = 3

  const JWT_ALGORITHM = 'RS256'

  User.isExist = async function(name, email) {
    const count = await User.count({
      where: {
        [sequelize.Op.or]: [{ name: name }, { email: email }]
      }
    })
    return count > 0
  }

  User.createWithUserInfo = async function(userInfo) {
    if (await User.isExist(userInfo.name, userInfo.email)) {
      consola.error('Failed to add user because the user already exists...')
      return null
    }
    try {
      const user = await User.create({
        id: uuid(),
        name: userInfo.name,
        email: userInfo.email,
        password: userInfo.password,
        password2: userInfo.password2,
        status: User.STATUS_LOGOUT
      })
      return user
    } catch (error) {
      consola.error('Failed to add User...', error)
      return null
    }
  }

  const authToken = {
    private: fs.readFileSync(
      path.resolve(__dirname, '../../ssl/auth-token/auth-token.pem')
    ),
    public: fs.readFileSync(
      path.resolve(__dirname, '../../ssl/auth-token/auth-token.pub')
    ),
    passphrase: 'HE=S:SB#2!wRs3/I8&tX]Hyf^DiJg8',
    expiredSecond: 60 * 60 * 24 * 30
  }

  /**
   * ログイン処理を行う
   * @param {server/user/defineDatatype LoginParam} loginParam
   */
  User.login = async function(loginParam) {
    try {
      const user = await User.findOne({
        where: {
          email: loginParam.email
        }
      })
      if (!user) {
        consola.error('Failed to login user because unknown user')
        return null
      }
      const encryptPassword = CommonCrypt.encryptPassword(
        loginParam.password,
        user.password2
      )
      if (encryptPassword.hashedPassword !== user.password) {
        consola.error('Failed to login user because invalid password')
        return null
      }

      const payload = {
        id: user.id
      }
      const rsaKey = {
        key: authToken.private,
        passphrase: authToken.passphrase
      }
      const token = jwt.sign(payload, rsaKey, {
        algorithm: JWT_ALGORITHM,
        expiresIn: authToken.expiredSecond // 30日間
      })

      user.setDataValue('status', User.STATUS_LOGIN)
      await user.save()

      return token
    } catch (error) {
      consola.error('Failed to login user', error)
      return null
    }
  }

  User.logout = async userData => {
    try {
      const user = await User.findOne({
        where: {
          id: userData.id
        }
      })
      if (!user) {
        consola.error('Not Found user at logout...', `user id=${userData.id}`)
        return false
      }
      user.setDataValue('status', User.STATUS_LOGOUT)
      await user.save()

      return true
    } catch (error) {
      consola.error('Occur error at logout...', error)
      return false
    }
  }

  User.delete = async userData => {
    try {
      const user = await User.findOne({
        where: {
          id: userData.id
        }
      })
      if (!user) {
        consola.error('Not Found user at delete...', `user id=${userData.id}`)
        return false
      }
      user.setDataValue('status', User.STATUS_LOCKED)
      await user.destroy()

      return true
    } catch (error) {
      consola.error('Occur error at delete...', error)
      return false
    }
  }

  User.validateAuthToken = token => {
    let userData = null
    const options = {
      algorithms: [JWT_ALGORITHM],
      maxAge: authToken.expiredSecond
    }
    jwt.verify(token, authToken.public, options, (err, decoded) => {
      if (err) {
        consola.error('Invalid User Auth Token...', err)
        return
      }
      userData = {
        id: decoded.id
      }
    })
    return userData
  }

  return User
}
