const questionInfos = [
  {
    answers: ['丁'],
    hints: ['小学3年生で習います', '手八○口八○'],
    description: '次の線から成る漢字はなんでしょう？簡単です。',
    sentence:
      '○度叔母が表に出て、流のところに腰を曲め乍ら、鍋を洗つて居ると、そこへ立つて○寧に物を尋ねる一人の紳士がある。',
    novel_year: '明治39年(1906)',
    title: '破戒',
    author: '島崎 藤村'
  },
  {
    answers: ['休'],
    hints: ['小学1年生で習います', '急ぐな○むな', '部首は「にんべん」です'],
    description: '次の線から成る漢字はなんでしょう？ちょっと難しい。',
    sentence:
      '一寸電車にのって行くと、やっぱりモスクワ河に沿って、「文化と○みの公園」という数万坪の大公園がある。',
    novel_year: '昭和6年(1931)',
    title: 'ソヴェト労働者の夏○み',
    author: '	宮本 百合子'
  },
  {
    answers: ['課'],
    hints: ['部首は「ごんべん」です', '漢字の中に「日」があります', '人事考○'],
    description:
      '次の線から成る漢字はなんでしょう？難問です。小学4年生で習う漢字です。',
    sentence:
      '「ばッばかなッ」皆まで聞かず大江山○長は怒鳴った。「その機関長の室へ、直ぐ案内するのだ」',
    novel_year: '昭和12年(1937)',
    title: '地中魔',
    author: '海野 十三'
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
      kanji: '丁',
      strokes: [16, 26]
    })
    await utils.createKanjiStrokes({
      kanji: '休',
      strokes: [18, 17, 16, 17, 18, 15]
    })
    await utils.createKanjiStrokes({
      kanji: '課',
      strokes: [20, 16, 16, 16, 17, 21, 16, 17, 21, 16, 16, 16, 17, 18, 15]
    })
  }
}
