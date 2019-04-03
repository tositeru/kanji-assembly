const moment = require('moment-timezone')

module.exports = {
  /**
   * データ更新
   * @param {object} database db/database.jsからインポートしたもの
   * @param {object} utils 便利関数を集めたもの
   */
  async run(database, utils) {
    // 問題追加
    await utils.createQuestion({
      date: moment.tz('2019-04-03 00:00:00', 'Asia/Tokyo').format(),
      dateId: 0,
      type: 1,
      description: '次の線から成る漢字はなんでしょう？',
      answers: ['心'],
      hints: ['特徴的な形です', '○技体']
    })

    // 漢字を追加
    await utils.createKanjiStrokes({
      kanji: '心',
      strokes: [18, 3, 20, 20]
    })
  }
}
