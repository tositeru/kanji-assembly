const questionInfos = [
  {
    answers: ['立'],
    hints: ['小学1年生で習います', '見つめる鍋は煮○たない'],
    description: '次の線から成る漢字はなんでしょう？簡単です。',
    sentence: 'あしひきの 山川の瀬の 鳴るなへに 弓月が岳に 雲○ち渡る',
    novel_year: '',
    title: '万葉集 巻七(1088)',
    author: '柿本人麻呂'
  },
  {
    answers: ['花'],
    hints: [
      '小学1年生で習います',
      '女寡に○が咲く',
      '部首は「くさかんむり」です'
    ],
    description: '次の線から成る漢字はなんでしょう？ちょっと難しい。',
    sentence: 'もののふの 八十娘子らが 汲み乱ふ 寺井の上の 堅香子の○',
    novel_year: '',
    title: '万葉集 巻十九(4143)',
    author: '大伴家持'
  },
  {
    answers: ['紫'],
    hints: [
      '部首は「いとへん」です',
      '漢字の中に「止」があります',
      '○の朱を奪う'
    ],
    description:
      '次の線から成る漢字はなんでしょう？難問です。漢字検定4級の漢字です。',
    sentence: '○は 灰さすものそ 海石榴市の 八十の衢に 逢へる子や誰',
    novel_year: '',
    title: '万葉集 巻十二(3101)',
    author: '作者不明'
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
      kanji: '立',
      strokes: [17, 16, 17, 17, 16]
    })
    await utils.createKanjiStrokes({
      kanji: '花',
      strokes: [16, 17, 17, 18, 17, 18, 31]
    })
    await utils.createKanjiStrokes({
      kanji: '紫',
      strokes: [17, 16, 17, 0, 18, 31, 27, 28, 20, 17, 18, 20]
    })
  }
}
