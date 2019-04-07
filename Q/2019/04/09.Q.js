const questionInfos = [
  {
    answers: ['刀'],
    hints: ['小学二年生で習います', 'お侍さんが持っています'],
    description: '次の線から成る漢字はなんでしょう？簡単です。',
    sentence:
      '若き日の飯島が本郷の○屋の前で、酒癖の浪人黒川孝蔵を無礼討にするこれがプロローグのように点出されている。',
    novel_year: '昭和18年(1943)',
    title: '我が円朝研究',
    author: '正岡 容'
  },
  {
    answers: ['糸'],
    hints: [
      '部首としても扱います',
      '日常生活のいろんなところで使われています',
      'なんの○瓜の皮'
    ],
    description: '次の線から成る漢字はなんでしょう？ちょっと難しい。',
    sentence: '植物から得られる○は、原則的には細胞壁からなるものである。',
    novel_year: '平成31年(2019) 4月',
    title: 'Wikipediaから',
    author: ''
  },
  {
    answers: ['題'],
    hints: ['部首は「おおがい」です', '漢字の中に「日」があります', '閑話休○'],
    description:
      '次の線から成る漢字はなんでしょう？難問です。小学３年生で習う漢字です。',
    sentence:
      '此処から以前の主○に戻って、... その観察者――紹介者の態度に大別して二様の傾向が在ると思わずには居られません。(一部省略)',
    novel_year: '昭和30年(1955)',
    title: 'Ｃ先生への手紙',
    author: '宮本 百合子'
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

    // 問題追加
    await utils.createQuestion({
      date: date,
      dateId: 2,
      type: 1,
      description: `次の線から成る漢字はなんでしょう？難問です。小学３年生で習う漢字です。
      「此処から以前の主○に戻って、此国の女性と、その観察者の態度と云う事に就て考えて見ると、私はどうしても、その観察者――紹介者の態度に大別して二様の傾向が在ると思わずには居られません。」
      昭和30年(1955) Ｃ先生への手紙 宮本 百合子`,
      answers: ['題'],
      hints: ['部首は「おおがい」です', '漢字の中に「日」があります', '閑話休○']
    })

    // 漢字を追加
    await utils.createKanjiStrokes({
      kanji: '刀',
      strokes: [6, 18]
    })
    await utils.createKanjiStrokes({
      kanji: '糸',
      strokes: [27, 28, 20, 17, 18, 20]
    })
    await utils.createKanjiStrokes({
      kanji: '題',
      strokes: [
        17,
        21,
        16,
        16,
        16,
        17,
        16,
        18,
        15,
        16,
        18,
        17,
        21,
        16,
        16,
        16,
        18,
        20
      ]
    })
  }
}
