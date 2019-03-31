'use strict'
const { TABLE_DEFINETION } = require('../tables/kanji-strokes.js')
const Logger = require('../../src/log')

const logger = new Logger('DB KanjiStrokes')

module.exports = (sequelize, DataTypes) => {
  const KanjiStrokes = sequelize.define('KanjiStrokes', TABLE_DEFINETION, {})
  KanjiStrokes.associate = function(models) {
    // associations can be defined here
  }

  KanjiStrokes.getByKanji = async kanji => {
    try {
      const strokes = await KanjiStrokes.findAll({
        attributes: ['stroke_kind', 'stroke_no'],
        where: {
          kanji: kanji
        },
        order: [['stroke_no', 'DESC']]
      })
      logger.info('getByKanji', `kanji=${kanji}`)
      return strokes
    } catch (error) {
      logger.error('getByKanji', `kanji=${kanji}`, error)
      return null
    }
  }

  return KanjiStrokes
}
