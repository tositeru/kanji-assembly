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
    level: {
      allowNull: false,
      type: Sequelize.TINYINT
    },
    text: {
      type: Sequelize.TEXT
    },
    opened: {
      type: Sequelize.TINYINT,
      defaultValue: 0
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
