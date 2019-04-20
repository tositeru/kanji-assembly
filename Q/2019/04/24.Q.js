const questionInfos = [
  {
    answers: ['丸'],
    hints: ['小学2年生で習います', '本○から火を出す'],
    description: '次の線から成る漢字はなんでしょう？簡単です。',
    sentence:
      'しかしそこには自分の頭にある「日曜日の○善」というものが生ずる幻影はなくてむしろ常住な職業的の興味があるばかりである。',
    novel_year: '昭和22年(1947)',
    title: '○善と三越',
    author: '寺田 寅彦'
  },
  {
    answers: ['胃'],
    hints: ['小学4年生で習います', '飲灰洗○', '部首は「にくづき」です'],
    description: '次の線から成る漢字はなんでしょう？ちょっと難しい。',
    sentence:
      'すると例の神経○弱性の主人は必ず眼をさまして次の部屋から飛び出してくる。現にせんだってなどは物指で尻ぺたをひどく叩かれた。',
    novel_year: '明治38年(1905)',
    title: '吾輩は猫である',
    author: '夏目 漱石'
  },
  {
    answers: ['頭'],
    hints: [
      '部首は「おおがい」です',
      '漢字の中に「口」があります',
      '二八月は船○のあぐみ時'
    ],
    description:
      '次の線から成る漢字はなんでしょう？難問です。小学3年生で習います。',
    sentence:
      '一際冴えた月の明りに、少女は一寸地蔵眉をよせると、萩の小枝を二本、○の上に翳して、「萩の花はおきらひ？」と尋ねかけた。',
    novel_year: '平成11年(1999) ※花の名随筆9　九月の花から',
    title: '挿頭花',
    author: '津村 信夫'
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
      kanji: '丸',
      strokes: [18, 8, 20]
    })
    await utils.createKanjiStrokes({
      kanji: '胃',
      strokes: [17, 21, 17, 16, 16, 17, 6, 16, 16]
    })
    await utils.createKanjiStrokes({
      kanji: '頭',
      strokes: [16, 17, 21, 16, 20, 18, 0, 16, 18, 17, 21, 16, 16, 16, 18, 20]
    })
  }
}
