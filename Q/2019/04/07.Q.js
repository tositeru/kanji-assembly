module.exports = {
  /**
   * データ更新
   * @param {object} database db/database.jsからインポートしたもの
   * @param {object} utils 便利関数を集めたもの
   */
  async run(database, utils) {
    const date = utils.getDate(__filename)
    // 問題追加
    await utils.createQuestion({
      date: date,
      dateId: 0,
      type: 1,
      description: `次の線から成る漢字はなんでしょう？簡単です。
      「それ達人は○観す……栄枯は夢か幻か……」
      昭和3年(1928) あゝ玉杯に花うけて 佐藤 紅緑`,
      answers: ['大'],
      hints: ['小学一年生で習います', '○水に飲み水なし']
    })
    await utils.createQuestion({
      date: date,
      dateId: 1,
      type: 1,
      description: `次の線から成る漢字はなんでしょう？ちょっと難しい。
      「例の小さい踊り子は彼女と同じやうな上流○會の立派な令孃に仕上げられてゐた。」
      昭和7年(1932) 聖家族 堀 辰雄`,
      answers: ['社'],
      hints: [
        '小学2年生で習う漢字です',
        '学校で学ぶ科目の一つの頭文字です',
        '部首は「しめすへん」です'
      ]
    })
    await utils.createQuestion({
      date: date,
      dateId: 2,
      type: 1,
      description: `次の線から成る漢字はなんでしょう？難問です。
      「○色の翼が陽をうけて翻ると、金色に光つて、上を下へと、さながら三羽の金翅鳥が戯れてゐるかのやうなきらびやかな長閑さに見えた。」
      昭和10年(1935) 岬の春霞 牧野 信一`,
      answers: ['銀'],
      hints: [
        '昔から価値のあるものとして扱われていました',
        '火樹○花',
        '部首は「かねへん」です'
      ]
    })

    // 漢字を追加
    await utils.createKanjiStrokes({
      kanji: '大',
      strokes: [16, 18, 15]
    })
    await utils.createKanjiStrokes({
      kanji: '社',
      strokes: [20, 7, 17, 20, 16, 17, 16]
    })
    await utils.createKanjiStrokes({
      kanji: '銀',
      strokes: [18, 15, 16, 16, 17, 20, 18, 16, 21, 16, 16, 25, 18, 15]
    })
  }
}
