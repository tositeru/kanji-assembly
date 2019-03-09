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
        len: [3, 255]
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
      return token
    } catch (error) {
      consola.error(error)
      return false
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
