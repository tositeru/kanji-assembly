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
      description: '次の線から成る漢字はなんでしょう？簡単な漢字です。',
      answers: ['心'],
      hints: ['特徴的な形です', '○技体']
    })

    await utils.createQuestion({
      date: date,
      dateId: 1,
      type: 1,
      description: '次の線から成る漢字はなんでしょう？ちょっと難しめ。',
      answers: ['高'],
      hints: [
        '小学2年生のときに習います',
        '赤ちゃんをあやすときに行います',
        '○が知れる'
      ]
    })

    await utils.createQuestion({
      date: date,
      dateId: 2,
      type: 1,
      description: '次の線から成る漢字はなんでしょう？難問。',
      answers: ['競'],
      hints: [
        '小学4年生のときに習います',
        '同じような形が2つあります',
        '南風○わず'
      ]
    })

    // 漢字を追加
    await utils.createKanjiStrokes({
      kanji: '心',
      strokes: [18, 3, 20, 20]
    })
    await utils.createKanjiStrokes({
      kanji: '高',
      strokes: [17, 16, 17, 21, 16, 17, 6, 17, 21, 16]
    })
    await utils.createKanjiStrokes({
      kanji: '競',
      strokes: [
        17,
        16,
        17,
        17,
        16,
        17,
        21,
        16,
        18,
        25,
        17,
        16,
        17,
        17,
        16,
        17,
        21,
        16,
        18,
        31
      ]
    })
  }
}
