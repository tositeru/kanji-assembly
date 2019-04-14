const questionInfos = [
  {
    answers: ['己'],
    hints: ['小学6年生で習います', '○の頭の蠅を追え'],
    description: '次の線から成る漢字はなんでしょう？簡単です。',
    sentence:
      '口惜しいくやしい口惜しい口惜しい、長吉め文次め丑松め、なぜ○れを殺さぬ、殺さぬか、○れも三五郎だ唯死ぬものか、',
    novel_year: '明治28年(1895)',
    title: 'たけくらべ',
    author: '樋口 一葉'
  },
  {
    answers: ['転'],
    hints: [
      '小学3年生で習います',
      '有為○変は世の習い',
      '部首は「くるまへん」です'
    ],
    description: '次の線から成る漢字はなんでしょう？ちょっと難しい。',
    sentence:
      'ああ吾事休矣いくらしがみついても車は半輪○もしないああ吾事休矣としきりに感投詞を繰り返して暗に助勢を嘆願する',
    novel_year: '昭和15年(1940)',
    title: '自○車日記',
    author: '夏目 漱石'
  },
  {
    answers: ['躍'],
    hints: [
      '部首は「あしへん」です',
      '漢字の中に「ヨ」が二つあります',
      '冶金踊○'
    ],
    description:
      '次の線から成る漢字はなんでしょう？難問です。漢字検定4級の漢字です。',
    sentence:
      '東京へ帰ってからも、どんなにこの姉妹の俤が、眼の前に○って離れなかったか知れません。',
    novel_year: '昭和31年(1956)',
    title: '墓が呼んでいる',
    author: '橘 外男'
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
      kanji: '己',
      strokes: [21, 16, 31]
    })
    await utils.createKanjiStrokes({
      kanji: '転',
      strokes: [16, 17, 21, 16, 16, 16, 17, 16, 16, 28, 20]
    })
    await utils.createKanjiStrokes({
      kanji: '躍',
      strokes: [
        17,
        21,
        16,
        17,
        16,
        17,
        0,
        21,
        16,
        16,
        21,
        16,
        16,
        18,
        17,
        18,
        16,
        17,
        16,
        16,
        16
      ]
    })
  }
}
