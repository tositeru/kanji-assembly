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
    kanji: {
      type: Sequelize.CHAR(1)
    },
    stroke_kind: {
      type: Sequelize.TINYINT
    },
    stroke_no: {
      type: Sequelize.TINYINT
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
