'use strict'

const crypto = require('crypto')
const moment = require('moment')
const { TABLE_DEFINETION } = require('../tables/reset-password-users.js')
const Logger = require('../../src/log')

const logger = new Logger('DB ResetPasswordUser', 'debug')

function expirationTime() {
  return moment().subtract(10, 'minutes')
}

module.exports = (sequelize, DataTypes) => {
  const ResetPasswordUsers = sequelize.define(
    'ResetPasswordUsers',
    TABLE_DEFINETION,
    {
      getterMethods: {
        email() {
          return this.getDataValue(`email`)
        },
        token() {
          return this.getDataValue(`token`)
        }
      }
    }
  )

  ResetPasswordUsers.associate = function(models) {
    // associations can be defined here
  }

  ResetPasswordUsers.add = async email => {
    try {
      const token = crypto.randomBytes(64).toString('hex')
      await ResetPasswordUsers.upsert({
        email: email,
        token: token
      })

      logger.info('Add', `email=${email},token=${token}`)
      return token
    } catch (error) {
      logger.error('Add', `email=${email}`, '')
      return false
    }
  }

  ResetPasswordUsers.isValidToken = async token => {
    const expirationDate = expirationTime()
    const resetPassword = await ResetPasswordUsers.findOne({
      where: {
        token: token,
        updatedAt: {
          $gte: expirationDate.toISOString()
        }
      }
    })
    if (!resetPassword) {
      return null
    }

    await resetPassword.destroy()
    logger.error('isValidToken', `token=${token},email=${resetPassword.email}`)
    return resetPassword.email
  }

  return ResetPasswordUsers
}
