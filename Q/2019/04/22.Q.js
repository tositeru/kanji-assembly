const questionInfos = [
  {
    answers: ['日'],
    hints: ['小学1年生で習います', '明○ありと思う心の仇桜'],
    description: '次の線から成る漢字はなんでしょう？簡単です。',
    sentence: '○並の 皇子の命の 馬並めて み狩り立たしし 時は来向ふ',
    novel_year: '',
    title: '万葉集 巻一(49)',
    author: '柿本人麻呂'
  },
  {
    answers: ['計'],
    hints: [
      '小学2年生で習います',
      '日○足らずして歳○余りあり',
      '部首は「ごんべん」です'
    ],
    description:
      '次の線から成る漢字はなんでしょう？ちょっと難しい。ちなみに「時○」という単語は「正二くんの時○」の中に39個出てきます。',
    sentence:
      'これを聞くと、正二くんは、お父さんのもとへ飛んでいきました。「お父さん、僕に、大きな時○をおくれよ。」',
    novel_year: '昭和15年(1940)',
    title: '正二くんの時○',
    author: '小川 未明'
  },
  {
    answers: ['談'],
    hints: [
      '部首は「ごんべん」です',
      '漢字の中に他の同じ漢字が二つあります',
      '冗○から駒が出る'
    ],
    description:
      '次の線から成る漢字はなんでしょう？難問です。小学3年生で習います。',
    sentence:
      '「… ドーすればよいかと、頭脳を痛めていますが、妙薬更になしです」云々という聴くも気の毒の悲哀○、次は乙のゾッキ屋主人',
    novel_year: '昭和3年(1928)',
    title: '一円本流行の害毒と其裏面○',
    author: '宮武 外骨'
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
      kanji: '日',
      strokes: [17, 21, 16, 16]
    })
    await utils.createKanjiStrokes({
      kanji: '計',
      strokes: [20, 16, 16, 16, 17, 21, 16, 16, 17]
    })
    await utils.createKanjiStrokes({
      kanji: '談',
      strokes: [20, 16, 16, 16, 17, 21, 16, 20, 18, 18, 15, 20, 18, 18, 15]
    })
  }
}
