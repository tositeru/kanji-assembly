const questionInfos = [
  {
    answers: ['文'],
    hints: ['小学1年生で習います', '朝起きは三○の徳'],
    description: '次の線から成る漢字はなんでしょう？簡単です。',
    sentence:
      '黒人の伝は審でないが、持統○武両朝に仕えたから、大体柿本人麿と同時代である。',
    novel_year: '昭和13年(1938)',
    title: '万葉秀歌',
    author: '斎藤茂吉'
  },
  {
    answers: ['回'],
    hints: ['小学6年生で習います', '朝○紊乱', '部首は「くにがまえ」です'],
    description: '次の線から成る漢字はなんでしょう？ちょっと難しい。',
    sentence:
      '今、さらに再建非再建論問題の○顧を完うし、兼ねて前説の不備を補うの意味において繰り返す事とした。',
    novel_year: '昭和9年(1934)',
    title: '法隆寺再建非再建論の○顧',
    author: '喜田 貞吉'
  },
  {
    answers: ['憲'],
    hints: [
      '部首は「したごころ」です',
      '漢字の中に「うかんむり」があります',
      '冶金踊○'
    ],
    description:
      '次の線から成る漢字はなんでしょう？難問です。漢字検定4級の漢字です。',
    sentence:
      '第百条　この○法は、公布の日から起算して六箇月を経過した日から、これを施行する。',
    novel_year: '昭和21年(1946)',
    title: '日本国○法',
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
      kanji: '文',
      strokes: [17, 16, 18, 15]
    })
    await utils.createKanjiStrokes({
      kanji: '回',
      strokes: [17, 21, 17, 21, 16, 16]
    })
    await utils.createKanjiStrokes({
      kanji: '憲',
      strokes: [17, 18, 22, 16, 17, 16, 16, 17, 21, 17, 17, 16, 18, 3, 20, 20]
    })
  }
}
