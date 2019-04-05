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
      description: `次の線から成る漢字はなんでしょう？簡単です。
      「こういう出来事のあったのは西暦九□二年で、わが朝の村上天皇の御宇に当っている。」
      昭和17年(1942) ローマ法王と外交 国枝 史郎`,
      answers: ['六'],
      hints: ['小学一年生で習います', '数字です']
    })
    await utils.createQuestion({
      date: date,
      dateId: 1,
      type: 1,
      description: `次の線から成る漢字はなんでしょう？ちょっと難しい。
      「啻に故の我なるのみでは無い、予はその後も学んでいて、その進○は破鼈の行くが如きながらも、一日を過ぎれば一日の長を得て居る。」
      明治33年(1900) 鴎外漁史とは誰ぞ 	森 鴎外`,
      answers: ['歩'],
      hints: [
        '多くの人々が日常的に行っています',
        '部首は「とめる」です',
        '五十○百○'
      ]
    })
    await utils.createQuestion({
      date: date,
      dateId: 2,
      type: 1,
      description: `次の線から成る漢字はなんでしょう？難問です。魚の一種です。
      「鮭と○の境界が厳密でないため、国により区分方法が異なる。」
      平成31年(2019) 4月 Wikipediaから`,
      answers: ['鱒'],
      hints: [
        '部首は「さかなへん」です',
        '漢字の中に「寸」があります',
        '鮭とよく似ている魚です'
      ]
    })

    // 漢字を追加
    await utils.createKanjiStrokes({
      kanji: '六',
      strokes: [17, 16, 18, 20]
    })
    await utils.createKanjiStrokes({
      kanji: '歩',
      strokes: [17, 16, 17, 16, 26, 18, 20, 18]
    })
    await utils.createKanjiStrokes({
      kanji: '鱒',
      strokes: [
        18,
        7,
        17,
        21,
        17,
        16,
        16,
        18,
        20,
        20,
        20,
        20,
        18,
        16,
        17,
        21,
        19,
        31,
        16,
        16,
        16,
        26,
        20
      ]
    })
  }
}
