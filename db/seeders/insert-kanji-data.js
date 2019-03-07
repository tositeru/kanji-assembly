'use strict'
const moment = require('moment')

function appendTimestamp(obj) {
  obj.createdAt = moment().toISOString()
  obj.updatedAt = moment().toISOString()
  return obj
}

function makeKanjiStrokes(kanji, strokes) {
  const data = []
  strokes.forEach((stroke, index) => {
    const s = {
      kanji: kanji,
      stroke_kind: stroke,
      stroke_no: index
    }
    data.push(appendTimestamp(s))
  })
  return data
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    const list = [
      ...makeKanjiStrokes('日', [17, 21, 16, 16]),
      ...makeKanjiStrokes('月', [19, 6, 16, 16]),
      ...makeKanjiStrokes('火', [20, 18, 19, 15]),
      ...makeKanjiStrokes('水', [26, 7, 18, 15]),
      ...makeKanjiStrokes('木', [16, 17, 18, 15]),
      ...makeKanjiStrokes('金', [18, 15, 16, 16, 17, 20, 18, 16]),
      ...makeKanjiStrokes('土', [16, 17, 16])
    ]
    return queryInterface.bulkInsert('KanjiStrokes', list)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('KanjiStrokes', null, {})
  }
}
