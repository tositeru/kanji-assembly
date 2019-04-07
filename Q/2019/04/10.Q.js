const questionInfos = [
  {
    answers: ['内'],
    hints: ['小学二年生で習います', '○兜を見透かす'],
    description: '次の線から成る漢字はなんでしょう？簡単です。',
    sentence:
      'つぎつぎに死んでゆく夥しい負傷者の中にまじつて、私はあの境○で野宿したのだつた。',
    novel_year: '昭和22年(1947)',
    title: '廃墟から',
    author: '原 民喜'
  },
  {
    answers: ['貨'],
    hints: ['小学4年生で習います', '奇○可居', '部首は「かいへん」です'],
    description: '次の線から成る漢字はなんでしょう？ちょっと難しい。',
    sentence:
      'こんなこともあろうかと思って、杉田は腰にさげてきた巾着から、五十銭銀○を六枚だして、料理人の掌にのせてやった。',
    novel_year: '昭和13年(1938)',
    title: '浮かぶ飛行島',
    author: '海野 十三'
  },
  {
    answers: ['親'],
    hints: [
      '部首は「みる」です',
      '漢字の中に「木」があります',
      '○と月夜はいつも良い'
    ],
    description:
      '次の線から成る漢字はなんでしょう？難問です。小学2年生で習います。',
    sentence:
      'おとなしい百歳の家族は、さう云ふ乱暴な遊び方をする客に対してはたヾ恐怖を感ずるばかりで、少しも○しめなかった。',
    novel_year: '大正11年(1926)',
    title: '奥間巡査',
    author: '池宮城 積宝'
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
    // 問題追加
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
      kanji: '内',
      strokes: [17, 6, 18, 20]
    })
    await utils.createKanjiStrokes({
      kanji: '貨',
      strokes: [18, 17, 18, 31, 17, 21, 16, 16, 16, 18, 20]
    })
    await utils.createKanjiStrokes({
      kanji: '親',
      strokes: [17, 16, 17, 17, 16, 16, 17, 18, 20, 17, 21, 17, 17, 17, 18, 31]
    })
  }
}
