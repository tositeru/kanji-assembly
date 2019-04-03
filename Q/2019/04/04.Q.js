module.exports = {
  /**
   * データ更新
   * @param {object} database db/database.jsからインポートしたもの
   * @param {object} utils 便利関数を集めたもの
   */
  async run(database, utils) {
    const date = utils.getDate(__filename)
    // 問題追加
    await utils.createQuestion({
      date: date,
      dateId: 0,
      type: 1,
      description: '次の線から成る漢字はなんでしょう？簡単です。',
      answers: ['川'],
      hints: ['世界中にあります', '○の字に寝る', '魚が泳いでいます']
    })
    await utils.createQuestion({
      date: date,
      dateId: 1,
      type: 1,
      description: '次の線から成る漢字はなんでしょう？ちょっと難しい。',
      answers: ['秋'],
      hints: ['国によってはない所もあります', '○の扇', '部首は「のぎへん」です']
    })
    await utils.createQuestion({
      date: date,
      dateId: 2,
      type: 1,
      description: '次の線から成る漢字はなんでしょう？難問です。',
      answers: ['築'],
      hints: [
        '「木」が漢字の中にあります',
        '部首は「たけかんむり」です',
        '蒟蒻で石垣を○く'
      ]
    })

    // 漢字を追加
    await utils.createKanjiStrokes({
      kanji: '川',
      strokes: [19, 17, 17]
    })
    await utils.createKanjiStrokes({
      kanji: '秋',
      strokes: [18, 16, 17, 18, 15, 20, 18, 19, 15]
    })
    await utils.createKanjiStrokes({
      kanji: '築',
      strokes: [18, 16, 20, 18, 16, 20, 16, 17, 16, 19, 8, 20, 16, 17, 18, 15]
    })
  }
}
