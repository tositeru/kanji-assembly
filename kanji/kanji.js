'use strict'

const strokeImageList = [
  '00_㇀_CJK_STROKE_T.svg',
  '01_㇁_CJK_STROKE_WG.svg',
  '02_㇂_CJK_STROKE_XG.svg',
  '03_㇃_CJK_STROKE_BXG.svg',
  '04_㇄_CJK_STROKE_SW.svg',
  '05_㇅_CJK_STROKE_HZZ.svg',
  '06_㇆_CJK_STROKE_HZG.svg',
  '07_㇇_CJK_STROKE_HP.svg',
  '08_㇈_CJK_STROKE_HZWG.svg',
  '09_㇉_CJK_STROKE_SZWG.svg',
  '10_㇊_CJK_STROKE_HZT.svg',
  '11_㇋_CJK_STROKE_HZZP.svg',
  '12_㇌_CJK_STROKE_HPWG.svg',
  '13_㇍_CJK_STROKE_HZW.svg',
  '14_㇎_CJK_STROKE_HZZZ.svg',
  '15_㇏_CJK_STROKE_N.svg',
  '16_㇐_CJK_STROKE_H.svg',
  '17_㇑_CJK_STROKE_S.svg',
  '18_㇒_CJK_STROKE_P.svg',
  '19_㇓_CJK_STROKE_SP.svg',
  '20_㇔_CJK_STROKE_D.svg',
  '21_㇕_CJK_STROKE_HZ.svg',
  '22_㇖_CJK_STROKE_HG.svg',
  '23_㇗_CJK_STROKE_SZ.svg',
  '24_㇘_CJK_STROKE_SWZ.svg',
  '25_㇙_CJK_STROKE_ST.svg',
  '26_㇚_CJK_STROKE_SG.svg',
  '27_㇛_CJK_STROKE_PD.svg',
  '28_㇜_CJK_STROKE_PZ.svg',
  '29_㇝_CJK_STROKE_TN.svg',
  '30_㇞_CJK_STROKE_SZZ.svg',
  '31_㇟_CJK_STROKE_SWG.svg',
  '32_㇠_CJK_STROKE_HXWG.svg',
  '33_㇡_CJK_STROKE_HZZZG.svg',
  '34_㇢_CJK_STROKE_PG.svg',
  '35_㇣_CJK_STROKE_Q.svg'
]

module.exports = {
  StrokeImageList: strokeImageList,
  getStrokeImage(index) {
    return './strokes/' + strokeImageList[index]
  }
}
