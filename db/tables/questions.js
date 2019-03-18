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
    show_date: {
      allowNull: false,
      type: Sequelize.DATEONLY
    },
    date_id: {
      allowNull: false,
      type: Sequelize.TINYINT
    },
    type: {
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
    }
  }
}
