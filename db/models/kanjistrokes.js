'use strict'
module.exports = (sequelize, DataTypes) => {
  const KanjiStrokes = sequelize.define(
    'KanjiStrokes',
    {
      kanji: DataTypes.CHAR,
      stroke_kind: DataTypes.TINYINT,
      stroke_no: DataTypes.TINYINT
    },
    {}
  )
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
      return strokes
    } catch (error) {
      return null
    }
  }

  return KanjiStrokes
}
