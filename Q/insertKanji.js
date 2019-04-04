/**
 * @param {string} kanji 
 * @param {Array<integer>} strokes 
 */
function makeKanjiStrokes(kanji, strokes) {
	return {
		kanji: kanji,
		strokes: strokes
	}
}

const kanjis = [
	// 三画
	makeKanjiStrokes('夕', [18, 7, 20]),
	makeKanjiStrokes('川', [19, 17, 17]),
	// 四画
	makeKanjiStrokes('心', [18, 3, 20, 20]),
	// 八画
	makeKanjiStrokes('和', [18, 16, 17, 18, 15, 17, 21, 16]),
	// 九画
	makeKanjiStrokes('秋', [18, 16, 17, 18, 15, 20, 18, 19, 15]),
	// 十画
	makeKanjiStrokes('高', [17, 16, 17, 21, 16, 17, 6, 17, 21, 16]),
	// 十六画
	makeKanjiStrokes('整', [16, 17, 21, 16, 17, 18, 15, 18, 16, 18, 15, 16, 17, 16, 17, 16]),
	makeKanjiStrokes('築', [18, 16, 20, 18, 16, 20, 16, 17, 16, 19, 8, 20, 16, 17, 18, 15]),
	// 二十画
	makeKanjiStrokes('競', [17, 16, 17, 17, 16, 17, 21, 16, 18, 25, 17, 16, 17, 17, 16, 17, 21, 16, 18, 31])
]

module.exports = {
  /**
   * データ更新
   * @param {object} database db/database.jsからインポートしたもの
   * @param {object} utils 便利関数を集めたもの
   */
  async run(database, utils) {
		// 漢字を追加
		for (const kanji of kanjis) {
			await utils.createKanjiStrokes(kanji)
		}
  }
}
