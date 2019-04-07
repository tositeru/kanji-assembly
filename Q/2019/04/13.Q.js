const questionInfos = [
  {
    answers: ['久'],
    hints: ['小学5年生で習います', '驕る平家は○しからず'],
    description: '次の線から成る漢字はなんでしょう？簡単です。',
    sentence: '「何でがすい。」と、何も知らず、○助は墓の羽織を、もう一撫で。',
    novel_year: '昭和15年(1940)',
    title: '縷紅新草',
    author: '泉 鏡花'
  },
  {
    answers: ['草'],
    hints: [
      '小学1年生で習います',
      '○を打って蛇を驚かす',
      '部首は「くさかんむり」です'
    ],
    description: '次の線から成る漢字はなんでしょう？ちょっと難しい。',
    sentence:
      'その時まで、沼の水面を隠してゐる水○がなんといふ名前であるのか、修吉は知らなかつた。',
    novel_year: '昭和14年(1939)',
    title: '木々の精、谷の精',
    author: '坂口 安吾'
  },
  {
    answers: ['露'],
    hints: [
      '部首は「あまかんむり」です',
      '漢字の中に「各」があります',
      '酔い醒めの水は甘○の味'
    ],
    description:
      '次の線から成る漢字はなんでしょう？難問です。漢字検定4級の漢字です。',
    sentence:
      '友人等の堕落が○骨で、率直で、男らしいなら、私の堕落は……ああ、何と言おう？',
    novel_year: '明治40年(1907)',
    title: '平凡',
    author: '二葉亭 四迷'
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
      kanji: '久',
      strokes: [18, 7, 15]
    })
    await utils.createKanjiStrokes({
      kanji: '草',
      strokes: [16, 17, 17, 17, 21, 16, 16, 16, 17]
    })
    await utils.createKanjiStrokes({
      kanji: '露',
      strokes: [
        16,
        17,
        22,
        17,
        20,
        20,
        20,
        20,
        17,
        21,
        16,
        17,
        16,
        17,
        16,
        18,
        7,
        15,
        17,
        21,
        16
      ]
    })
  }
}
