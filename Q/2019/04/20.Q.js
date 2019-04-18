const questionInfos = [
  {
    answers: ['寸'],
    hints: ['小学6年生で習います', '蛇は○にして人を呑む'],
    description: '次の線から成る漢字はなんでしょう？簡単です。',
    sentence: '一○法師はチョコチョコと小刻みに、存外早く歩いた。',
    novel_year: '大正15年(1926)',
    title: '一○法師',
    author: '江戸川 乱歩'
  },
  {
    answers: ['妹'],
    hints: [
      '小学2年生で習います',
      '姉は菅笠、○とは日傘',
      '部首は「おんなへん」です'
    ],
    description: '次の線から成る漢字はなんでしょう？ちょっと難しい。',
    sentence: 'たけばぬれ たかねば長き 妹が 髪このころ見ぬに 掻き入れつらむか',
    novel_year: '',
    title: '万葉集 巻二(123)',
    author: '三方沙弥'
  },
  {
    answers: ['鱈'],
    hints: [
      '部首は「うおへん」です',
      '漢字の中に「共」があります',
      '○汁と雪道は後が良い'
    ],
    description:
      '次の線から成る漢字はなんでしょう？難問です。漢字検定準1級の国字である漢字です。',
    sentence:
      '「ところが書いてある事実を見ますと、トテモ出○目とは思えない記述ばかりが出て来るのです」',
    novel_year: '昭和10年(1935)',
    title: 'ドグラ・マグラ',
    author: '夢野 久作'
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
      kanji: '寸',
      strokes: [16, 26, 20]
    })
    await utils.createKanjiStrokes({
      kanji: '妹',
      strokes: [27, 18, 16, 16, 16, 17, 18, 15]
    })
    await utils.createKanjiStrokes({
      kanji: '鱈',
      strokes: [
        18,
        7,
        17,
        21,
        16,
        17,
        16,
        18,
        20,
        20,
        20,
        16,
        18,
        7,
        17,
        20,
        20,
        20,
        20,
        21,
        16,
        16
      ]
    })
  }
}
