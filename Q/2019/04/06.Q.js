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
      「○子服は莒の羅店の人であった。」
      大正15年(1926) 嬰寧 蒲 松齢 (翻訳 田中 貢太郎)`,
      answers: ['王'],
      hints: ['小学一年生で習います', '天○山']
    })
    await utils.createQuestion({
      date: date,
      dateId: 1,
      type: 1,
      description: `次の線から成る漢字はなんでしょう？ちょっと難しい。
      「しかし、幕間の気分には、その為めに「落ちつき」と「○かみ」が生じる。一種の「気品」さへもついて来る。」
      大正14年(1925) 幕間 岸田 国士`,
      answers: ['温'],
      hints: [
        '季節によってはありがたいものです',
        '部首は「さんずい」です',
        '快活○柔'
      ]
    })
    await utils.createQuestion({
      date: date,
      dateId: 2,
      type: 1,
      description: `次の線から成る漢字はなんでしょう？難問です。小学6年生で習うお硬い意味合いで使われる漢字です。
      「第一条  この法律は、警察官が警察法（昭和二十九年法律第百六十二号）に規定する個人の生命、身体及び財産の保護、犯罪の予防、公安の維持並びに他の法令の執行等の職○職務を忠実に遂行するために、必要な手段を定めることを目的とする。」
      平成4年(1992) 警察官職務執行法 	日本国`,
      answers: ['権'],
      hints: ['○輿', '部首は「きへん」です', '自由民○']
    })

    // 漢字を追加
    await utils.createKanjiStrokes({
      kanji: '王',
      strokes: [16, 17, 16, 16]
    })
    await utils.createKanjiStrokes({
      kanji: '温',
      strokes: [15, 15, 0, 17, 21, 16, 16, 17, 21, 17, 17, 16]
    })
    await utils.createKanjiStrokes({
      kanji: '権',
      strokes: [16, 17, 18, 15, 18, 16, 16, 18, 17, 18, 16, 17, 16, 16, 16]
    })
  }
}
