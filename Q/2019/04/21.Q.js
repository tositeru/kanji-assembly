const questionInfos = [
  {
    answers: ['山'],
    hints: ['小学1年生で習います', '海に千年○に千年'],
    description: '次の線から成る漢字はなんでしょう？簡単です。',
    sentence: '笹の葉は み○もさやに さやげども 我れは妹思ふ 別れ来ぬれば',
    novel_year: '',
    title: '万葉集 巻二(133)',
    author: '柿本人麻呂'
  },
  {
    answers: ['知'],
    hints: ['小学2年生で習います', '瀬を踏んで淵を○る', '部首は「やへん」です'],
    description: '次の線から成る漢字はなんでしょう？ちょっと難しい。',
    sentence:
      'だが、恐いもの○らずの智深である。また、かつて一度でも不覚をとったためしはない。',
    novel_year: '昭和33年(1958)',
    title: '新・水滸伝',
    author: '吉川 英治'
  },
  {
    answers: ['確'],
    hints: [
      '部首は「いしへん」です',
      '漢字の中に「隹(ふるとり)」があります',
      '○乎不動'
    ],
    description:
      '次の線から成る漢字はなんでしょう？難問です。小学5年生で習います。',
    sentence:
      '「○認のために年齢を訊くけど、いま高村さんは三十歳だったね」「そうです」',
    novel_year: '平成9年(1997)',
    title: '道順は彼女に訊く',
    author: '片岡 義男'
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
      kanji: '山',
      strokes: [17, 23, 17]
    })
    await utils.createKanjiStrokes({
      kanji: '知',
      strokes: [18, 16, 16, 18, 20, 17, 21, 16]
    })
    await utils.createKanjiStrokes({
      kanji: '確',
      strokes: [16, 18, 17, 21, 16, 17, 22, 18, 17, 18, 16, 17, 16, 16, 16]
    })
  }
}
