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
      answers: ['夕'],
      hints: ['小学一年生で習います', '一朝一○']
    })
    await utils.createQuestion({
      date: date,
      dateId: 1,
      type: 1,
      description: '次の線から成る漢字はなんでしょう？ちょっと難しい。',
      answers: ['和'],
      hints: ['優しい漢字です', '部首は「くちへん」です', '○を以て貴しとなす']
    })
    await utils.createQuestion({
      date: date,
      dateId: 2,
      type: 1,
      description: '次の線から成る漢字はなんでしょう？難問です。',
      answers: ['整'],
      hints: [
        '小学3年生で習います',
        '3つのパーツから成ります。※パーツのことを偏旁と呼びます',
        '「正」が漢字の中にあります',
        '部首は「ぼくにょう・とまた」です'
      ]
    })

    // 漢字を追加
    await utils.createKanjiStrokes({
      kanji: '夕',
      strokes: [18, 7, 20]
    })
    await utils.createKanjiStrokes({
      kanji: '和',
      strokes: [18, 16, 17, 18, 15, 17, 21, 16]
    })
    await utils.createKanjiStrokes({
      kanji: '整',
      strokes: [16, 17, 21, 16, 17, 18, 15, 18, 16, 18, 15, 16, 17, 16, 17, 16]
    })
  }
}
