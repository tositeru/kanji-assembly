<template lang="pug">
	v-card(flat)
		v-card-text
			p 本サイトはお題として出された漢字を構成する線を組み立てて出来る漢字を当てるパズルを提供するサイトになります。
		v-card-text
			p 例えば以下のような線が問題として出されたときの正解は「三」になります。
			v-sheet(color="grey lighten-3" height="25vh")
				v-layout(class="strokes" align-center justify-space-around row fill-height wrap)
					div(class="stroke elevation-2" style="background-image: url(\"/strokes/16_㇐_CJK_STROKE_H.svg\");")
						| x3
		v-card-text
			p では、こちらはどのような漢字となるでしょうか？
			v-sheet(color="grey lighten-3" height="25vh")
				v-layout(class="strokes" align-center justify-space-around row fill-height wrap)
					div(class="stroke elevation-2" style="background-image: url(\"/strokes/06_㇆_CJK_STROKE_HZG.svg\");")
					div(class="stroke elevation-2" style="background-image: url(\"/strokes/17_㇑_CJK_STROKE_S.svg\");")
					div(class="stroke elevation-2" style="background-image: url(\"/strokes/31_㇟_CJK_STROKE_SWG.svg\");")
			p 答えは「也」となります。
		v-card-text
			p 次にこちらはどのような漢字となるでしょうか？
			v-sheet(color="grey lighten-3" height="25vh")
				v-layout(class="strokes" align-center justify-space-around row fill-height wrap)
					div(class="stroke elevation-2" style="background-image: url(\"/strokes/06_㇆_CJK_STROKE_HZG.svg\");")
					div(class="stroke elevation-2" style="background-image: url(\"/strokes/16_㇐_CJK_STROKE_H.svg\");")
						| x2
					div(class="stroke elevation-2" style="background-image: url(\"/strokes/17_㇑_CJK_STROKE_S.svg\");")
					div(class="stroke elevation-2" style="background-image: url(\"/strokes/21_㇕_CJK_STROKE_HZ.svg\");")
			p 答えは「司」となります。
		v-card-text
			p 上二つの例から線は長さが変わったり、少し傾くなどある程度の変形を許します。
		v-card-text
			p 注意点として、'㇠'と'㇈'は似た形ではありますが異なる線とし、互いに代用をすることはできません。
			v-sheet(color="grey lighten-3" height="25vh")
				v-layout(class="strokes" align-center justify-space-around row fill-height wrap)
					div(class="stroke elevation-2" style="background-image: url(\"/strokes/32_㇠_CJK_STROKE_HXWG.svg\");")
					div(class="stroke elevation-2" style="background-image: url(\"/strokes/08_㇈_CJK_STROKE_HZWG.svg\");")
			p '㇠'は漢字の「乙」として扱います。'㇈'は「飛」や「九」で使われます。
			p '㇠'は決して「九」で使われないことに注意してください。
		v-card-text
			p 同じく'㇀'と'㇒'は同じ形ではありますが、書く際の線の方向が真逆なため異なる線として扱います。
			v-sheet(color="grey lighten-3" height="25vh")
				v-layout(class="strokes" align-center justify-space-around row fill-height wrap)
					div(class="stroke elevation-2" style="background-image: url(\"/strokes/00_㇀_CJK_STROKE_T.svg\");")
					div(class="stroke elevation-2" style="background-image: url(\"/strokes/18_㇒_CJK_STROKE_P.svg\");")
			p '㇀'は下から上へ書き、部首の「にすい(冫)」の二画目として扱います。
			p '㇒'は上から下へ書き、「乏」の一画目や「木」の四画目の線になります。
		v-card-text
			p 使用する線の種類はCJK統合漢字から借用し、以下の36種類あります。
			v-sheet(color="grey lighten-3" style="overflow:scroll;")
				v-layout(class="strokes" align-center justify-space-around row fill-height wrap)
					div(v-for="(imagePath, i) in storkeList" :key="i" class="stroke elevation-2" :style="`background-image: url(${getStrokeImage(i)});`")


</template>
<script>
import Kanji from '~/kanji/kanji.js'

export default {
  data() {
    return {
      storkeList: Kanji.StrokeImageList
    }
  },
  methods: {
    getStrokeImage(strokeIndex) {
      const stroke = Kanji.getStrokeImage(strokeIndex)
      return stroke
    }
  }
}
</script>
<style lang="scss" scoped>
$breakpoint-xs: 600px;

/* $break-point以下の時に@contentを適用 */
@mixin max-screen($break-point) {
  @media screen and (max-width: $break-point) {
    @content;
  }
}

.strokes {
  width: 100%;
  height: 100%;
}
.stroke {
  width: 120px;
  height: 120px;
  background-size: cover;
  text-align: right;
  vertical-align: bottom;

  @include max-screen($breakpoint-xs) {
    width: 60px;
    height: 60px;
  }
}
</style>
