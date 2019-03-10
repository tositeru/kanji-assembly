'use strict'
const consola = require('consola')

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      name: {
        type: DataTypes.STRING,
        validate: {
          len: [3, 64]
        }
      },
      email: {
        type: DataTypes.STRING,
        validate: {
          isEmail: true,
          max: 255
        }
      },
      password: {
        type: DataTypes.STRING,
        validate: {
          min: 8
        }
      },
      password2: {
        type: DataTypes.STRING,
        validate: {
          min: 8
        }
      },
      status: {
        type: DataTypes.TINYINT,
        defaultValue: 0
      }
    },
    {}
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
      where: where
    })
    return count > 0
  }

  User.add = async function(userInfo) {
    if (await User.isExist(userInfo.name, userInfo.email)) {
      consola.error('Failed to add user because the user already exists...')
      return null
    }
    try {
      const user = await User.create({
        name: userInfo.name,
        email: userInfo.email,
        password: userInfo.password,
        password2: userInfo.password2,
        status: User.STATUS_LOGIN
      })
      return user
    } catch (error) {
      consola.error('Failed to add User...', error)
      return null
    }
  }
  return User
}
