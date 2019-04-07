const questionInfos = [
  {
    answers: ['弓'],
    hints: ['小学２年生で習います', '弦なき○に羽抜け鳥'],
    description: '次の線から成る漢字はなんでしょう？簡単です。',
    sentence:
      '流石の剛の者も参って仕舞った。武田の○隊長○削某と云う者だと伝える。',
    novel_year: '昭和62年(1987)',
    title: '長篠合戦',
    author: '菊池 寛'
  },
  {
    answers: ['犯'],
    hints: ['小学5年生で習います', '一生不○', '部首は「けものへん」です'],
    description:
      '次の線から成る漢字はなんでしょう？あまりいい意味では使われません。',
    sentence:
      'のみならず、式家の長子広嗣はその妻を玄昉に○され、激怒のあまり反乱を起して誅せられ、その一族に朝敵の汚名すらも蒙つてゐた。',
    novel_year: '昭和22年(1947)',
    title: '道鏡',
    author: '坂口 安吾'
  },
  {
    answers: ['器'],
    hints: [
      '漢字の中に同じ形の漢字が4つあります',
      '大道不○',
      '○と月夜はいつも良い'
    ],
    description:
      '次の線から成る漢字はなんでしょう？難問です。小学4年生で習います。',
    sentence:
      '長五郎が思ひあまつたやうに不○用な手つきで蝶子の右腕をつかんだ。蝶子は聲をしのんで暫く泣いてゐた。',
    novel_year: '昭和33年(1958)',
    title: 'うき草',
    author: '林 芙美子'
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
      kanji: '弓',
      strokes: [21, 16, 9]
    })
    await utils.createKanjiStrokes({
      kanji: '犯',
      strokes: [18, 1, 18, 6, 31]
    })
    await utils.createKanjiStrokes({
      kanji: '器',
      strokes: [17, 21, 16, 17, 21, 16, 16, 18, 15, 17, 21, 16, 17, 21, 16]
    })
  }
}
