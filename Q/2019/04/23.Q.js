const questionInfos = [
  {
    answers: ['七'],
    hints: ['小学1年生で習います', '○度尋ねて人を疑え'],
    description: '次の線から成る漢字はなんでしょう？簡単です。',
    sentence:
      'その夢は「一話一言」と同じように、八百屋お○が鶏になったのである。首だけは可憐の少女で、形は鶏であった。',
    novel_year: '昭和63年(1988)',
    title: '夢のお○',
    author: '岡本 綺堂'
  },
  {
    answers: ['玉'],
    hints: ['小学1年生で習います', '○の杯、底なきが如し', '部首は「おう」です'],
    description: '次の線から成る漢字はなんでしょう？ちょっと難しい。',
    sentence: '信濃なる 筑摩の川の 細石も 君し踏みてば ○と拾はむ',
    novel_year: '',
    title: '万葉集 巻十四(3400)',
    author: '東歌(信濃)'
  },
  {
    answers: ['歌'],
    hints: [
      '部首は「かける」です',
      '漢字の中に他の同じ漢字が二つあります',
      '○人は居ながらにして名所を知る'
    ],
    description:
      '次の線から成る漢字はなんでしょう？難問です。小学3年生で習います。',
    sentence:
      '「和○子さんは己のものだ！　どうしたって己のものだ！　自分と和○子さんとは、そんな今日や昨日のことではないのだ！」',
    novel_year: '大正８年(1919)',
    title: '地上 地に潜むもの',
    author: '島田 清次郎'
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
      kanji: '七',
      strokes: [16, 23]
    })
    await utils.createKanjiStrokes({
      kanji: '玉',
      strokes: [16, 17, 16, 16, 20]
    })
    await utils.createKanjiStrokes({
      kanji: '歌',
      strokes: [16, 17, 21, 16, 17, 16, 17, 21, 16, 26, 18, 22, 18, 15]
    })
  }
}
