const moment = require('moment-timezone')

module.exports = {
  /**
   * データ更新
   * @param {object} database db/database.jsからインポートしたもの
   * @param {object} utils 便利関数を集めたもの
   */
  async run(database, utils) {
    const date = __filename.match(/(\d{4})\/(\d{2})\/(\d{2})/)
    // 問題追加
    await utils.createQuestion({
      date: moment
        .tz(`${date[1]}-${date[2]}-${date[3]} 00:00:00`, 'Asia/Tokyo')
        .format(),
      dateId: 0,
      type: 1,
      description: '次の線から成る漢字はなんでしょう？',
      answers: ['川'],
      hints: ['世界中にあります', '○の字に寝る', '魚が泳いでいます']
    })

    // 漢字を追加
    await utils.createKanjiStrokes({
      kanji: '川',
      strokes: [19, 17, 17]
    })
  }
}