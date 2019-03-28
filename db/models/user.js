'use strict'
const fs = require('fs')
const path = require('path')
const jwt = require('jsonwebtoken')
const uuid = require('uuid/v4')
const { TABLE_DEFINETION } = require('../tables/users.js')
const Logger = require('../../src/log')
const CommonCrypt = require('./commonCrypt')
const CommonValidator = require('./userValidateCommon')

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
    try {
      const count = await User.count({
        where: {
          $or: [{ name: name || '' }, { email: email || '' }]
        }
      })
      return count > 0
    } catch (error) {
      logger.error(
        'isExist',
        `name=${name},email=${email},error=${error}`,
        'query error'
      )
    }
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

  User.createAuthToken = (userId, createdAt, updatedAt) => {
    const payload = {
      id: userId,
      createdAt: createdAt,
      updatedAt: updatedAt
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

      user.setDataValue('status', User.STATUS_LOGIN)
      await user.save()

      const token = User.createAuthToken(
        user.id,
        user.createdAt,
        user.updatedAt
      )

      logger.info(
        'Login',
        `id=${user.id} name=${user.name} email=${user.email}`
      )

      return {
        user: user,
        token: token
      }
    } catch (error) {
      logger.error('Login', `email=${loginParam.email}`, error)
      return null
    }
  }

  User.logout = async userAuth => {
    try {
      const user = await User.findOne({
        where: {
          id: userAuth.id,
          createdAt: userAuth.createdAt,
          updatedAt: userAuth.updatedAt,
          status: User.STATUS_LOGIN
        }
      })
      if (!user) {
        logger.error('Logout', `user id=${userAuth.id}`, 'not find user')
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
      logger.error('Logout', `id=${userAuth.id}`, error)
      return false
    }
  }

  User.delete = async userAuth => {
    try {
      const user = await User.findOne({
        where: {
          id: userAuth.id,
          createdAt: userAuth.createdAt,
          updatedAt: userAuth.updatedAt
        }
      })
      if (!user) {
        logger.error('Delete', `user id=${userAuth.id} `, 'not find user')
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
      logger.error('Delete', `user id=${userAuth.id}`, error)
      return false
    }
  }

  User.getByAuthToken = async authToken => {
    try {
      const user = await User.findOne({
        where: {
          id: authToken.id,
          createdAt: authToken.createdAt,
          updatedAt: authToken.updatedAt
        }
      })
      if (!user) {
        throw new Error('Not found user...')
      }
      return user
    } catch (error) {
      logger.error('GetByID', `token=${JSON.stringify(authToken)}`, error)
      return null
    }
  }

  /**
   * @param {string} UUID
   * @param {UpdateParameters} 更新パラメータ
   * @return {Object} newToken: 新しいトークン, prevParam: 更新したパラメータの以前の値
   */
  User.updateByParam = async (authToken, updateParam) => {
    try {
      if (!CommonValidator.validatePassword(updateParam.oldPassword)) {
        throw new Error('Invalid oldPassword...')
      }

      const user = await User.findOne({
        where: {
          id: authToken.id,
          createdAt: authToken.createdAt,
          updatedAt: authToken.updatedAt
        }
      })
      if (!user) {
        throw new Error('Miss to find user...')
      }

      const encryptPassword = CommonCrypt.encryptPassword(
        updateParam.oldPassword,
        user.password2
      )

      if (user.password !== encryptPassword.hashedPassword) {
        throw new Error('Failed to authenicate password...')
      }

      // パラメータ更新
      const prevParam = {}
      if (updateParam.name) {
        prevParam.name = user.name
        user.name = updateParam.name
      }
      if (updateParam.email) {
        prevParam.email = user.email
        user.email = updateParam.email
      }
      if (updateParam.password) {
        if (!CommonValidator.validatePassword(updateParam.password)) {
          throw new Error('Invalid password...')
        }

        prevParam.hashedPassword = {
          hashed: user.password,
          salt: user.password2
        }
        const encryptPassword = CommonCrypt.encryptPassword(
          updateParam.password
        )
        user.password = encryptPassword.hashedPassword
        user.password2 = encryptPassword.salt
      }

      await user.save()

      const newToken = User.createAuthToken(
        user.id,
        user.createdAt,
        user.updatedAt
      )
      return {
        user: user,
        newToken: newToken,
        prevParam: prevParam
      }
    } catch (error) {
      logger.error('UpdateByParam', `token=${JSON.stringify(authToken)}`, error)
      return CommonValidator.createErrorMessage(updateParam, error)
    }
  }

  User.parseAuthToken = token => {
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
        id: decoded.id,
        createdAt: decoded.createdAt,
        updatedAt: decoded.updatedAt
      }
    })
    return userData
  }

  return User
}
