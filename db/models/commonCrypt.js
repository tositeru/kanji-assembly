'use strict'
const crypto = require('crypto')

module.exports = {
  encryptPassword(password, salt = null) {
    if (!salt) {
      salt = crypto.randomBytes(16).toString('hex')
    }
    const hashedPassword = crypto.pbkdf2Sync(
      password,
      salt,
      1000,
      512,
      'sha512'
    )
    return {
      hashedPassword: hashedPassword,
      salt: salt
    }
  }
}
