'use strict'
const fs = require('fs')
const path = require('path')
const consola = require('consola')
const jwt = require('jsonwebtoken')
const uuid = require('uuid/v4')
const CommonCrypt = require('./commonCrypt')

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      name: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          len: [3, 64]
        }
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          isEmail: true,
          max: 255
        }
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          min: 8
        }
      },
      password2: {
        // salt
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          min: 8
        }
      },
      status: {
        allowNull: false,
        type: DataTypes.TINYINT,
        defaultValue: 0
      }
    },
    {
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
    }
  )
  User.associate = function(models) {
    // associations can be defined here
  }

  User.STATUS_LOCKED = 0
  User.STATUS_LOGOUT = 1
  User.STATUS_LOGIN = 2
  User.STATUS_CHANGE_PASAWORD = 3

  User.isExist = async function(name, email) {
    const where = {}
    if (name) {
      where.name = name
    }
    if (email) {
      where.email = email
    }
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

  User.login = async function(email, password) {
    try {
      const user = await User.findOne({
        where: {
          email: email
        }
      })
      const encryptPassword = CommonCrypt.encryptPassword(
        password,
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
        algorithm: 'RS256',
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

      user.setDataValue('status', User.STATUS_LOGOUT)
      await user.save()

      return true
    } catch (error) {
      consola.error('Not Found user at logout...', error)
      return false
    }
  }

  User.validateAuthToken = token => {
    let userData = null
    const options = {
      algorithms: ['RS256'],
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
