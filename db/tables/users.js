'use strict'
const Sequelize = require('sequelize')

module.exports = {
  TABLE_DEFINETION: {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUIDV4
    },
    name: {
      allowNull: false,
      type: Sequelize.STRING,
      validate: {
        len: [3, 64]
      }
    },
    email: {
      allowNull: false,
      type: Sequelize.STRING,
      validate: {
        isEmail: true,
        max: 255
      }
    },
    password: {
      allowNull: false,
      type: Sequelize.STRING
    },
    password2: {
      allowNull: false,
      type: Sequelize.STRING
    },
    status: {
      allowNull: false,
      type: Sequelize.TINYINT
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    deletedAt: {
      allowNull: true,
      type: Sequelize.DATE
    }
  }
}
