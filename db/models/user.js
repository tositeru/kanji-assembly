'use strict'
const fs = require('fs')
const path = require('path')
const jwt = require('jsonwebtoken')
const uuid = require('uuid/v4')
const { TABLE_DEFINETION } = require('../tables/users.js')
const Logger = require('../../src/log')
const CommonCrypt = require('./commonCrypt')

const logger = new Logger('DB Users', 'debug')

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
      logger.error(
        'Signup',
        `name=${userInfo.name} email=${userInfo.email}`,
        'duplicate parameter...'
      )
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

      logger.info(
        'Signup',
        `id=${user.id} name=${user.name} email=${user.email}`,
        ''
      )
      return user
    } catch (error) {
      logger.error(
        'Signup',
        `name=${userInfo.name} email=${userInfo.email}`,
        error
      )
      return null
    }
  }

  const AUTH_TOKEN = {
    private: fs.readFileSync(
      path.resolve(__dirname, '../../ssl/auth-token/private.key')
    ),
    public: fs.readFileSync(
      path.resolve(__dirname, '../../ssl/auth-token/public.pub')
    ),
    passphrase: fs.readFileSync(
      path.resolve(__dirname, '../../ssl/auth-token/passphrase')
    ),
    expiredSecond: 60 * 60 * 24 * 30
  }

  User.createAuthToken = userId => {
    const payload = {
      id: userId
    }
    const rsaKey = {
      key: AUTH_TOKEN.private,
      passphrase: AUTH_TOKEN.passphrase
    }
    const token = jwt.sign(payload, rsaKey, {
      algorithm: JWT_ALGORITHM,
      expiresIn: AUTH_TOKEN.expiredSecond // 30日間
    })
    return token
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
        logger.error('Login', `email=${loginParam.email}`, 'unknown user')
        return null
      }
      const encryptPassword = CommonCrypt.encryptPassword(
        loginParam.password,
        user.password2
      )
      if (encryptPassword.hashedPassword !== user.password) {
        logger.error('Login', `email=${loginParam.email}`, 'invalid password')
        return null
      }

      const token = User.createAuthToken(user.id)

      user.setDataValue('status', User.STATUS_LOGIN)
      await user.save()

      logger.info(
        'Login',
        `id=${user.id} name=${user.name} email=${user.email}`
      )

      return token
    } catch (error) {
      logger.error('Login', `email=${loginParam.email}`, error)
      return null
    }
  }

  User.logout = async userData => {
    try {
      const user = await User.findOne({
        where: {
          id: userData.id,
          status: User.STATUS_LOGIN
        }
      })
      if (!user) {
        logger.error('Logout', `user id=${userData.id}`, 'not find user')
        return false
      }
      user.setDataValue('status', User.STATUS_LOGOUT)
      await user.save()

      logger.info(
        `Logout`,
        `id=${user.id} name=${user.name} email=${user.email}`
      )
      return true
    } catch (error) {
      logger.error('Logout', `id=${userData.id}`, error)
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
        logger.error('Delete', `user id=${userData.id} `, 'not find user')
        return false
      }
      user.setDataValue('status', User.STATUS_LOCKED)
      await user.destroy()

      logger.info(
        'Delete',
        `id=${user.id} name=${user.name} email=${user.email}`
      )

      return true
    } catch (error) {
      logger.error('Delete', `user id=${userData.id}`, error)
      return false
    }
  }

  User.validateAuthToken = token => {
    let userData = null
    const options = {
      algorithms: [JWT_ALGORITHM],
      maxAge: AUTH_TOKEN.expiredSecond
    }
    jwt.verify(token, AUTH_TOKEN.public, options, (err, decoded) => {
      if (err) {
        logger.error('Auth Token', '', err)
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
