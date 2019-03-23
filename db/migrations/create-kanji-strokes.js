'use strict'
const { TABLE_DEFINETION } = require('../tables/kanji-strokes.js')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('KanjiStrokes', TABLE_DEFINETION)
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('KanjiStrokes')
  }
}
