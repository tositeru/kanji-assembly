const questionInfos = [
  {
    answers: ['才'],
    hints: ['小学2年生で習います', '柳絮の○'],
    description: '次の線から成る漢字はなんでしょう？簡単です。',
    sentence: '「そんな事は、なんでもない。」○之助は、すでに騎虎の勢ひである。',
    novel_year: '昭和16年(1941)',
    title: '清貧譚',
    author: '太宰 治'
  },
  {
    answers: ['科'],
    hints: [
      '小学2年生で習います',
      '皿嘗めた猫が○を負う',
      '部首は「のぎへん」です'
    ],
    description: '次の線から成る漢字はなんでしょう？ちょっと難しい。',
    sentence:
      '○学は現実を対象的に考察する。しかるに現実が足下から揺ぎ出すのを覚えるとき、基底の危機というものから哲学は生れてくる。',
    novel_year: '昭和15年(1940)',
    title: '哲学入門',
    author: '三木 清'
  },
  {
    answers: ['聴'],
    hints: ['部首は「みみへん」です', '漢字の中に「心」があります', '反○内視'],
    description:
      '次の線から成る漢字はなんでしょう？難問です。漢字検定3級の漢字です。',
    sentence:
      '私はその喧しい唸り声の中に『今に――座が焼けているんだ』そんな言葉をハッキリ○きとることが出来るのでございます',
    novel_year: '昭和9年(1934)',
    title: '幻○',
    author: '蘭 郁二郎'
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
      kanji: '才',
      strokes: [16, 26, 18]
    })
    await utils.createKanjiStrokes({
      kanji: '科',
      strokes: [18, 16, 17, 18, 20, 20, 20, 16, 17]
    })
    await utils.createKanjiStrokes({
      kanji: '聴',
      strokes: [
        16,
        17,
        16,
        16,
        16,
        17,
        16,
        17,
        16,
        21,
        17,
        17,
        16,
        18,
        3,
        20,
        20
      ]
    })
  }
}
