'use strict'
const Sequelize = require('sequelize')

module.exports = {
  TABLE_DEFINETION: {
    name: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
      validate: {
        len: [3, 64]
      }
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    password2: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
        max: 255
      }
    },
    token: {
      type: Sequelize.STRING,
      allowNull: false,
      isUUID: 4
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }
}
