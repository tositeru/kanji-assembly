const questionInfos = [
  {
    answers: ['千'],
    hints: ['小学1年生で習います', '○万人と雖も吾往かん'],
    description: '次の線から成る漢字はなんでしょう？簡単です。',
    sentence: '近江の海 夕波千鳥 汝が鳴けば 心もしのに いにしへ思ほゆ',
    novel_year: '',
    title: '万葉集 巻三(266)',
    author: '柿本人麻呂'
  },
  {
    answers: ['何'],
    hints: [
      '小学2年生で習います',
      '酒なくて○の己が桜かな',
      '部首は「にんべん」です'
    ],
    description: '次の線から成る漢字はなんでしょう？ちょっと難しい。',
    sentence: '銀も 金も玉も ○せむに まされる宝 子にしかめやも',
    novel_year: '',
    title: '万葉集 巻五(803)',
    author: '山上憶良'
  },
  {
    answers: ['選'],
    hints: [
      '部首は「しんにょう」です',
      '漢字の中に「共」があります',
      '鳥疲れて枝を○ばず'
    ],
    description:
      '次の線から成る漢字はなんでしょう？難問です。小学2年生で習います。',
    sentence:
      'しかし○科生はその閲覧室で読書することがならないで、廊下に並べてあった机で読書することになっていた。',
    novel_year: '平成8年(1996) ※西田幾多郎随筆集から',
    title: '明治二十四、五年頃の東京文科大学選科',
    author: '西田 幾多郎'
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
      kanji: '千',
      strokes: [18, 16, 17]
    })
    await utils.createKanjiStrokes({
      kanji: '何',
      strokes: [18, 17, 16, 17, 21, 16, 26]
    })
    await utils.createKanjiStrokes({
      kanji: '選',
      strokes: [21, 16, 31, 21, 16, 31, 16, 17, 17, 16, 18, 20, 20, 11, 15]
    })
  }
}
