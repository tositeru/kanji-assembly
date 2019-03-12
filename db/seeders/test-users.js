'use strict'

const moment = require('moment')
const uuid = require('uuid/v4')
const CommonCrypt = require('../models/commonCrypt')

function makeUser(name, email, password) {
  const encryptPassword = CommonCrypt.encryptPassword(password)
  return {
    id: uuid(),
    name: name,
    email: email,
    password: encryptPassword.hashedPassword,
    password2: encryptPassword.salt,
    status: 1,
    createdAt: moment().toISOString(),
    updatedAt: moment().toISOString()
  }
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      makeUser('Apple', 'apple@mail.com', 'appleapple'),
      makeUser('Banana', 'banana@mail.com', 'bananabanana'),
      makeUser('Cherry', 'cherry@mail.com', 'cherrycherry'),
      makeUser('Daikon', 'daikon@mail.com', 'daikondaikon'),
      makeUser('Eggplant', 'eggplant@mail.com', 'eggplanteggplant')
    ])
  },

  down: (queryInterface, Sequelize) => {
    return new Promise((resolve, reject) => {
      return queryInterface.bulkDelete('Users', null, {})
    })
  }
}
