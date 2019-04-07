const questionInfos = [
  {
    answers: ['木'],
    hints: ['小学１年生で習います', '○もと竹うら'],
    description: '次の線から成る漢字はなんでしょう？簡単です。',
    sentence:
      '清も両手の笛を替る替る吹き変えては、○の梢から辷り流れる日光の斑点に顔を染めながら、のろのろとやって来た。',
    novel_year: '昭和44年(1969)',
    title: '比叡',
    author: '横光 利一'
  },
  {
    answers: ['点'],
    hints: ['小学2年生で習います', '○滴、石を穿つ', '部首は「れっか」です'],
    description: '次の線から成る漢字はなんでしょう？ちょっと難しい。',
    sentence:
      'その○につきてはさらに証明をも与えず、自証自明の真理のごとくにあがめ奉りておるのは、一種の拝物教と名づけてよろしい。',
    novel_year: '明治32年(1899)',
    title: '通俗講義 霊魂不滅論',
    author: '井上 円了'
  },
  {
    answers: ['響'],
    hints: [
      '部首は「おとへん」です',
      '漢字の中に2種類の漢字があります',
      '打てば○く'
    ],
    description:
      '次の線から成る漢字はなんでしょう？難問です。漢字検定4級の漢字です。',
    sentence:
      'その反○が再び日本に傳はるに及んで、日本の醫學者も、この問題を眞面目に考へるやうになつた。(一部省略)',
    novel_year: '昭和6年(1931)',
    title: 'ヴィタミン研究の回顧',
    author: '鈴木 梅太郎'
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
      kanji: '木',
      strokes: [16, 17, 18, 15]
    })
    await utils.createKanjiStrokes({
      kanji: '点',
      strokes: [17, 16, 17, 21, 16, 18, 20, 20, 20]
    })
    await utils.createKanjiStrokes({
      kanji: '響',
      strokes: [
        27,
        28,
        18,
        21,
        16,
        16,
        25,
        20,
        22,
        1,
        17,
        17,
        16,
        17,
        17,
        16,
        17,
        21,
        16,
        16
      ]
    })
  }
}
