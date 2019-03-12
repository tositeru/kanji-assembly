'use strict'
const Sequelize = require('sequelize')

module.exports = {
  TABLE_DEFINETION: {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    question_id: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    description: {
      allowNull: false,
      type: Sequelize.TEXT
    },
    answers: {
      allowNull: false,
      type: Sequelize.STRING
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
