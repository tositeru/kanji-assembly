const questionInfos = [
  {
    answers: ['六'],
    hints: ['小学一年生で習います', '数字です'],
    description: '次の線から成る漢字はなんでしょう？簡単です。',
    sentence:
      'こういう出来事のあったのは西暦九□二年で、わが朝の村上天皇の御宇に当っている。',
    novel_year: '昭和17年(1942)',
    title: 'ローマ法王と外交',
    author: '国枝 史郎'
  },
  {
    answers: ['歩'],
    hints: [
      '多くの人々が日常的に行っています',
      '部首は「とめる」です',
      '五十○百○'
    ],
    description: '次の線から成る漢字はなんでしょう？ちょっと難しい。',
    sentence:
      '啻に故の我なるのみでは無い、予はその後も学んでいて、その進○は破鼈の行くが如きながらも、一日を過ぎれば一日の長を得て居る。',
    novel_year: '明治33年(1900)',
    title: '鴎外漁史とは誰ぞ',
    author: '森 鴎外'
  },
  {
    answers: ['鱒'],
    hints: [
      '部首は「さかなへん」です',
      '漢字の中に「寸」があります',
      '鮭とよく似ている魚です'
    ],
    description: '次の線から成る漢字はなんでしょう？難問です。魚の一種です。',
    sentence: '鮭と○の境界が厳密でないため、国により区分方法が異なる。',
    novel_year: '平成31年(2019) 4月',
    title: 'Wikipediaから',
    author: ''
  }
]

module.exports = {
  infos: questionInfos,
  /**
   * データ更新
   * @param {object} database db/database.jsからインポートしたもの
   * @param {object} utils 便利関数を集めたもの
   */
  async run(database, utils) {
    const date = utils.getDate(__filename)
    for (const index in questionInfos) {
      const q = questionInfos[index]
      await utils.createQuestion({
        date: date,
        dateId: index,
        type: 1,
        description: `${q.description}
        「${q.sentence}」
        ${q.novel_year} ${q.title} ${q.author}`,
        answers: q.answers,
        hints: q.hints
      })
    }
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
